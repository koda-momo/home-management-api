import { Router } from 'express';
import { stockRouter } from './stock.js';
import { API_URL } from '../utils/const.js';

const router = Router();

router.use(API_URL.stock, stockRouter);

export { router as apiRouter };
