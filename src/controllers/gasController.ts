import { Request, Response } from 'express';
import { scrapeGasUsage } from '../services/gasService.js';

export const getGasUsage = async (req: Request, res: Response) => {
  try {
    const gasData = await scrapeGasUsage();
    res.status(200).json(gasData);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('ガス使用量の取得でエラーが発生しました:', error);
    res.status(500).json({
      name: 'Error',
      message: 'Internal Server Error',
      statusCode: 500,
    });
  }
};
