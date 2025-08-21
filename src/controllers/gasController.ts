import { NextFunction, Request, Response } from 'express';
import { scrapeGasUsage } from '../services/gasService.js';
/**
 * ガス代取得API.
 */
export const getGasUsage = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await scrapeGasUsage();
    res.json(response);
  } catch (error) {
    next(error);
  }
};
