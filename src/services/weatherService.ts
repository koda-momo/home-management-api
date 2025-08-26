import puppeteer, { type Browser } from 'puppeteer-core';
import { errorResponse } from '../utils/const';
import chromium from '@sparticuz/chromium';
import { NODE_ENV, SCRAPING_USER_AGENT } from '../config/common';

export const scrapeWeather = async (): Promise<{ data: string }> => {
  let browser: Browser | null = null;
  try {
    if (NODE_ENV === 'dev') {
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: false,
      });
    } else {
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      });
    }

    //ログインページを開く
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(30000);
    page.setDefaultTimeout(30000);
    await page.setBypassCSP(true);
    await page.setUserAgent(SCRAPING_USER_AGENT);

    await page.goto('https://weather.yahoo.co.jp/weather/jp/13/4410.html', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    //データを取得
    await page.waitForSelector('dt[class="title"]', { timeout: 10000 });
    const data = await page.$eval(
      'dt[class="title"]',
      (item: { textContent: unknown }) => {
        return item.textContent;
      }
    );

    if (typeof data !== 'string') {
      throw {
        ...errorResponse.internalServerError,
        message: '取得したデータが文字列ではありません。',
      };
    }

    return { data };
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
