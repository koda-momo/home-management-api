import z from 'zod';
import { errorResponse } from '../utils/const';

/**
 * 支出額追加API バリデーション.
 */
export const postSpentSchema = z.object({
  credit: z.number(`クレジット:${errorResponse.spentMustBeNumber.message}`),
  other: z.number(`その他:${errorResponse.spentMustBeNumber.message}`),
});
