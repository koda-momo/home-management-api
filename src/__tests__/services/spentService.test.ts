import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { Request } from 'express';
import {
  getAllSpentService,
  getMonthSpentService,
  postSpentService,
} from '../../services/spentService';
import { FirebaseError } from 'firebase/app';
import {
  mockSpentServiceData,
  mockSpentMonthData,
  mockSpentRequestBody,
} from '../__mocks__/spentData';

// Firebase関連のモック
vi.mock('firebase/database', () => ({
  ref: vi.fn(),
  getDatabase: vi.fn(),
  child: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
}));

vi.mock('../../config/firebase', () => ({
  app: {},
}));

vi.mock('../../schemas', () => ({
  validation: vi.fn(),
}));

vi.mock('../../utils/functions/makeYearMonthString', () => ({
  makeYearMonthString: vi.fn(),
}));

describe('spentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllSpentService', () => {
    it('正常系: 全ての支出データを取得できる', async () => {
      const mockSnapshot = {
        val: () => mockSpentServiceData,
      };

      const { ref, getDatabase, child, get } = await import(
        'firebase/database'
      );
      (getDatabase as Mock).mockReturnValue('mockDb');
      (ref as Mock).mockReturnValue('mockRef');
      (child as Mock).mockReturnValue('mockChild');
      (get as Mock).mockResolvedValue(mockSnapshot);

      const result = await getAllSpentService();

      expect(getDatabase).toHaveBeenCalledWith({});
      expect(ref).toHaveBeenCalledWith('mockDb');
      expect(child).toHaveBeenCalledWith('mockRef', 'price');
      expect(get).toHaveBeenCalledWith('mockChild');

      expect(result).toEqual([
        { month: '2024-01', ...mockSpentServiceData['2024-01'] },
        { month: '2024-02', ...mockSpentServiceData['2024-02'] },
      ]);
    });

    it('異常系: 一般的なエラーが発生した場合はそのままthrowする', async () => {
      const error = new Error('Network error');
      const { get } = await import('firebase/database');
      (get as Mock).mockRejectedValue(error);

      await expect(getAllSpentService()).rejects.toThrow('Network error');
    });

    it('異常系: FirebaseErrorが発生した場合はそのままthrowする', async () => {
      const firebaseError = new FirebaseError(
        'Permission denied',
        'permission-denied'
      );
      const { get } = await import('firebase/database');
      (get as Mock).mockRejectedValue(firebaseError);

      await expect(getAllSpentService()).rejects.toThrow(firebaseError);
    });
  });

  describe('getMonthSpentService', () => {
    it('正常系: 当月の支出データを取得できる', async () => {
      const mockSnapshot = {
        val: () => mockSpentMonthData,
      };

      const { makeYearMonthString } = await import(
        '../../utils/functions/makeYearMonthString'
      );
      const { ref, getDatabase, child, get } = await import(
        'firebase/database'
      );
      (makeYearMonthString as Mock).mockReturnValue('2024-01');
      (getDatabase as Mock).mockReturnValue('mockDb');
      (ref as Mock).mockReturnValue('mockRef');
      (child as Mock)
        .mockReturnValueOnce('mockChild')
        .mockReturnValueOnce('mockMonthChild');
      (get as Mock).mockResolvedValue(mockSnapshot);

      const result = await getMonthSpentService();

      expect(makeYearMonthString).toHaveBeenCalledWith(expect.any(Date));
      expect(child).toHaveBeenCalledWith('mockChild', '2024-01');
      expect(result).toEqual(mockSpentMonthData);
    });

    it('異常系: FirebaseErrorが発生した場合はそのままthrowする', async () => {
      const firebaseError = new FirebaseError('Not found', 'not-found');
      const { get } = await import('firebase/database');
      (get as Mock).mockRejectedValue(firebaseError);

      await expect(getMonthSpentService()).rejects.toThrow(firebaseError);
    });
  });

  describe('postSpentService', () => {
    it('正常系: 支出データを正常に登録できる', async () => {
      const { validation } = await import('../../schemas');
      const { makeYearMonthString } = await import(
        '../../utils/functions/makeYearMonthString'
      );
      const { getDatabase, ref, set } = await import('firebase/database');
      (validation as Mock).mockReturnValue(mockSpentRequestBody);
      (makeYearMonthString as Mock).mockReturnValue('2024-01');
      (getDatabase as Mock).mockReturnValue('mockDb');
      (ref as Mock).mockReturnValue('mockRef');
      (set as Mock).mockResolvedValue(undefined);

      const result = await postSpentService(
        mockSpentRequestBody as Request['body']
      );

      expect(validation).toHaveBeenCalledWith(
        mockSpentRequestBody,
        expect.anything()
      );
      expect(makeYearMonthString).toHaveBeenCalledWith(expect.any(Date));
      expect(set).toHaveBeenCalledWith('mockRef', {
        spending: 52000,
        ...mockSpentRequestBody,
      });

      expect(result).toEqual({
        month: '2024-01',
        spending: 52000,
        ...mockSpentRequestBody,
      });
    });

    it('異常系: バリデーションエラーが発生した場合はそのままthrowする', async () => {
      const error = new Error('Validation error');
      const { validation } = await import('../../schemas');
      (validation as Mock).mockImplementation(() => {
        throw error;
      });

      await expect(postSpentService({} as Request['body'])).rejects.toThrow(
        'Validation error'
      );
    });

    it('異常系: FirebaseErrorが発生した場合はそのままthrowする', async () => {
      const { validation } = await import('../../schemas');
      const { makeYearMonthString } = await import(
        '../../utils/functions/makeYearMonthString'
      );
      const { set } = await import('firebase/database');
      (validation as Mock).mockReturnValue(mockSpentRequestBody);
      (makeYearMonthString as Mock).mockReturnValue('2024-01');

      const firebaseError = new FirebaseError('Write failed', 'write-failed');
      (set as Mock).mockRejectedValue(firebaseError);

      await expect(
        postSpentService(mockSpentRequestBody as Request['body'])
      ).rejects.toThrow(firebaseError);
    });
  });
});
