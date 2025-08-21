import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StockModel } from '../../models/stock.js';

const mockPrisma = {
  stock: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
};

vi.mock('../../config/prisma.js', () => ({
  prisma: mockPrisma,
}));


describe('StockModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getAll', () => {
    it('全ての在庫データを取得できること', async () => {
      const mockData = [
        {
          id: 1,
          name: 'テスト商品1',
          count: 5,
          url: 'https://example.com/1',
          created_at: new Date('2023-01-01'),
          updated_at: new Date('2023-01-01'),
        },
        {
          id: 2,
          name: 'テスト商品2',
          count: 10,
          url: 'https://example.com/2',
          created_at: new Date('2023-01-02'),
          updated_at: new Date('2023-01-02'),
        },
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockPrisma.stock.findMany as any).mockResolvedValue(mockData);

      const result = await StockModel.getAll();

      expect(mockPrisma.stock.findMany).toHaveBeenCalledWith({
        orderBy: { id: 'asc' },
      });
      expect(result).toEqual(mockData);
    });

    it('在庫データが空の場合は空配列を返すこと', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockPrisma.stock.findMany as any).mockResolvedValue([]);

      const result = await StockModel.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('指定されたIDの在庫データを取得できること', async () => {
      const mockData = {
        id: 1,
        name: 'テスト商品1',
        count: 5,
        url: 'https://example.com/1',
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockPrisma.stock.findUnique as any).mockResolvedValue(mockData);

      const result = await StockModel.getById(1);

      expect(mockPrisma.stock.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockData);
    });

    it('存在しないIDの場合はnullを返すこと', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockPrisma.stock.findUnique as any).mockResolvedValue(null);

      const result = await StockModel.getById(999);

      expect(mockPrisma.stock.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(result).toBeNull();
    });
  });

  describe('updateCount', () => {
    it('在庫個数を正常に更新できること', async () => {
      const mockUpdatedData = {
        id: 1,
        name: 'テスト商品1',
        count: 6,
        url: 'https://example.com/1',
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockPrisma.stock.update as any).mockResolvedValue(mockUpdatedData);

      const result = await StockModel.updateCount(1, 6);

      expect(mockPrisma.stock.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { count: 6 },
      });
      expect(result).toEqual(mockUpdatedData);
    });

    it('更新に失敗した場合はnullを返すこと', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockPrisma.stock.update as any).mockRejectedValue(new Error('Update failed'));

      const result = await StockModel.updateCount(1, 6);

      expect(result).toBeNull();
    });

    it('存在しないIDを更新しようとした場合はnullを返すこと', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockPrisma.stock.update as any).mockRejectedValue(new Error('Record not found'));

      const result = await StockModel.updateCount(999, 6);

      expect(result).toBeNull();
    });
  });
});
