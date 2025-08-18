import { Router } from 'express';
import { StockController } from '../controllers/stockController.js';

const router = Router();

router.get('/', StockController.getStock);
router.post('/count/add', StockController.addCount);
router.post('/count/delete', StockController.deleteCount);

export { router as stockRouter };
