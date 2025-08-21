import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextFunction, Request, Response } from 'express';
import {
  getAllStockController,
  getIdStockController,
  postAddStockCountController,
  postSubStockCountController,
} from '../../controllers/stockController.js';
import * as stockService from '../../services/stockService.js';

vi.mock('../../services/stockService.js');

const mockStockService = vi.mocked(stockService);

const mockRequest = (params?: Record<string, string>, body?: unknown): Partial<Request> => ({
  params: params || {},
  body: body || {},
});

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const mockNext = vi.fn() as NextFunction;

const mockApiData = [
  {
    id: 1,
    name: 'テスト商品',
    count: 5,
    url: 'https://example.com',
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-01T00:00:00Z'),
  },
];

describe('stockController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getAllStockController', () => {
    it('全ての在庫データを正常に取得できること', async () => {
      const req = mockRequest();
      const res = mockResponse();

      mockStockService.getAllStockService.mockResolvedValue(mockApiData);

      await getAllStockController(req as Request, res as Response, mockNext);

      expect(mockStockService.getAllStockService).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(mockApiData);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('サービス層でエラーが発生した場合はnextを呼び出すこと', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const error = new Error('Service error');

      mockStockService.getAllStockService.mockRejectedValue(error);

      await getAllStockController(req as Request, res as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('getIdStockController', () => {
    it('指定されたIDの在庫データを正常に取得できること', async () => {
      const req = mockRequest({ id: '1' });
      const res = mockResponse();

      mockStockService.getStockService.mockResolvedValue(mockApiData);

      await getIdStockController(req as Request, res as Response, mockNext);

      expect(mockStockService.getStockService).toHaveBeenCalledWith({
        id: '1',
      });
      expect(res.json).toHaveBeenCalledWith(mockApiData);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('サービス層でエラーが発生した場合はnextを呼び出すこと', async () => {
      const req = mockRequest({ id: '999' });
      const res = mockResponse();
      const error = new Error('Stock not found');

      mockStockService.getStockService.mockRejectedValue(error);

      await getIdStockController(req as Request, res as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('postAddStockCountController', () => {
    it('在庫個数を正常に追加できること', async () => {
      const req = mockRequest(undefined, { id: 1 });
      const res = mockResponse();
      const updatedData = { ...mockApiData[0], count: 6 };

      mockStockService.postAddCountService.mockResolvedValue(updatedData);

      await postAddStockCountController(
        req as Request,
        res as Response,
        mockNext
      );

      expect(mockStockService.postAddCountService).toHaveBeenCalledWith({
        id: 1,
      });
      expect(res.json).toHaveBeenCalledWith(updatedData);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('サービス層でエラーが発生した場合はnextを呼び出すこと', async () => {
      const req = mockRequest(undefined, { id: 999 });
      const res = mockResponse();
      const error = new Error('Stock not found');

      mockStockService.postAddCountService.mockRejectedValue(error);

      await postAddStockCountController(
        req as Request,
        res as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('postSubStockCountController', () => {
    it('在庫個数を正常に削除できること', async () => {
      const req = mockRequest(undefined, { id: 1 });
      const res = mockResponse();
      const updatedData = { ...mockApiData[0], count: 4 };

      mockStockService.postSubCountService.mockResolvedValue(updatedData);

      await postSubStockCountController(
        req as Request,
        res as Response,
        mockNext
      );

      expect(mockStockService.postSubCountService).toHaveBeenCalledWith({
        id: 1,
      });
      expect(res.json).toHaveBeenCalledWith(updatedData);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('サービス層でエラーが発生した場合はnextを呼び出すこと', async () => {
      const req = mockRequest(undefined, { id: 1 });
      const res = mockResponse();
      const error = new Error('Min stock count error');

      mockStockService.postSubCountService.mockRejectedValue(error);

      await postSubStockCountController(
        req as Request,
        res as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
