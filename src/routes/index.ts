import { Router } from 'express';
import { stockRouter } from './stock.js';

const router = Router();

router.use('/stock', stockRouter);

export { router as apiRouter };
