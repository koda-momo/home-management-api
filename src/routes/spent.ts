import { Router } from 'express';
import {
  getAllSpentController,
  getMonthSpentController,
  postSpentController,
} from '../controllers/spentController';

const router = Router();

router.get('/', getAllSpentController);
router.get('/month', getMonthSpentController);
router.post('/month', postSpentController);

export { router as spentRouter };
