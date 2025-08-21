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

/**
 * zodエラー処理を含むバリデーション関数.
 * @param object 確認したいオブジェクト
 * @param schema バリデーションスキーマ
 * @returns 検証済みオブジェクト
 */
export const validation = <T extends z.ZodTypeAny>(
  object: unknown,
  schema: T
): z.infer<T> => {
  try {
    return schema.parse(object);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodErrorMessage = error.issues[0].message;
      throw {
        ...errorResponse.badRequest,
        message: zodErrorMessage,
      };
    }

    throw errorResponse.badRequest;
  }
};
