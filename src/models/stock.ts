import { prisma } from '../config/prisma.js';
import { InventoryItem } from '../utils/types.js';

export class StockModel {
  static async getAll(): Promise<InventoryItem[]> {
    const stocks = await prisma.stock.findMany({
      orderBy: { id: 'asc' },
    });
    return stocks;
  }

  static async getById(id: number): Promise<InventoryItem | null> {
    const stock = await prisma.stock.findUnique({
      where: { id },
    });
    return stock;
  }

  static async getByName(name: string): Promise<InventoryItem[]> {
    const stocks = await prisma.stock.findMany({
      where: {
        name: {
          contains: name,
        },
      },
      orderBy: { id: 'asc' },
    });
    return stocks;
  }

  static async updateCount(id: number, newCount: number): Promise<boolean> {
    try {
      const result = await prisma.stock.update({
        where: { id },
        data: { count: newCount },
      });
      return !!result;
    } catch {
      return false;
    }
  }
}
