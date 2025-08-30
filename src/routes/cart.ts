import { Router } from 'express';
import { postCartInsert } from '../controllers/cartController';

const router = Router();

router.post('/insert', postCartInsert);

export { router as cartRouter };
