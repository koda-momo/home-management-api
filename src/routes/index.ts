import { Router } from 'express';
import { stockRouter } from './stock';
import { gasRouter } from './gas';
import { API_URL } from '../utils/const';

const router = Router();

router.use(API_URL.stock, stockRouter);
router.use(API_URL.gas, gasRouter);

export { router as apiRouter };
