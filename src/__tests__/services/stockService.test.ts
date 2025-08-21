import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getAllStockService,
  getStockService,
  postAddCountService,
  postSubCountService,
} from '../../services/stockService';
import { StockModel } from '../../models/stock';
import * as stockSchema from '../../schemas/stockSchema';
import { errorResponse } from '../../utils/const';
import {
  mockApiData,
  mockDbData,
  mockUpdatedApiData,
  mockUpdatedDbData,
} from '../__mocks__/stock';

vi.mock('../../models/stock.js');
vi.mock('../../schemas/stockSchema.js');

const mockStockModel = vi.mocked(StockModel);
const mockValidation = vi.mocked(stockSchema.validation);

describe('stockService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getAllStockService', () => {
    it('全ての在庫データを正常に取得できること', async () => {
      const mockData = [mockDbData];
      mockStockModel.getAll.mockResolvedValue(mockData);

      const result = await getAllStockService();

      expect(mockStockModel.getAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockApiData]);
    });

    it('在庫データが存在しない場合はエラーをスローすること', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockStockModel.getAll.mockResolvedValue(null as any);

      await expect(getAllStockService()).rejects.toEqual(
        errorResponse.stockNotFound
      );
    });

    it('空配列の場合はエラーをスローすること', async () => {
      mockStockModel.getAll.mockResolvedValue([]);

      const result = await getAllStockService();
      expect(result).toEqual([]);
    });
  });

  describe('getStockService', () => {
    it('指定されたIDの在庫データを正常に取得できること', async () => {
      const mockQuery = { id: '1' };
      mockValidation.mockReturnValue({ id: 1 });
      mockStockModel.getById.mockResolvedValue(mockDbData);

      const result = await getStockService(mockQuery);

      expect(mockValidation).toHaveBeenCalledWith(
        mockQuery,
        stockSchema.getIdStockSchema
      );
      expect(mockStockModel.getById).toHaveBeenCalledWith(1);
      expect(result).toEqual([mockApiData]);
    });

    it('存在しないIDの場合はエラーをスローすること', async () => {
      const mockQuery = { id: '999' };
      mockValidation.mockReturnValue({ id: 999 });
      mockStockModel.getById.mockResolvedValue(null);

      await expect(getStockService(mockQuery)).rejects.toEqual(
        errorResponse.stockNotFound
      );
    });

    it('バリデーションエラーの場合はエラーをスローすること', async () => {
      const mockQuery = { id: 'invalid' };
      const validationError = { ...errorResponse.badRequest };
      mockValidation.mockImplementation(() => {
        throw validationError;
      });

      await expect(getStockService(mockQuery)).rejects.toEqual(validationError);
    });
  });

  describe('postAddCountService', () => {
    it('在庫個数を正常に追加できること', async () => {
      const mockBody = { id: 1 };

      mockValidation.mockReturnValue({ id: 1 });
      mockStockModel.getById.mockResolvedValue(mockDbData);
      mockStockModel.updateCount.mockResolvedValue(mockUpdatedDbData);

      const result = await postAddCountService(mockBody);

      expect(mockValidation).toHaveBeenCalledWith(
        mockBody,
        stockSchema.postAddStockCountSchema
      );
      expect(mockStockModel.getById).toHaveBeenCalledWith(1);
      expect(mockStockModel.updateCount).toHaveBeenCalledWith(1, 6);
      expect(result).toEqual(mockUpdatedApiData);
    });

    it('存在しないIDの場合はエラーをスローすること', async () => {
      const mockBody = { id: 999 };
      mockValidation.mockReturnValue({ id: 999 });
      mockStockModel.getById.mockResolvedValue(null);

      await expect(postAddCountService(mockBody)).rejects.toEqual(
        errorResponse.stockNotFound
      );
    });

    it('最大個数を超える場合はエラーをスローすること', async () => {
      const mockBody = { id: 1 };
      const mockDataWithMaxCount = { ...mockDbData, count: 20 };
      mockValidation.mockReturnValue({ id: 1 });
      mockStockModel.getById.mockResolvedValue(mockDataWithMaxCount);

      await expect(postAddCountService(mockBody)).rejects.toEqual(
        errorResponse.maxStockCount
      );
    });

    it('更新に失敗した場合はエラーをスローすること', async () => {
      const mockBody = { id: 1 };
      mockValidation.mockReturnValue({ id: 1 });
      mockStockModel.getById.mockResolvedValue(mockDbData);
      mockStockModel.updateCount.mockResolvedValue(null);

      await expect(postAddCountService(mockBody)).rejects.toEqual(
        errorResponse.failedToUpdateCount
      );
    });
  });

  describe('postSubCountService', () => {
    it('在庫個数を正常に削除できること', async () => {
      const mockBody = { id: 1 };
      const updatedMockDbData = { ...mockDbData, count: 4 };
      const expectedResult = {
        id: 1,
        name: 'テスト商品1',
        count: 4,
        url: 'https://example.com/1',
        createdAt: new Date('2023-01-01T00:00:00+09:00'),
        updatedAt: new Date('2023-01-01T00:00:00+09:00'),
      };

      mockValidation.mockReturnValue({ id: 1 });
      mockStockModel.getById.mockResolvedValue(mockDbData);
      mockStockModel.updateCount.mockResolvedValue(updatedMockDbData);

      const result = await postSubCountService(mockBody);

      expect(mockValidation).toHaveBeenCalledWith(
        mockBody,
        stockSchema.postSubStockCountSchema
      );
      expect(mockStockModel.getById).toHaveBeenCalledWith(1);
      expect(mockStockModel.updateCount).toHaveBeenCalledWith(1, 4);
      expect(result).toEqual(expectedResult);
    });

    it('存在しないIDの場合はエラーをスローすること', async () => {
      const mockBody = { id: 999 };
      mockValidation.mockReturnValue({ id: 999 });
      mockStockModel.getById.mockResolvedValue(null);

      await expect(postSubCountService(mockBody)).rejects.toEqual(
        errorResponse.stockNotFound
      );
    });

    it('最小個数を下回る場合はエラーをスローすること', async () => {
      const mockBody = { id: 1 };
      const mockDataWithMinCount = { ...mockDbData, count: 0 };
      mockValidation.mockReturnValue({ id: 1 });
      mockStockModel.getById.mockResolvedValue(mockDataWithMinCount);

      await expect(postSubCountService(mockBody)).rejects.toEqual(
        errorResponse.minStockCount
      );
    });

    it('更新に失敗した場合はエラーをスローすること', async () => {
      const mockBody = { id: 1 };
      mockValidation.mockReturnValue({ id: 1 });
      mockStockModel.getById.mockResolvedValue(mockDbData);
      mockStockModel.updateCount.mockResolvedValue(null);

      await expect(postSubCountService(mockBody)).rejects.toEqual(
        errorResponse.failedToUpdateCount
      );
    });
  });
});
