import { StockModel } from '../models/stock';
import { errorResponse } from '../utils/const';
import { CartInsertResponse } from '../types/cartType';

export const insertToCart = async (id: number): Promise<CartInsertResponse> => {
  try {
    // idに紐づく商品情報をStockテーブルから取得
    const stock = await StockModel.getById(id);

    if (!stock) {
      throw {
        ...errorResponse.stockNotFound,
        message: `ID: ${id}の商品が見つかりません`,
      };
    }

    // TODO: 今後、取得したURLを使ってスクレイピング機能を実装予定
    // 現在は商品URLを返すのみ
    return { url: stock.url };
  } catch (error) {
    // すでにエラーオブジェクトの場合はそのまま再throw
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    throw {
      ...errorResponse.cartInsertFailed,
      message: `カート挿入に失敗しました:${error}`,
    };
  }
};
