import { z } from 'zod';

export const postLineSchema = z.object({
  message: z.string('メッセージを入力してください'),
});
