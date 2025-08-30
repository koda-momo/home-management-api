import { NextFunction, Request, Response } from 'express';
import {
  getAllStockService,
  getAllStockWithPaginationService,
  getStockService,
  postAddCountService,
  postSubCountService,
} from '../services/stockService';

/**
 * 在庫情報全取得API（ページネーションと検索機能付き）.
 */
export const getAllStockController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // クエリパラメータが存在する場合はページネーション機能を使用
    if (req.query.page || req.query.keyword) {
      const response = await getAllStockWithPaginationService(req.query);
      res.json(response);
    } else {
      // 従来の全件取得を維持
      const response = await getAllStockService();
      res.json(response);
    }
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
