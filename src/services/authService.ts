import { randomUUID } from 'crypto';
import type {
  LoginResponse,
  Session,
  StatusResponse,
} from '../types/authType.js';
import { validation } from '../schemas/index.js';
import { loginRequestSchema } from '../schemas/authSchema.js';
import { errorResponse } from '../utils/const.js';

const sessions: Record<string, Session> = {};

const AUTH_EMAIL = process.env.AUTH_EMAIL || '';
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || '';

const validateCredentials = (email: string, password: string): boolean => {
  return email === AUTH_EMAIL && password === AUTH_PASSWORD;
};

const createSession = (email: string): string => {
  const token = randomUUID();
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24時間

  sessions[token] = {
    email,
    expires,
  };

  return token;
};

const validateSession = (token: string): Session | null => {
  const session = sessions[token];

  if (!session) {
    return null;
  }

  if (session.expires <= Date.now()) {
    delete sessions[token];
    return null;
  }

  return session;
};

const removeSession = (token: string): void => {
  delete sessions[token];
};

export const loginService = (
  body: unknown
): { response: LoginResponse; token: string } => {
  const { email, password } = validation(body, loginRequestSchema);

  if (!email || !password) {
    throw {
      ...errorResponse.badRequest,
      message: 'メールアドレスとパスワードを入力してください',
    };
  }

  if (!validateCredentials(email, password)) {
    throw {
      statusCode: 401,
      name: 'Error',
      message: 'メールアドレスまたはパスワードが間違っています',
    };
  }

  const token = createSession(email);

  return { response: { message: 'ログイン成功' }, token };
};

export const getAuthStatusService = (token?: string): StatusResponse => {
  if (!token) {
    return { authenticated: false };
  }

  const session = validateSession(token);

  if (!session) {
    return { authenticated: false };
  }

  return { authenticated: true, email: session.email };
};

export const logoutService = (token?: string): LoginResponse => {
  if (token) {
    removeSession(token);
  }

  return { message: 'ログアウトしました' };
};

export { createSession };
