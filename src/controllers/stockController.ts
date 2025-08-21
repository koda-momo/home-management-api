import { NextFunction, Request, Response } from 'express';
import {
  getAllStockService,
  getStockService,
  postAddCountService,
  postSubCountService,
} from '../services/stockService';

/**
 * 在庫情報全取得API.
 */
export const getAllStockController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await getAllStockService();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * 在庫情報ID取得API.
 */
export const getIdStockController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await getStockService(req.params);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * 在庫個数追加API.
 */
export const postAddStockCountController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await postAddCountService(req.body);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * 在庫個数削除API.
 */
export const postSubStockCountController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await postSubCountService(req.body);
    res.json(response);
  } catch (error) {
    next(error);
  }
};
