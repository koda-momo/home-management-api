import { Request, Response } from 'express';
import { StockService } from '../services/stockService.js';
import { validateIdAndCount } from '../validators/stockValidator.js';
import { createSuccessResponse } from '../utils/utils.js';

export class StockController {
  static async getStock(req: Request, res: Response): Promise<Response | void> {
    try {
      const { id, name } = req.query;

      let data;
      if (id) {
        const itemId = parseInt(id as string);
        if (isNaN(itemId)) {
          return res.status(400).json({
            status: 400,
            message: 'Invalid id parameter',
            data: [],
          });
        }
        data = await StockService.getStock(itemId);
      } else if (name) {
        data = await StockService.getStock(undefined, name as string);
      } else {
        data = await StockService.getStock();
      }

      if ((id || name) && data.length === 0) {
        return res.status(404).json({
          status: 404,
          message: 'Item not found',
          data: [],
        });
      }

      res.json({
        status: 200,
        message: 'Success',
        data,
      });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: [],
      });
    }
  }

  static async addCount(req: Request, res: Response): Promise<Response | void> {
    try {
      const validation = validateIdAndCount(req.body.id, req.body.count, res);
      if (!validation) return;

      const { id, count } = validation;

      const result = await StockService.addCount(id, count);
      res.json(createSuccessResponse('Count added successfully', result));
    } catch (error) {
      console.error('Database error:', error);

      if (error instanceof Error) {
        if (error.message === 'Item not found') {
          return res.status(404).json({
            status: 404,
            message: error.message,
            data: null,
          });
        }

        if (
          error.message.includes('exceed limit') ||
          error.message.includes('negative')
        ) {
          return res.status(400).json({
            status: 400,
            message: error.message,
            data: null,
          });
        }
      }

      res.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: null,
      });
    }
  }

  static async deleteCount(req: Request, res: Response): Promise<Response | void> {
    try {
      const validation = validateIdAndCount(req.body.id, req.body.count, res);
      if (!validation) return;

      const { id, count } = validation;

      const result = await StockService.deleteCount(id, count);
      res.json(createSuccessResponse('Count deleted successfully', result));
    } catch (error) {
      console.error('Database error:', error);

      if (error instanceof Error) {
        if (error.message === 'Item not found') {
          return res.status(404).json({
            status: 404,
            message: error.message,
            data: null,
          });
        }

        if (
          error.message.includes('exceed limit') ||
          error.message.includes('negative')
        ) {
          return res.status(400).json({
            status: 400,
            message: error.message,
            data: null,
          });
        }
      }

      res.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: null,
      });
    }
  }
}
