import z from 'zod';
import { errorResponse } from '../utils/const';

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
