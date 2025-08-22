import type { Request, Response } from 'express';
import {
  validateCredentials,
  createSession,
  validateSession,
  removeSession,
} from '../services/authService.js';
import type {
  LoginRequest,
  LoginResponse,
  StatusResponse,
} from '../utils/types.js';

export const login = (
  req: Request<object, LoginResponse, LoginRequest>,
  res: Response<LoginResponse>
): void => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ message: 'メールアドレスとパスワードを入力してください' });
      return;
    }

    if (!validateCredentials(email, password)) {
      res
        .status(401)
        .json({ message: 'メールアドレスまたはパスワードが間違っています' });
      return;
    }

    const token = createSession(email);

    res.cookie('authToken', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24時間
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.json({ message: 'ログイン成功' });
  } catch {
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};

export const status = (req: Request, res: Response<StatusResponse>): void => {
  try {
    const token = req.cookies?.authToken;

    if (!token) {
      res.json({ authenticated: false });
      return;
    }

    const session = validateSession(token);

    if (!session) {
      res.clearCookie('authToken');
      res.json({ authenticated: false });
      return;
    }

    res.json({ authenticated: true, email: session.email });
  } catch {
    res.status(500).json({ authenticated: false });
  }
};

export const logout = (req: Request, res: Response<LoginResponse>): void => {
  try {
    const token = req.cookies?.authToken;

    if (token) {
      removeSession(token);
      res.clearCookie('authToken');
    }

    res.json({ message: 'ログアウトしました' });
  } catch {
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};
