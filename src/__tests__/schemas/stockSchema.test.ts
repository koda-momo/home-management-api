import { describe, it, expect } from 'vitest';
import z from 'zod';
import {
  getIdStockSchema,
  postAddStockCountSchema,
  postSubStockCountSchema,
} from '../../schemas/stockSchema';
import { errorResponse } from '../../utils/const';
import { validation } from '../../schemas';

describe('stockSchema', () => {
  describe('getIdStockSchema', () => {
    it('正常な数値文字列IDをパースできること', () => {
      const result = getIdStockSchema.parse({ id: '1' });
      expect(result).toEqual({ id: 1 });
    });

    it('数値IDをパースできること', () => {
      const result = getIdStockSchema.parse({ id: 1 });
      expect(result).toEqual({ id: 1 });
    });

    it('無効なIDの場合はエラーをスローすること', () => {
      expect(() => getIdStockSchema.parse({ id: 'invalid' })).toThrow();
    });

    it('IDが未定義の場合はエラーをスローすること', () => {
      expect(() => getIdStockSchema.parse({})).toThrow();
    });
  });

  describe('postAddStockCountSchema', () => {
    it('正常な数値文字列IDをパースできること', () => {
      const result = postAddStockCountSchema.parse({ id: '1' });
      expect(result).toEqual({ id: 1 });
    });

    it('数値IDをパースできること', () => {
      const result = postAddStockCountSchema.parse({ id: 1 });
      expect(result).toEqual({ id: 1 });
    });

    it('無効なIDの場合はエラーをスローすること', () => {
      expect(() => postAddStockCountSchema.parse({ id: 'invalid' })).toThrow();
    });
  });

  describe('postSubStockCountSchema', () => {
    it('正常な数値文字列IDをパースできること', () => {
      const result = postSubStockCountSchema.parse({ id: '1' });
      expect(result).toEqual({ id: 1 });
    });

    it('数値IDをパースできること', () => {
      const result = postSubStockCountSchema.parse({ id: 1 });
      expect(result).toEqual({ id: 1 });
    });

    it('無効なIDの場合はエラーをスローすること', () => {
      expect(() => postSubStockCountSchema.parse({ id: 'invalid' })).toThrow();
    });
  });

  describe('validation', () => {
    it('正常なデータをバリデーションできること', () => {
      const result = validation({ id: '1' }, getIdStockSchema);
      expect(result).toEqual({ id: 1 });
    });

    it('Zodエラーの場合は適切なエラーメッセージをスローすること', () => {
      expect(() => validation({ id: 'invalid' }, getIdStockSchema)).toThrow(
        expect.objectContaining({
          ...errorResponse.badRequest,
          message: expect.any(String),
        })
      );
    });

    it('Zod以外のエラーの場合はbadRequestをスローすること', () => {
      const invalidSchema = {
        parse: () => {
          throw new Error('Unknown error');
        },
      } as unknown as z.ZodTypeAny;

      expect(() => validation({}, invalidSchema)).toThrowError(
        expect.objectContaining(errorResponse.badRequest)
      );
    });

    it('複数のフィールドがある場合も正しくバリデーションできること', () => {
      const schema = getIdStockSchema;
      const result = validation({ id: 1 }, schema);
      expect(result).toEqual({ id: 1 });
    });
  });
});
