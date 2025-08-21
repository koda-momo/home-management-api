import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { scrapeGasUsage } from '../../services/gasService.js';
import puppeteer, { type Browser, type Page } from 'puppeteer';

vi.mock('puppeteer');
vi.mock('chrome-aws-lambda', () => ({
  default: {
    args: [],
    defaultViewport: { width: 1280, height: 720 },
    executablePath: vi.fn().mockResolvedValue('/usr/bin/chromium'),
  },
}));

const mockPuppeteer = vi.mocked(puppeteer);

const mockBrowser = {
  newPage: vi.fn(),
  close: vi.fn(),
};

const mockPage = {
  setUserAgent: vi.fn(),
  setExtraHTTPHeaders: vi.fn(),
  goto: vi.fn(),
  waitForNavigation: vi.fn(),
  type: vi.fn(),
  click: vi.fn(),
  $$eval: vi.fn(),
};

describe('gasService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_USER_AGENT = 'test-agent';
    process.env.NEXT_PUBLIC_JCB_URL = 'https://test-login.com';
    process.env.NEXT_PUBLIC_JCB_ID = 'test-id';
    process.env.NEXT_PUBLIC_PASSWORD = 'test-password';
    process.env.NEXT_PUBLIC_JCB_PASS = 'test-pass';
    process.env.NEXT_PUBLIC_JCB_DETAIL_URL = 'https://test-detail.com';
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('scrapeGasUsage', () => {
    it('正常にガス使用量データを取得できること', async () => {
      mockPuppeteer.launch.mockResolvedValue(
        mockBrowser as unknown as Browser
      );
      mockBrowser.newPage.mockResolvedValue(
        mockPage as unknown as Page
      );
      mockPage.$$eval.mockResolvedValue(['', '5,000円']);

      const result = await scrapeGasUsage();

      expect(result).toEqual({ amount: '5,000' });
      expect(mockBrowser.close).toHaveBeenCalled();
    });

    it('データが取得できない場合はエラーを投げること', async () => {
      mockPuppeteer.launch.mockResolvedValue(
        mockBrowser as unknown as Browser
      );
      mockBrowser.newPage.mockResolvedValue(
        mockPage as unknown as Page
      );
      mockPage.$$eval.mockResolvedValue([]);

      await expect(scrapeGasUsage()).rejects.toThrow(
        'ガス使用料金データの取得に失敗しました'
      );
      expect(mockBrowser.close).toHaveBeenCalled();
    });

    it('ブラウザ起動でエラーが発生した場合はエラーを投げること', async () => {
      const error = new Error('Browser launch failed');
      mockPuppeteer.launch.mockRejectedValue(error);

      await expect(scrapeGasUsage()).rejects.toThrow(error);
    });

    it('例外発生時でもブラウザを確実に閉じること', async () => {
      mockPuppeteer.launch.mockResolvedValue(
        mockBrowser as unknown as Browser
      );
      mockBrowser.newPage.mockResolvedValue(
        mockPage as unknown as Page
      );
      mockPage.goto.mockRejectedValue(new Error('Navigation failed'));

      await expect(scrapeGasUsage()).rejects.toThrow();
      expect(mockBrowser.close).toHaveBeenCalled();
    });
  });
});
