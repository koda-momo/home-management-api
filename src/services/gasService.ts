import puppeteer from 'puppeteer';
import chromium from 'chrome-aws-lambda';
import type { GasUsageData } from '../utils/types.js';

export const scrapeGasUsage = async (): Promise<GasUsageData> => {
  let browser = null;

  try {
    // Puppeteerのブラウザを起動
    browser = await puppeteer.launch({
      args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
    });

    // 新しいページを開く
    const page = await browser.newPage();
    await page.setUserAgent(process.env.NEXT_PUBLIC_USER_AGENT!);
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });

    // ログインページに移動
    await Promise.all([
      page.waitForNavigation({
        waitUntil: ['domcontentloaded', 'networkidle2'],
      }),
      page.goto(process.env.NEXT_PUBLIC_JCB_URL!),
    ]);

    // ログイン情報を入力
    await page.type('#userId', process.env.NEXT_PUBLIC_JCB_ID!);
    await page.type('#password', process.env.NEXT_PUBLIC_PASSWORD!);

    // ログインボタンをクリック
    await Promise.all([
      page.waitForNavigation({
        waitUntil: ['domcontentloaded', 'networkidle2'],
      }),
      page.click('a[id="loginButtonAD"]'),
    ]);

    // 合言葉を入力
    await page.type(
      'input[id="form1:answer_"]',
      process.env.NEXT_PUBLIC_JCB_PASS!
    );

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      page.click('input[id="form1:j_idt68"]'),
    ]);

    // 利用明細ページに移動
    await Promise.all([
      page.waitForNavigation({
        waitUntil: ['domcontentloaded', 'networkidle2'],
      }),
      page.goto(process.env.NEXT_PUBLIC_JCB_DETAIL_URL!),
    ]);

    // データを取得
    const response = await page.$$eval('.detail-txt-price', (options) => {
      return options.map((option) => option.textContent);
    });

    if (!response || !response[1]) {
      throw new Error('ガス使用料金データの取得に失敗しました');
    }

    const amount = response[1]
      .replace(/\n/g, '')
      .replace(/ /g, '')
      .replace('円', '');

    return { amount };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('スクレイピング中にエラーが発生しました:', error);
    throw error;
  } finally {
    // ブラウザを確実に閉じる
    if (browser) {
      await browser.close();
    }
  }
};
