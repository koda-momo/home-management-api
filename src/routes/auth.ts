import { Router } from 'express';
import {
  loginController,
  statusController,
  logoutController,
} from '../controllers/authController.js';

const router = Router();

router.post('/login', loginController);
router.get('/status', statusController);
router.post('/logout', logoutController);

export default router;
