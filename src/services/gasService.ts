/* eslint-disable no-console */
import puppeteer, { type Browser } from 'puppeteer-core';
import { errorResponse } from '../utils/const';
import { GasUsageData } from '../types/gasType';
import chromium from '@sparticuz/chromium';
import {
  NODE_ENV,
  SCRAPING_GAS_URL,
  SCRAPING_PASSWORD,
  SCRAPING_USER_AGENT,
  SCRAPING_USER_ID,
} from '../config/common';

const TIME_OUT = 60000;

export const scrapeGasUsage = async (): Promise<GasUsageData> => {
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

    //ログインページを開く
    console.log('開始');
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(TIME_OUT);
    page.setDefaultTimeout(TIME_OUT);
    await page.setBypassCSP(true);
    await page.setUserAgent(SCRAPING_USER_AGENT);
    console.log('ページを開きました！');

    await page.goto(SCRAPING_GAS_URL, {
      waitUntil: 'networkidle2',
      timeout: TIME_OUT,
    });
    console.log('アクセスしました！');

    //ログインする
    await page.waitForSelector('#loginId', { timeout: TIME_OUT });
    await page.type('#loginId', SCRAPING_USER_ID);
    await page.type('#password', SCRAPING_PASSWORD);

    await Promise.all([
      page.waitForNavigation({
        waitUntil: 'domcontentloaded',
        timeout: TIME_OUT,
      }),
      page.click('button[id="submit-btn"]'),
    ]);
    console.log('ログインしました！');

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
      { timeout: TIME_OUT }
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
