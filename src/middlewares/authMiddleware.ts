import { NextFunction, Request, Response } from 'express';
import { API_ACCESS_KEY } from '../config/common';
import { errorResponse } from '../utils/const';

/**
 * APIキー認証ミドルウェア
 * リクエストヘッダーの'x-api-key'をチェックし、環境変数API_ACCESS_KEYと照合する
 */
export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];

  // APIキーが存在しない場合
  if (!apiKey) {
    return res.status(401).json({
      message: errorResponse.missingApiKey.message,
      status: errorResponse.missingApiKey.statusCode,
    });
  }

  // APIキーが一致しない場合
  if (apiKey !== API_ACCESS_KEY) {
    return res.status(401).json({
      message: errorResponse.unauthorizedAccess.message,
      status: errorResponse.unauthorizedAccess.statusCode,
    });
  }

  // 認証成功時は次のミドルウェア/ルートに進む
  next();
};
