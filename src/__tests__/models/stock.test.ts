import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { StockModel } from '../../models/stock';
import { prisma } from '../../config/prisma';
import { getNowInJapan } from '../../utils/functions/timezone';

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
      const mockStocks = [
        {
          id: 1,
          name: '商品1',
          count: 10,
          url: 'https://example.com/1',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: '商品2',
          count: 5,
          url: 'https://example.com/2',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      (prisma.stock.findMany as Mock).mockResolvedValue(mockStocks);

      const result = await StockModel.getAll();

      expect(prisma.stock.findMany).toHaveBeenCalledWith({
        orderBy: { id: 'asc' },
      });
      expect(result).toEqual(mockStocks);
    });
  });

  describe('getById', () => {
    it('正常系: 指定したIDの在庫データを取得できる', async () => {
      const mockStock = {
        id: 1,
        name: '商品1',
        count: 10,
        url: 'https://example.com/1',
        created_at: new Date(),
        updated_at: new Date(),
      };

      (prisma.stock.findUnique as Mock).mockResolvedValue(mockStock);

      const result = await StockModel.getById(1);

      expect(prisma.stock.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockStock);
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
      const mockStock = {
        id: 1,
        name: '商品1',
        count: 15,
        url: 'https://example.com/1',
        created_at: new Date(),
        updated_at: mockNow,
      };

      (getNowInJapan as Mock).mockReturnValue(mockNow);
      (prisma.stock.update as Mock).mockResolvedValue(mockStock);

      const result = await StockModel.updateCount(1, 15);

      expect(getNowInJapan).toHaveBeenCalledOnce();
      expect(prisma.stock.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          count: 15,
          updated_at: mockNow,
        },
      });
      expect(result).toEqual(mockStock);
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
