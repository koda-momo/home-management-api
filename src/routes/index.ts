import { Router } from 'express';
import { stockRouter } from './stock';
import { gasRouter } from './gas';
import authRouter from './auth';
import { API_URL } from '../utils/const';
import { getWeather } from '../controllers/weatherController';
import { spentRouter } from './spent';

const router = Router();

router.get('/', (req, res) => res.send('接続テスト'));
router.use(API_URL.stock, stockRouter);
router.use(API_URL.spent, spentRouter);
router.use(API_URL.gas, gasRouter);
router.use(API_URL.auth, authRouter);

// TODO:テスト後削除
router.use('/weather', getWeather);

export { router as apiRouter };
