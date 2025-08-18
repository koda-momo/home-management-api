import { Request, Response } from 'express';
import { StockService } from '../services/stockService.js';
import {
  validateIdAndCount,
  validateStockQuery,
  ValidationError,
} from '../validators/stockValidator.js';
import { createSuccessResponse } from '../utils/utils.js';

export class StockController {
  static async getStock(req: Request, res: Response): Promise<Response | void> {
    try {
      const { id, name } = validateStockQuery(req.query);

      let data;
      if (id !== undefined) {
        data = await StockService.getStock(id);
      } else if (name) {
        data = await StockService.getStock(undefined, name);
      } else {
        data = await StockService.getStock();
      }

      if ((id !== undefined || name) && data.length === 0) {
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
      if (error instanceof ValidationError) {
        return res.status(error.statusCode).json({
          status: error.statusCode,
          message: error.message,
          data: [],
        });
      }

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
      const { id, count } = validateIdAndCount(req.body);

      const result = await StockService.addCount(id, count);
      res.json(createSuccessResponse('Count added successfully', result));
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(error.statusCode).json({
          status: error.statusCode,
          message: error.message,
          data: null,
        });
      }

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

      console.error('Database error:', error);
      res.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: null,
      });
    }
  }

  static async deleteCount(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    try {
      const { id, count } = validateIdAndCount(req.body);

      const result = await StockService.deleteCount(id, count);
      res.json(createSuccessResponse('Count deleted successfully', result));
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(error.statusCode).json({
          status: error.statusCode,
          message: error.message,
          data: null,
        });
      }

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

      console.error('Database error:', error);
      res.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: null,
      });
    }
  }
}
