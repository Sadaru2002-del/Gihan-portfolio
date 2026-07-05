import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import auth from '../middleware/auth.js';
import { authAndContactLimiter } from '../middleware/security.js';

const router = express.Router();

// Apply tight rate limiter on registration and login
router.post('/register', authAndContactLimiter, register);
router.post('/login', authAndContactLimiter, login);
router.get('/me', auth, getMe);

export default router;
