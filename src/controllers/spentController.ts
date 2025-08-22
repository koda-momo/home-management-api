import { Request, Response, NextFunction } from 'express';
import { getSpentService } from '../services/spentService';

/**
 * 支出額取得API.
 */
export const getSpentController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await getSpentService();
    res.json(response);
  } catch (error) {
    next(error);
  }
};
