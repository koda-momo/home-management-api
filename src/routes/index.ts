import { Router } from 'express';
import { stockRouter } from './stock.js';
import { STOCK_API_BASE_URL } from '../utils/const.js';

const router = Router();

router.use(STOCK_API_BASE_URL, stockRouter);

export { router as apiRouter };
