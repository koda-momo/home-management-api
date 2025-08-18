import { z } from 'zod';

// ID(必須)
const idSchema = {
  id: z
    .union([z.string(), z.number()])
    .transform((val) => {
      const parsed = typeof val === 'string' ? parseInt(val, 10) : val;
      if (isNaN(parsed)) {
        throw new z.ZodError([
          {
            code: 'custom',
            message: 'id must be a valid number',
            path: ['id'],
          },
        ]);
      }
      return parsed;
    })
    .refine((val) => Number.isInteger(val) && val > 0, {
      message: 'id must be a positive integer',
    }),
};

// ID(任意)
const idOptimalSchema = {
  id: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined) return undefined;
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        throw new z.ZodError([
          {
            code: 'custom',
            message: 'id must be a valid number',
            path: ['id'],
          },
        ]);
      }
      return parsed;
    }),
};

// 個数
const countSchema = {
  count: z
    .union([z.string(), z.number()])
    .transform((val) => {
      const parsed = typeof val === 'string' ? parseInt(val, 10) : val;
      if (isNaN(parsed)) {
        throw new z.ZodError([
          {
            code: 'custom',
            message: 'count must be a valid number',
            path: ['count'],
          },
        ]);
      }
      return parsed;
    })
    .refine((val) => Number.isInteger(val) && val > 0, {
      message: 'count must be a positive integer',
    }),
};

/**
 * 在庫情報取得APIバリデーション.
 */
export const getStockSchema = z.object({
  ...idOptimalSchema,
  name: z.string().optional(),
});

/**
 * 在庫個数増減APIバリデーション.
 */
export const postStockCountSchema = z.object({
  ...idSchema,
  ...countSchema,
});

export type StockIdAndCountInput = z.input<typeof postStockCountSchema>;
export type StockIdAndCountOutput = z.output<typeof postStockCountSchema>;
export type getStockSchema = z.input<typeof getStockSchema>;
export type StockQueryOutput = z.output<typeof getStockSchema>;
