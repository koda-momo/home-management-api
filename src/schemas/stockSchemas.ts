import { z } from 'zod';

export const StockIdAndCountSchema = z.object({
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
});

export const StockQuerySchema = z.object({
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
  name: z.string().optional(),
});

export type StockIdAndCountInput = z.input<typeof StockIdAndCountSchema>;
export type StockIdAndCountOutput = z.output<typeof StockIdAndCountSchema>;
export type StockQueryInput = z.input<typeof StockQuerySchema>;
export type StockQueryOutput = z.output<typeof StockQuerySchema>;
