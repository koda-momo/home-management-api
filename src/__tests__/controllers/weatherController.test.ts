import { Request, Response, NextFunction } from 'express';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { getWeather } from '../../controllers/weatherController';
import { scrapeWeather } from '../../services/weatherService';

// モック
vi.mock('../../services/weatherService');

describe('weatherController', () => {
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

  describe('getWeather', () => {
    it('正常系: 天気情報を正常に取得できる', async () => {
      const mockData = { data: '晴れ' };

      (scrapeWeather as Mock).mockResolvedValue(mockData);

      await getWeather(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(scrapeWeather).toHaveBeenCalledOnce();
      expect(mockResponse.json).toHaveBeenCalledWith(mockData);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('異常系: サービスでエラーが発生した場合、nextにエラーを渡す', async () => {
      const error = new Error('Service error');
      (scrapeWeather as Mock).mockRejectedValue(error);

      await getWeather(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(scrapeWeather).toHaveBeenCalledOnce();
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
});
