import z from 'zod';
import { errorResponse } from '../utils/const';

/**
 * 在庫情報ID取得API バリデーション.
 */
export const getIdStockSchema = z.object({
  id: z.coerce.number(errorResponse.idMustBeNumber),
});

/**
 * 在庫個数追加API バリデーション.
 */
export const postAddStockCountSchema = z.object({
  id: z.coerce.number(errorResponse.idMustBeNumber),
});

/**
 * 在庫個数削除API バリデーション.
 */
export const postSubStockCountSchema = z.object({
  id: z.coerce.number(errorResponse.idMustBeNumber),
});
