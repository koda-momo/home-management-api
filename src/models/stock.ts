import { prisma } from '../config/prisma';
import { StockDbData } from '../types/stockType';
import { getNowInJapan } from '../utils/timezone';

export class StockModel {
  static async getAll(): Promise<StockDbData[]> {
    const stocks = await prisma.stock.findMany({
      orderBy: { id: 'asc' },
    });
    return stocks;
  }

  static async getById(id: number): Promise<StockDbData | null> {
    const stock = await prisma.stock.findUnique({
      where: { id },
    });
    return stock;
  }

  static async updateCount(
    id: number,
    newCount: number
  ): Promise<StockDbData | null> {
    try {
      const result = await prisma.stock.update({
        where: { id },
        data: {
          count: newCount,
          updated_at: getNowInJapan(),
        },
      });
      return result;
    } catch {
      return null;
    }
  }
}
