import { Router } from 'express';
import { stockRouter } from './stock.js';
import { gasRouter } from './gas.js';
import { API_URL } from '../utils/const.js';

const router = Router();

router.use(API_URL.stock, stockRouter);
router.use(API_URL.gas, gasRouter);

export { router as apiRouter };
