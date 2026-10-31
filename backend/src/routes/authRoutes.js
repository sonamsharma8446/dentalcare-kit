import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { login, me } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Slows down password guessing: a limited number of login tries per IP every 15 minutes.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.loginRateLimit,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again in 15 minutes' },
});

router.post('/login', loginLimiter, login);
router.get('/me', protect, me);

export default router;
