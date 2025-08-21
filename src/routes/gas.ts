import { Router } from 'express';
import { getGasUsage } from '../controllers/gasController';

const router = Router();

router.get('/', getGasUsage);

export { router as gasRouter };
