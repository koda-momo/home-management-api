import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Request, Response } from 'express';
import { getGasUsage } from '../../controllers/gasController.js';
import * as gasService from '../../services/gasService.js';

vi.mock('../../services/gasService.js');

const mockGasService = vi.mocked(gasService);

const mockRequest = (): Partial<Request> => ({});

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.json = vi.fn().mockReturnValue(res);
  res.status = vi.fn().mockReturnValue(res);
  return res;
};

const mockNext = vi.fn();

describe('gasController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getGasUsage', () => {
    it('ガス使用量データを正常に取得できること', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const mockGasData = { amount: '5000' };

      mockGasService.scrapeGasUsage.mockResolvedValue(mockGasData);

      await getGasUsage(req as Request, res as Response, mockNext);

      expect(mockGasService.scrapeGasUsage).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(mockGasData);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('サービス層でエラーが発生した場合はnext関数を呼ぶこと', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const error = new Error('Scraping failed');

      mockGasService.scrapeGasUsage.mockRejectedValue(error);

      await getGasUsage(req as Request, res as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
