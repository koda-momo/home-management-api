import { NextFunction, Request, Response } from 'express';
import { insertToCart } from '../services/cartService';
import { postCartInsertSchema } from '../schemas/cartSchema';
import { CartInsertRequest } from '../types/cartType';

/**
 * カート挿入API.
 */
export const postCartInsert = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // リクエストボディのバリデーション
    const validatedData: CartInsertRequest = postCartInsertSchema.parse(
      req.body
    );

    const response = await insertToCart(validatedData.id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};
