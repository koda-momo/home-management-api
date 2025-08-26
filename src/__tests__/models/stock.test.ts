import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { StockModel } from '../../models/stock';
import { prisma } from '../../config/prisma';
import { getNowInJapan } from '../../utils/functions/timezone';
import {
  mockStockList,
  mockStockData,
  mockStockUpdateData,
} from '../__mocks__/stockData';

// モック
vi.mock('../../config/prisma', () => ({
  prisma: {
    stock: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('../../utils/functions/timezone');

describe('StockModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('正常系: 全ての在庫データを取得できる', async () => {
      (prisma.stock.findMany as Mock).mockResolvedValue(mockStockList);

      const result = await StockModel.getAll();

      expect(prisma.stock.findMany).toHaveBeenCalledWith({
        orderBy: { id: 'asc' },
      });
      expect(result).toEqual(mockStockList);
    });
  });

  describe('getById', () => {
    it('正常系: 指定したIDの在庫データを取得できる', async () => {
      (prisma.stock.findUnique as Mock).mockResolvedValue(mockStockData);

      const result = await StockModel.getById(1);

      expect(prisma.stock.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockStockData);
    });

    it('正常系: 存在しないIDの場合はnullを返す', async () => {
      (prisma.stock.findUnique as Mock).mockResolvedValue(null);

      const result = await StockModel.getById(999);

      expect(prisma.stock.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(result).toBeNull();
    });
  });

  describe('updateCount', () => {
    it('正常系: 在庫数を正常に更新できる', async () => {
      const mockNow = new Date();

      (getNowInJapan as Mock).mockReturnValue(mockNow);
      (prisma.stock.update as Mock).mockResolvedValue({
        ...mockStockUpdateData,
        updated_at: mockNow,
      });

      const result = await StockModel.updateCount(1, 15);

      expect(getNowInJapan).toHaveBeenCalledOnce();
      expect(prisma.stock.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          count: 15,
          updated_at: mockNow,
        },
      });
      expect(result).toEqual({
        ...mockStockUpdateData,
        updated_at: mockNow,
      });
    });

    it('異常系: 更新に失敗した場合はnullを返す', async () => {
      const mockNow = new Date();
      (getNowInJapan as Mock).mockReturnValue(mockNow);
      (prisma.stock.update as Mock).mockRejectedValue(
        new Error('Update failed')
      );

      const result = await StockModel.updateCount(1, 15);

      expect(getNowInJapan).toHaveBeenCalledOnce();
      expect(prisma.stock.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          count: 15,
          updated_at: mockNow,
        },
      });
      expect(result).toBeNull();
    });
  });
});
