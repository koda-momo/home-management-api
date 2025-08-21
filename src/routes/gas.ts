import { Router } from 'express';
import { getGasUsage } from '../controllers/gasController.js';

const router = Router();

router.get('/', getGasUsage);

export { router as gasRouter };
