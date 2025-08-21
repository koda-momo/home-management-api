import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Day.jsプラグインを設定
dayjs.extend(utc);
dayjs.extend(timezone);

// 日本時間のタイムゾーン
const JAPAN_TIMEZONE = 'Asia/Tokyo';

/**
 * 現在の日本時間を取得
 */
export const getNowInJapan = (): Date => {
  return dayjs().tz(JAPAN_TIMEZONE).toDate();
};

/**
 * UTCのDateオブジェクトを日本時間に変換
 */
export const convertToJapanTime = (utcDate: Date): Date => {
  return dayjs(utcDate).tz(JAPAN_TIMEZONE).toDate();
};

/**
 * 日本時間のDateオブジェクトをUTCに変換
 */
export const convertToUTC = (japanDate: Date): Date => {
  return dayjs.tz(japanDate, JAPAN_TIMEZONE).utc().toDate();
};

/**
 * 日本時間の文字列表現を取得
 */
export const formatJapanTime = (date: Date): string => {
  return dayjs(date).tz(JAPAN_TIMEZONE).format('YYYY-MM-DD HH:mm:ss');
};
