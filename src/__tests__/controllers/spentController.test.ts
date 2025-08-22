import { Request, Response, NextFunction } from 'express';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import {
  getAllSpentController,
  getMonthSpentController,
  postSpentController,
} from '../../controllers/spentController';
import {
  getAllSpentService,
  getMonthSpentService,
  postSpentService,
} from '../../services/spentService';

// モック
vi.mock('../../services/spentService');

describe('spentController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: vi.fn(),
    };
    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  describe('getAllSpentController', () => {
    it('正常系: 全支出額データを正常に取得できる', async () => {
      const mockData = [
        {
          month: '2024-01',
          credit: 50000,
          electricity: 8000,
          gas: 5000,
          water: 3000,
          spending: 66000,
          other: 2000,
        },
      ];

      (getAllSpentService as Mock).mockResolvedValue(mockData);

      await getAllSpentController(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(getAllSpentService).toHaveBeenCalledOnce();
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('異常系: サービスでエラーが発生した場合、nextにエラーを渡す', async () => {
      const error = new Error('Service error');
      (getAllSpentService as Mock).mockRejectedValue(error);

      await getAllSpentController(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(getAllSpentService).toHaveBeenCalledOnce();
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('getMonthSpentController', () => {
    it('正常系: 当月の支出額データを正常に取得できる', async () => {
      const mockData = {
        month: '2024-01',
        credit: 50000,
        electricity: 8000,
        gas: 5000,
        water: 3000,
        spending: 66000,
        other: 2000,
      };

      (getMonthSpentService as Mock).mockResolvedValue(mockData);

      await getMonthSpentController(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(getMonthSpentService).toHaveBeenCalledOnce();
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('異常系: サービスでエラーが発生した場合、nextにエラーを渡す', async () => {
      const error = new Error('Service error');
      (getMonthSpentService as Mock).mockRejectedValue(error);

      await getMonthSpentController(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(getMonthSpentService).toHaveBeenCalledOnce();
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('postSpentController', () => {
    it('正常系: 支出額データを正常に登録できる', async () => {
      const requestBody = {
        credit: 50000,
        electricity: 8000,
        gas: 5000,
        water: 3000,
        other: 2000,
      };
      const mockData = {
        month: '2024-01',
        ...requestBody,
        spending: 68000,
      };

      mockRequest.body = requestBody;
      (postSpentService as Mock).mockResolvedValue(mockData);

      await postSpentController(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(postSpentService).toHaveBeenCalledWith(requestBody);
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('異常系: サービスでエラーが発生した場合、nextにエラーを渡す', async () => {
      const error = new Error('Service error');
      mockRequest.body = {};
      (postSpentService as Mock).mockRejectedValue(error);

      await postSpentController(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(postSpentService).toHaveBeenCalledWith({});
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
});
