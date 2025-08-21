import { Router } from 'express';
import {
  getAllStockController,
  getIdStockController,
  postAddStockCountController,
  postSubStockCountController,
} from '../controllers/stockController';

const router = Router();

router.get('/', getAllStockController);
router.get('/:id', getIdStockController);
router.post('/count/add', postAddStockCountController);
router.post('/count/sub', postSubStockCountController);

export { router as stockRouter };
