import { vi } from 'vitest';

export const mockRef = vi.fn();
export const mockGetDatabase = vi.fn();
export const mockChild = vi.fn();
export const mockGet = vi.fn();
export const mockSet = vi.fn();

export const mockApp = {};

// firebase/database モック
vi.mock('firebase/database', () => ({
  ref: mockRef,
  getDatabase: mockGetDatabase,
  child: mockChild,
  get: mockGet,
  set: mockSet,
}));

// firebase/app モック
vi.mock('firebase/app', () => ({
  FirebaseError: class FirebaseError extends Error {
    public code: string;
    constructor(message: string, code: string = 'unknown') {
      super(message);
      this.name = 'FirebaseError';
      this.code = code;
    }
  },
}));

// config/firebase モック
vi.mock('../../config/firebase', () => ({
  app: mockApp,
}));
