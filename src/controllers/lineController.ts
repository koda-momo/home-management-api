import { Request, Response, NextFunction } from 'express';
import { postLineService } from '../services/lineService';

/**
 * LINE送信API.
 */
export const postLineController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await postLineService(req.body);
    res.json(response);
  } catch (error) {
    next(error);
  }
};
