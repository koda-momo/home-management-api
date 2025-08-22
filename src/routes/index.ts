import { Router } from 'express';
import { stockRouter } from './stock';
import { gasRouter } from './gas';
import { API_URL } from '../utils/const';
import { getWeather } from '../controllers/weatherController';

const router = Router();

router.use(API_URL.stock, stockRouter);
router.use(API_URL.gas, gasRouter);

// TODO:テスト後削除
router.use('/weather', getWeather);

export { router as apiRouter };
