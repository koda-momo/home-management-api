import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { scrapeWeather } from '../../services/weatherService';

// puppeteerのモック
const mockPage = {
  setDefaultNavigationTimeout: vi.fn(),
  setDefaultTimeout: vi.fn(),
  setBypassCSP: vi.fn(),
  setUserAgent: vi.fn(),
  goto: vi.fn(),
  waitForSelector: vi.fn(),
  $eval: vi.fn(),
};

const mockBrowser = {
  newPage: vi.fn().mockResolvedValue(mockPage),
  close: vi.fn(),
};

// chromiumのモック
vi.mock('@sparticuz/chromium', () => ({
  default: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1920, height: 1080 },
    executablePath: vi.fn().mockResolvedValue('/path/to/chrome'),
    headless: true,
  },
}));

// puppeteer-coreのモック
vi.mock('puppeteer-core', () => ({
  default: {
    launch: vi.fn(),
  },
}));

// 環境変数のモック
vi.mock('../../config/common', () => ({
  NODE_ENV: 'production',
  SCRAPING_USER_AGENT: 'test-agent',
}));

describe('weatherService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('scrapeWeather', () => {
    it('正常系: 天気データを正常に取得できる', async () => {
      const mockWeatherData = '晴れ';

      const puppeteer = await import('puppeteer-core');
      (puppeteer.default.launch as Mock).mockResolvedValue(mockBrowser);
      mockPage.$eval.mockResolvedValue(mockWeatherData);

      const result = await scrapeWeather();

      expect(puppeteer.default.launch).toHaveBeenCalled();
      expect(mockBrowser.newPage).toHaveBeenCalledOnce();
      expect(mockPage.setDefaultNavigationTimeout).toHaveBeenCalledWith(60000);
      expect(mockPage.setDefaultTimeout).toHaveBeenCalledWith(60000);
      expect(mockPage.setBypassCSP).toHaveBeenCalledWith(true);
      expect(mockPage.setUserAgent).toHaveBeenCalledWith('test-agent');
      expect(mockPage.goto).toHaveBeenCalledWith(
        'https://weather.yahoo.co.jp/weather/jp/13/4410.html',
        {
          waitUntil: 'domcontentloaded',
          timeout: 60000,
        }
      );
      expect(mockPage.waitForSelector).toHaveBeenCalledWith(
        'dt[class="title"]',
        {
          timeout: 60000,
        }
      );
      expect(mockPage.$eval).toHaveBeenCalledWith(
        'dt[class="title"]',
        expect.any(Function)
      );
      expect(mockBrowser.close).toHaveBeenCalledOnce();

      expect(result).toEqual({ data: mockWeatherData });
    });

    it('異常系: 取得したデータが文字列でない場合はエラーをthrowする', async () => {
      const puppeteer = await import('puppeteer-core');
      (puppeteer.default.launch as Mock).mockResolvedValue(mockBrowser);
      mockPage.$eval.mockResolvedValue(123); // 文字列以外

      await expect(scrapeWeather()).rejects.toMatchObject({
        message: expect.stringContaining('スクレイピングに失敗しました'),
        statusCode: 500,
      });

      expect(mockBrowser.close).toHaveBeenCalledOnce();
    });

    it('異常系: puppeteer.launchでエラーが発生した場合はエラーをthrowする', async () => {
      const puppeteer = await import('puppeteer-core');
      const error = new Error('Launch failed');
      (puppeteer.default.launch as Mock).mockRejectedValue(error);

      await expect(scrapeWeather()).rejects.toMatchObject({
        message: expect.stringContaining('スクレイピングに失敗しました'),
        statusCode: 500,
      });
    });

    it('異常系: ページ操作でエラーが発生した場合はエラーをthrowし、ブラウザを閉じる', async () => {
      const puppeteer = await import('puppeteer-core');
      (puppeteer.default.launch as Mock).mockResolvedValue(mockBrowser);

      const error = new Error('Page operation failed');
      mockPage.goto.mockRejectedValue(error);

      await expect(scrapeWeather()).rejects.toMatchObject({
        message: expect.stringContaining('スクレイピングに失敗しました'),
        statusCode: 500,
      });

      expect(mockBrowser.close).toHaveBeenCalledOnce();
    });

    it('異常系: ブラウザがnullの場合はcloseを呼ばない', async () => {
      const puppeteer = await import('puppeteer-core');
      (puppeteer.default.launch as Mock).mockResolvedValue(null);

      await expect(scrapeWeather()).rejects.toMatchObject({
        statusCode: 500,
      });

      // nullの場合はcloseが呼ばれない
      expect(mockBrowser.close).not.toHaveBeenCalled();
    });
  });
});
