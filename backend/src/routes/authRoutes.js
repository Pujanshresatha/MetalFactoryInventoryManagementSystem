import express from 'express';
import { signup, login, changePassword } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/change-password', authMiddleware, changePassword);

export default router;