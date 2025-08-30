import z from 'zod';
import { errorResponse } from '../utils/const';

/**
 * カート挿入API バリデーション.
 */
export const postCartInsertSchema = z.object({
  id: z.coerce.number(errorResponse.idMustBeNumber),
});
