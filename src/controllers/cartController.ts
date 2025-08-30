import { NextFunction, Request, Response } from 'express';
import { insertToCart } from '../services/cartService';

/**
 * カート挿入API.
 */
export const postCartInsert = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await insertToCart();
    res.json(response);
  } catch (error) {
    next(error);
  }
};
