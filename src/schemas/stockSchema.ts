import z from 'zod';
import { errorResponse } from '../utils/const';

/**
 * 在庫情報全取得API バリデーション（ページネーションと検索機能付き）.
 */
export const getAllStockSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  keyword: z.string().optional(),
});

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
