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
import {
  mockSpentList,
  mockSpentData,
  mockSpentRequestBody,
  mockSpentPostData,
} from '../__mocks__/spentData';

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
      (getAllSpentService as Mock).mockResolvedValue(mockSpentList);

      await getAllSpentController(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(getAllSpentService).toHaveBeenCalledOnce();
      expect(mockResponse.json).toHaveBeenCalledWith(mockSpentList);
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
      (getMonthSpentService as Mock).mockResolvedValue(mockSpentData);

      await getMonthSpentController(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(getMonthSpentService).toHaveBeenCalledOnce();
      expect(mockResponse.json).toHaveBeenCalledWith(mockSpentData);
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
      mockRequest.body = mockSpentRequestBody;
      (postSpentService as Mock).mockResolvedValue(mockSpentPostData);

      await postSpentController(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(postSpentService).toHaveBeenCalledWith(mockSpentRequestBody);
      expect(mockResponse.json).toHaveBeenCalledWith(mockSpentPostData);
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
