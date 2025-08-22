import { Router } from 'express';
import { getSpentController } from '../controllers/spentController';

const router = Router();

router.get('/', getSpentController);

export { router as spentRouter };
