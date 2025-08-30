import { errorResponse } from '../utils/const';

export const insertToCart = async (): Promise<{ data: string }> => {
  try {
    // TODO: 今後スクレイピング機能を実装予定
    // 現在は土台として基本的なレスポンスのみ返す
    const data = 'カートに挿入しました（スクレイピング機能は未実装）';

    return { data };
  } catch (error) {
    throw {
      ...errorResponse.cartInsertFailed,
      message: `カート挿入に失敗しました:${error}`,
    };
  }
};
