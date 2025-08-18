import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  // Express error handlers must have 4 parameters
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _next = next;

  res.status(500).json({
    status: 500,
    message: 'Internal server error',
    data: null,
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    status: 404,
    message: 'Route not found',
    data: null,
  });
};
