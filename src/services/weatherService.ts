/* eslint-disable no-console */
import puppeteer, { type Browser } from 'puppeteer-core';
import { errorResponse } from '../utils/const';
import chromium from '@sparticuz/chromium';
import { NODE_ENV, SCRAPING_USER_AGENT } from '../config/common';

const TIME_OUT = 60000;

export const scrapeWeather = async (): Promise<{ data: string }> => {
  let browser: Browser | null = null;
  try {
    if (NODE_ENV === 'dev') {
      browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        channel: 'chrome',
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

    console.log('開始');
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(TIME_OUT);
    page.setDefaultTimeout(TIME_OUT);
    await page.setBypassCSP(true);
    await page.setUserAgent(SCRAPING_USER_AGENT);
    console.log('ページを開きました！');
    await page.goto('https://weather.yahoo.co.jp/weather/jp/13/4410.html', {
      waitUntil: 'domcontentloaded',
      timeout: TIME_OUT,
    });
    console.log('天気のURLに辿り着きました！');

    //データを取得
    await page.waitForSelector('dt[class="title"]', { timeout: TIME_OUT });
    const data = await page.$eval(
      'dt[class="title"]',
      (item: { textContent: unknown }) => {
        return item.textContent;
      }
    );
    console.log('データを取得しました！');

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
