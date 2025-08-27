import { describe, it, expect } from 'vitest';
import { postSpentSchema } from '../../schemas/spentSchema';

describe('spentSchema', () => {
  describe('postSpentSchema', () => {
    it('正常系: 正しい形式のデータでバリデーションが通る', () => {
      const validData = {
        credit: 50000,
        other: 2000,
      };

      const result = postSpentSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it('異常系: creditが数値でない場合はエラーになる', () => {
      const invalidData = {
        credit: 'invalid',
        other: 2000,
      };

      expect(() => postSpentSchema.parse(invalidData)).toThrow();
    });

    it('異常系: otherが数値でない場合はエラーになる', () => {
      const invalidData = {
        credit: 50000,
        other: 'invalid',
      };

      expect(() => postSpentSchema.parse(invalidData)).toThrow();
    });

    it('異常系: 必須フィールドが不足している場合はエラーになる', () => {
      const invalidData = {
        credit: 50000,
      };

      expect(() => postSpentSchema.parse(invalidData)).toThrow();
    });

    it('異常系: 空のオブジェクトの場合はエラーになる', () => {
      const invalidData = {};

      expect(() => postSpentSchema.parse(invalidData)).toThrow();
    });
  });
});
