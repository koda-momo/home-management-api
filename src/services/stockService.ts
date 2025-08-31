import { Request } from 'express';
import { StockModel } from '../models/stock';
import {
  getAllStockSchema,
  getIdStockSchema,
  postAddStockCountSchema,
  postSubStockCountSchema,
} from '../schemas/stockSchema';
import { StockApiData, StockDbData } from '../types/stockType';
import {
  EDIT_STOCK_COUNT,
  MAX_STOCK_COUNT,
  MIN_STOCK_COUNT,
  errorResponse,
} from '../utils/const';
import { validation } from '../schemas';

const toCamelCaseKeys = (data: StockDbData): StockApiData => {
  const { created_at, updated_at, ...rest } = data;
  return {
    ...rest,
    createdAt: created_at,
    updatedAt: updated_at,
  };
};

/**
 * 在庫情報全取得API.
 */
export const getAllStockService = async (): Promise<StockApiData[]> => {
  const data = await StockModel.getAll();
  if (!data) {
    throw errorResponse.stockNotFound;
  }

  const responseData = data.map((item) => toCamelCaseKeys(item));
  return responseData;
};

/**
 * 在庫情報全取得API（ページネーションと検索機能付き）.
 */
export const getAllStockWithPaginationService = async (
  query: Request['query']
): Promise<StockApiData[]> => {
  const { page, keyword } = validation(query, getAllStockSchema);
  const data = await StockModel.getAllWithPagination(page, keyword);

  if (!data) {
    throw errorResponse.stockNotFound;
  }

  const responseData = data.map((item) => toCamelCaseKeys(item));
  return responseData;
};

/**
 * 在庫情報ID取得API.
 */
export const getStockService = async (
  query: Request['params']
): Promise<StockApiData[]> => {
  const { id } = validation(query, getIdStockSchema);
  const data = await StockModel.getById(id);
  if (!data) {
    throw errorResponse.stockNotFound;
  }
  return [toCamelCaseKeys(data)];
};

/**
 * 在庫個数追加API.
 */
export const postAddCountService = async (
  body: Request['body']
): Promise<StockApiData> => {
  const { id } = validation(body, postAddStockCountSchema);
  const data = await StockModel.getById(id);

  // エラーチェック
  if (!data) {
    throw errorResponse.stockNotFound;
  }

  const newCount = data.count + EDIT_STOCK_COUNT;
  if (newCount >= MAX_STOCK_COUNT) {
    throw errorResponse.maxStockCount;
  }

  // 更新処理
  const updated = await StockModel.updateCount(id, newCount);
  if (!updated) {
    throw errorResponse.failedToUpdateCount;
  }

  return toCamelCaseKeys(updated);
};

/**
 * 在庫個数削除API.
 */
export const postSubCountService = async (
  body: Request['body']
): Promise<StockApiData> => {
  const { id } = validation(body, postSubStockCountSchema);
  const data = await StockModel.getById(id);

  // エラーチェック
  if (!data) {
    throw errorResponse.stockNotFound;
  }

  const newCount = data.count - EDIT_STOCK_COUNT;
  if (newCount < MIN_STOCK_COUNT) {
    throw errorResponse.minStockCount;
  }

  // 更新処理
  const updated = await StockModel.updateCount(id, newCount);
  if (!updated) {
    throw errorResponse.failedToUpdateCount;
  }

  return toCamelCaseKeys(updated);
};
