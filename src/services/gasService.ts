import puppeteer, { type Browser } from 'puppeteer';
import type { GasUsageData } from '../utils/types';
import { errorResponse } from '../utils/const';

const SCRAPING_USER_AGENT = process.env.SCRAPING_USER_AGENT || '';
const SCRAPING_USER_ID = process.env.SCRAPING_USER_ID || '';
const SCRAPING_PASSWORD = process.env.SCRAPING_PASSWORD || '';
const SCRAPING_GAS_URL = process.env.SCRAPING_GAS_URL || '';

export const scrapeGasUsage = async (): Promise<GasUsageData> => {
  let browser: Browser | null = null;
  try {
    const launchOptions: {
      headless: boolean;
      timeout: number;
      args: string[];
      executablePath?: string;
    } = {
      headless: true,
      timeout: 30000,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-extensions',
        '--no-first-run',
        '--disable-default-apps',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    };

    // Production環境（Render等）での実行可能ファイルパス設定
    if (process.env.NODE_ENV === 'production') {
      launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable';
    }

    browser = await puppeteer.launch(launchOptions);

    //ログインページを開く
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(30000);
    page.setDefaultTimeout(30000);
    await page.setBypassCSP(true);
    await page.setUserAgent(SCRAPING_USER_AGENT);

    await page.goto(SCRAPING_GAS_URL, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });
    //ログインする
    await page.waitForSelector('#loginId', { timeout: 10000 });
    await page.type('#loginId', SCRAPING_USER_ID);
    await page.type('#password', SCRAPING_PASSWORD);

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }),
      page.click('button[id="submit-btn"]'),
    ]);

    //データを取得
    await page.waitForFunction(
      () => {
        const element = document.querySelector(
          'a[href="/billing?tab=overview"]'
        );
        return (
          element && element.textContent && element.textContent.includes('円')
        );
      },
      { timeout: 10000 }
    );
    const data = await page.$eval(
      'a[href$="/billing?tab=overview"]',
      (item: { textContent: unknown }) => {
        return item.textContent;
      }
    );

    // 金額部分のみを抽出
    if (typeof data !== 'string') {
      throw {
        ...errorResponse.internalServerError,
        message: '取得したデータが文字列ではありません。',
      };
    }

    const amountMatch = data.match(/[\d,]+円/);
    const amount = amountMatch ? amountMatch[0].replace(/[,円]/g, '') : data;

    // ガス使用量データ取得成功
    return { amount };
  } catch (error) {
    throw {
      ...errorResponse.internalServerError,
      message: `スクレイピングに失敗しました:${error}`,
    };
  } finally {
    // ブラウザを確実に閉じる
    if (browser) {
      await browser.close();
    }
  }
};
