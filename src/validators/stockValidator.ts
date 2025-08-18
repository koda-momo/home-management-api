import { ZodError } from 'zod';
import {
  postStockCountSchema,
  getStockSchema,
  type StockIdAndCountOutput,
  type StockQueryOutput,
} from '../schemas/stockSchemas.js';

export class ValidationError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateIdAndCount = (data: unknown): StockIdAndCountOutput => {
  try {
    return postStockCountSchema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      throw new ValidationError(firstError.message, 400);
    }
    throw new ValidationError('Validation failed', 400);
  }
};

export const validateStockQuery = (data: unknown): StockQueryOutput => {
  try {
    return getStockSchema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      throw new ValidationError(firstError.message, 400);
    }
    throw new ValidationError('Validation failed', 400);
  }
};
