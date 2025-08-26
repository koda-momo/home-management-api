import { Router } from 'express';
import { postLineController } from '../controllers/lineController';

const router = Router();

router.post('/', postLineController);

export { router as lineRouter };
