import { describe, it, expect } from 'vitest';
import {
  getNowInJapan,
  convertToJapanTime,
  convertToUTC,
  formatJapanTime,
} from '../../utils/functions/timezone';

describe('timezone', () => {
  describe('getNowInJapan', () => {
    it('現在の日本時間を取得できること', () => {
      const now = getNowInJapan();
      expect(now).toBeInstanceOf(Date);
    });
  });

  describe('convertToJapanTime', () => {
    it('UTCの日時を日本時間に変換できること', () => {
      const utcDate = new Date('2023-01-01T00:00:00.000Z');
      const japanTime = convertToJapanTime(utcDate);

      expect(japanTime).toBeInstanceOf(Date);
      // 同じ時刻を表すDateオブジェクトとして返される
      expect(japanTime.getTime()).toBe(utcDate.getTime());
    });
  });

  describe('convertToUTC', () => {
    it('日本時間の日時をUTCに変換できること', () => {
      const japanDate = new Date('2023-01-01T09:00:00+09:00');
      const utcTime = convertToUTC(japanDate);

      expect(utcTime).toBeInstanceOf(Date);
      // UTCの午前0時になることを確認
      expect(utcTime.getUTCHours()).toBe(0);
    });
  });

  describe('formatJapanTime', () => {
    it('日付を日本時間の文字列表現で取得できること', () => {
      const date = new Date('2023-01-01T00:00:00.000Z');
      const formatted = formatJapanTime(date);

      expect(formatted).toBe('2023-01-01 09:00:00');
    });
  });
});
