import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { validateIdAndCount, createSuccessResponse } from './public/utils';
import { testPrismaConnection } from './config/prisma';
import { StockModel } from './models/stock';
import { STOCK_API_BASE_URL } from './public/const';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get(STOCK_API_BASE_URL, async (req: Request, res: Response) => {
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
      const item = await StockModel.getById(itemId);
      data = item ? [item] : [];
    } else if (name) {
      const itemName = name as string;
      data = await StockModel.getByName(itemName);
    } else {
      data = await StockModel.getAll();
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
});

app.post(
  `${STOCK_API_BASE_URL}/count/add`,
  async (req: Request, res: Response) => {
    try {
      const validation = validateIdAndCount(req.body.id, req.body.count, res);
      if (!validation) return;

      const { id, count } = validation;

      const item = await StockModel.getById(id);
      if (!item) {
        return res.status(404).json({
          status: 404,
          message: 'Item not found',
          data: null,
        });
      }

      const newCount = item.count + count;
      if (newCount >= 21) {
        return res.status(400).json({
          status: 400,
          message: 'Cannot add count: total would exceed limit of 20',
          data: null,
        });
      }

      const updated = await StockModel.updateCount(id, newCount);
      if (!updated) {
        return res.status(500).json({
          status: 500,
          message: 'Failed to update count',
          data: null,
        });
      }

      res.json(
        createSuccessResponse('Count added successfully', {
          id: item.id,
          name: item.name,
          count: newCount,
          url: item.url,
        })
      );
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: null,
      });
    }
  }
);

app.post(
  `${STOCK_API_BASE_URL}/count/delete`,
  async (req: Request, res: Response) => {
    try {
      const validation = validateIdAndCount(req.body.id, req.body.count, res);
      if (!validation) return;

      const { id, count } = validation;

      const item = await StockModel.getById(id);
      if (!item) {
        return res.status(404).json({
          status: 404,
          message: 'Item not found',
          data: null,
        });
      }

      const newCount = item.count - count;
      if (newCount < 0) {
        return res.status(400).json({
          status: 400,
          message: 'Cannot delete count: result would be negative',
          data: null,
        });
      }

      const updated = await StockModel.updateCount(id, newCount);
      if (!updated) {
        return res.status(500).json({
          status: 500,
          message: 'Failed to update count',
          data: null,
        });
      }

      res.json(
        createSuccessResponse('Count deleted successfully', {
          id: item.id,
          name: item.name,
          count: newCount,
          url: item.url,
        })
      );
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: null,
      });
    }
  }
);

app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);

  try {
    await testPrismaConnection();
  } catch (error) {
    console.error(
      'Failed to connect to database. Server will continue without database connection.',
      error
    );
  }
});
