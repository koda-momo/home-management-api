import { NextFunction, Request, Response } from 'express';
import { ErrorResponse } from '../utils/types.js';

export const errorHandler = (
  err: ErrorResponse,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): Response => {
  return res.status(err.statusCode).json({
    message: err.message,
    status: err.statusCode,
  });
};

export const notFoundHandler = (_req: Request, res: Response): Response => {
  return res.status(404).json({
    message: 'Not Found',
    status: 404,
  });
};
