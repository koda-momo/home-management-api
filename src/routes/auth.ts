import { Router } from 'express';
import { login, status, logout } from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.get('/status', status);
router.post('/logout', logout);

export default router;
