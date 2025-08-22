import { randomUUID } from 'crypto';
import type { Session } from '../utils/types.js';

const sessions: Record<string, Session> = {};

const AUTH_EMAIL = process.env.AUTH_EMAIL || '';
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || '';

export const validateCredentials = (
  email: string,
  password: string
): boolean => {
  return email === AUTH_EMAIL && password === AUTH_PASSWORD;
};

export const createSession = (email: string): string => {
  const token = randomUUID();
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24時間

  sessions[token] = {
    email,
    expires,
  };

  return token;
};

export const validateSession = (token: string): Session | null => {
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

export const removeSession = (token: string): void => {
  delete sessions[token];
};
