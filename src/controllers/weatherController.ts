import { NextFunction, Request, Response } from 'express';
import { scrapeWeather } from '../services/weatherService';
/**
 * 天気情報取得API.
 */
export const getWeather = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await scrapeWeather();
    res.json(response);
  } catch (error) {
    next(error);
  }
};
