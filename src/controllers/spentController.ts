import { Request, Response, NextFunction } from 'express';
import {
  getAllSpentService,
  getMonthSpentService,
  postSpentService,
} from '../services/spentService';

/**
 * 支出額全取得API.
 */
export const getAllSpentController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await getAllSpentService();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * 支出額当月取得API.
 */
export const getMonthSpentController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await getMonthSpentService();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * 支出額追加API.
 */
export const postSpentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await postSpentService(req.body);
    res.json(response);
  } catch (error) {
    next(error);
  }
};
