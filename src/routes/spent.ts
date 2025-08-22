import { Router } from 'express';
import {
  getAllSpentController,
  getMonthSpentController,
} from '../controllers/spentController';

const router = Router();

router.get('/', getAllSpentController);
router.get('/month', getMonthSpentController);

export { router as spentRouter };
