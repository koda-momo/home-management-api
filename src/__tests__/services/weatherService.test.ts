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

vi.mock('puppeteer', () => ({
  default: {
    launch: vi.fn(),
    executablePath: vi.fn().mockReturnValue('/path/to/chrome'),
  },
}));

describe('weatherService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 環境変数の設定はテスト内で行う
  });

  describe('scrapeWeather', () => {
    it('正常系: 天気データを正常に取得できる', async () => {
      const mockWeatherData = '晴れ';

      const puppeteer = await import('puppeteer');
      (puppeteer.default.launch as Mock).mockResolvedValue(mockBrowser);
      mockPage.$eval.mockResolvedValue(mockWeatherData);

      const result = await scrapeWeather();

      expect(puppeteer.default.launch).toHaveBeenCalledWith({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
        executablePath: '/path/to/chrome',
        timeout: 30000,
      });

      expect(mockBrowser.newPage).toHaveBeenCalledOnce();
      expect(mockPage.setDefaultNavigationTimeout).toHaveBeenCalledWith(30000);
      expect(mockPage.setDefaultTimeout).toHaveBeenCalledWith(30000);
      expect(mockPage.setBypassCSP).toHaveBeenCalledWith(true);
      expect(mockPage.setUserAgent).toHaveBeenCalledWith(''); // 環境変数が空の場合
      expect(mockPage.goto).toHaveBeenCalledWith(
        'https://weather.yahoo.co.jp/weather/jp/13/4410.html',
        {
          waitUntil: 'networkidle2',
          timeout: 30000,
        }
      );
      expect(mockPage.waitForSelector).toHaveBeenCalledWith(
        'dt[class="title"]',
        {
          timeout: 10000,
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
      const puppeteer = await import('puppeteer');
      (puppeteer.default.launch as Mock).mockResolvedValue(mockBrowser);
      mockPage.$eval.mockResolvedValue(123); // 文字列以外

      await expect(scrapeWeather()).rejects.toMatchObject({
        message: expect.stringContaining('スクレイピングに失敗しました'),
        statusCode: 500,
      });

      expect(mockBrowser.close).toHaveBeenCalledOnce();
    });

    it('異常系: puppeteer.launchでエラーが発生した場合はエラーをthrowする', async () => {
      const puppeteer = await import('puppeteer');
      const error = new Error('Launch failed');
      (puppeteer.default.launch as Mock).mockRejectedValue(error);

      await expect(scrapeWeather()).rejects.toMatchObject({
        message: expect.stringContaining('スクレイピングに失敗しました'),
        statusCode: 500,
      });
    });

    it('異常系: ページ操作でエラーが発生した場合はエラーをthrowし、ブラウザを閉じる', async () => {
      const puppeteer = await import('puppeteer');
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
      const puppeteer = await import('puppeteer');
      (puppeteer.default.launch as Mock).mockResolvedValue(null);

      await expect(scrapeWeather()).rejects.toMatchObject({
        statusCode: 500,
      });

      // nullの場合はcloseが呼ばれない
      expect(mockBrowser.close).not.toHaveBeenCalled();
    });
  });
});
