import { StockModel } from '../models/stock.js';
import { InventoryItem } from '../utils/types.js';

interface StockResponse {
  id: number;
  name: string;
  count: number;
  url: string;
}

export class StockService {
  static async getStock(id?: number, name?: string): Promise<InventoryItem[]> {
    if (id) {
      const item = await StockModel.getById(id);
      return item ? [item] : [];
    }

    if (name) {
      return await StockModel.getByName(name);
    }

    return await StockModel.getAll();
  }

  static async addCount(id: number, count: number): Promise<StockResponse> {
    const item = await StockModel.getById(id);
    if (!item) {
      throw new Error('Item not found');
    }

    const newCount = item.count + count;
    if (newCount >= 21) {
      throw new Error('Cannot add count: total would exceed limit of 20');
    }

    const updated = await StockModel.updateCount(id, newCount);
    if (!updated) {
      throw new Error('Failed to update count');
    }

    return {
      id: item.id,
      name: item.name,
      count: newCount,
      url: item.url,
    };
  }

  static async deleteCount(id: number, count: number): Promise<StockResponse> {
    const item = await StockModel.getById(id);
    if (!item) {
      throw new Error('Item not found');
    }

    const newCount = item.count - count;
    if (newCount < 0) {
      throw new Error('Cannot delete count: result would be negative');
    }

    const updated = await StockModel.updateCount(id, newCount);
    if (!updated) {
      throw new Error('Failed to update count');
    }

    return {
      id: item.id,
      name: item.name,
      count: newCount,
      url: item.url,
    };
  }
}
