import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { scrapeGasUsage } from '../../services/gasService.js';
import puppeteer, { type Browser, type Page } from 'puppeteer';

vi.mock('puppeteer');

const mockPuppeteer = vi.mocked(puppeteer);

const mockBrowser = {
  newPage: vi.fn(),
  close: vi.fn(),
};

const mockPage = {
  setUserAgent: vi.fn(),
  setExtraHTTPHeaders: vi.fn(),
  setDefaultNavigationTimeout: vi.fn(),
  setDefaultTimeout: vi.fn(),
  setBypassCSP: vi.fn(),
  goto: vi.fn(),
  waitForSelector: vi.fn(),
  waitForNavigation: vi.fn(),
  waitForFunction: vi.fn(),
  type: vi.fn(),
  click: vi.fn(),
  $$eval: vi.fn(),
  $eval: vi.fn(),
};

describe('gasService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('scrapeGasUsage', () => {
    it('正常にガス使用量データを取得できること', async () => {
      mockPuppeteer.launch.mockResolvedValue(mockBrowser as unknown as Browser);
      mockBrowser.newPage.mockResolvedValue(mockPage as unknown as Page);
      mockPage.$eval.mockResolvedValue('5,000円');

      const result = await scrapeGasUsage();

      expect(result).toEqual({ amount: '5000' });
      expect(mockBrowser.close).toHaveBeenCalled();
    });

    it('データが取得できない場合はエラーを投げること', async () => {
      mockPuppeteer.launch.mockResolvedValue(mockBrowser as unknown as Browser);
      mockBrowser.newPage.mockResolvedValue(mockPage as unknown as Page);
      mockPage.$eval.mockRejectedValue(new Error('Element not found'));

      await expect(scrapeGasUsage()).rejects.toThrow(
        'スクレイピングに失敗しました:'
      );
      expect(mockBrowser.close).toHaveBeenCalled();
    });

    it('ブラウザ起動でエラーが発生した場合はエラーを投げること', async () => {
      const error = new Error('Browser launch failed');
      mockPuppeteer.launch.mockRejectedValue(error);

      await expect(scrapeGasUsage()).rejects.toThrow(
        'スクレイピングに失敗しました:Error: Browser launch failed'
      );
    });

    it('例外発生時でもブラウザを確実に閉じること', async () => {
      mockPuppeteer.launch.mockResolvedValue(mockBrowser as unknown as Browser);
      mockBrowser.newPage.mockResolvedValue(mockPage as unknown as Page);
      mockPage.goto.mockRejectedValue(new Error('Navigation failed'));

      await expect(scrapeGasUsage()).rejects.toThrow();
      expect(mockBrowser.close).toHaveBeenCalled();
    });
  });
});
