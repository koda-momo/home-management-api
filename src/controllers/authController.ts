import type { NextFunction, Request, Response } from 'express';
import {
  loginService,
  getAuthStatusService,
  logoutService,
} from '../services/authService.js';
import type {
  LoginRequest,
  LoginResponse,
  StatusResponse,
} from '../types/authType.js';

export const loginController = (
  req: Request<object, LoginResponse, LoginRequest>,
  res: Response<LoginResponse>,
  next: NextFunction
): void => {
  try {
    const { response, token } = loginService(req.body);

    res.cookie('authToken', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24時間
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const statusController = (
  req: Request,
  res: Response<StatusResponse>,
  next: NextFunction
): void => {
  try {
    const token = req.cookies?.authToken;
    const response = getAuthStatusService(token);

    if (!response.authenticated && token) {
      res.clearCookie('authToken');
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const logoutController = (
  req: Request,
  res: Response<LoginResponse>,
  next: NextFunction
): void => {
  try {
    const token = req.cookies?.authToken;
    const response = logoutService(token);

    if (token) {
      res.clearCookie('authToken');
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
};
