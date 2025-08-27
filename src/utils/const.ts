export const BASE_URL = '/api/v1';
export const API_URL = {
  stock: '/stock',
  spent: '/spent',
  line: '/line',
  auth: '/auth',
};

// stock
export const MAX_STOCK_COUNT = 21;
export const MIN_STOCK_COUNT = 0;
export const EDIT_STOCK_COUNT = 1;

export const errorResponse = {
  badRequest: {
    name: 'Error',
    message: 'Bad Request',
    statusCode: 400,
  },
  internalServerError: {
    name: 'Error',
    message: 'Internal Server Error',
    statusCode: 500,
  },
  // stock
  stockNotFound: {
    name: 'Error',
    message: '在庫情報が見つかりません',
    statusCode: 404,
  },
  idMustBeNumber: {
    name: 'Error',
    message: 'IDの形式が正しくありません',
    statusCode: 400,
  },
  maxStockCount: {
    name: 'Error',
    message: `登録されている合計個数が${MAX_STOCK_COUNT}を上回ります`,
    statusCode: 400,
  },
  minStockCount: {
    name: 'Error',
    message: `登録されている合計個数が${MIN_STOCK_COUNT}を下回ります`,
    statusCode: 400,
  },

  failedToUpdateCount: {
    name: 'Error',
    message: '在庫個数の更新に失敗しました',
    statusCode: 500,
  },
  // spent
  spentMustBeNumber: {
    name: 'Error',
    message: '金額は数字で入力してください',
    statusCode: 400,
  },
} as const;
