import { describe, it, expect } from 'vitest';
import { makeYearMonthString } from '../../utils/functions/makeYearMonthString';

describe('makeYearMonthString', () => {
  describe('20日未満の場合', () => {
    it('1月19日は前年12月として処理されること', () => {
      const date = new Date('2023-01-19T10:00:00');
      const result = makeYearMonthString(date);
      expect(result).toBe('202212');
    });

    it('3月15日は2月として処理されること', () => {
      const date = new Date('2023-03-15T10:00:00');
      const result = makeYearMonthString(date);
      expect(result).toBe('202302');
    });

    it('10月10日は9月として処理されること', () => {
      const date = new Date('2023-10-10T10:00:00');
      const result = makeYearMonthString(date);
      expect(result).toBe('202309');
    });

    it('11月10日は10月として処理されること', () => {
      const date = new Date('2023-11-10T10:00:00');
      const result = makeYearMonthString(date);
      expect(result).toBe('202310');
    });

    it('12月10日は11月として処理されること', () => {
      const date = new Date('2023-12-10T10:00:00');
      const result = makeYearMonthString(date);
      expect(result).toBe('202311');
    });
  });

  describe('20日以降の場合', () => {
    it('1月20日は1月として処理されること', () => {
      const date = new Date('2023-01-20T10:00:00');
      const result = makeYearMonthString(date);
      expect(result).toBe('202301');
    });

    it('1月31日は1月として処理されること', () => {
      const date = new Date('2023-01-31T10:00:00');
      const result = makeYearMonthString(date);
      expect(result).toBe('202301');
    });

    it('3月25日は3月として処理されること', () => {
      const date = new Date('2023-03-25T10:00:00');
      const result = makeYearMonthString(date);
      expect(result).toBe('202303');
    });

    it('10月20日は10月として処理されること', () => {
      const date = new Date('2023-10-20T10:00:00');
      const result = makeYearMonthString(date);
      expect(result).toBe('202310');
    });

    it('11月20日は11月として処理されること', () => {
      const date = new Date('2023-11-20T10:00:00');
      const result = makeYearMonthString(date);
      expect(result).toBe('202311');
    });

    it('12月20日は12月として処理されること', () => {
      const date = new Date('2023-12-20T10:00:00');
      const result = makeYearMonthString(date);
      expect(result).toBe('202312');
    });
  });

  describe('境界値テスト', () => {
    it('1月1日は前年12月として処理されること', () => {
      const date = new Date('2023-01-01T10:00:00');
      const result = makeYearMonthString(date);
      expect(result).toBe('202212');
    });

    it('2月19日は1月として処理されること', () => {
      const date = new Date('2023-02-19T10:00:00');
      const result = makeYearMonthString(date);
      expect(result).toBe('202301');
    });

    it('2月20日は2月として処理されること', () => {
      const date = new Date('2023-02-20T10:00:00');
      const result = makeYearMonthString(date);
      expect(result).toBe('202302');
    });
  });

  describe('桁数調整テスト', () => {
    it('1桁月は0パディングされること', () => {
      const date = new Date('2023-02-20T10:00:00');
      const result = makeYearMonthString(date);
      expect(result).toBe('202302');
    });

    it('2桁月はそのまま表示されること', () => {
      const date = new Date('2023-11-20T10:00:00');
      const result = makeYearMonthString(date);
      expect(result).toBe('202311');
    });
  });

  describe('年またぎテスト', () => {
    it('12月31日は12月として処理されること', () => {
      const date = new Date('2023-12-31T10:00:00');
      const result = makeYearMonthString(date);
      expect(result).toBe('202312');
    });

    it('翌年1月1日は前年12月として処理されること', () => {
      const date = new Date('2024-01-01T10:00:00');
      const result = makeYearMonthString(date);
      expect(result).toBe('202312');
    });
  });
});
