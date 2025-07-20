import express from 'express';
import { registerUser, loginUser, updatePassword, verifyEmail, resendVerificationEmail,  } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import { loginLimiter, registerLimiter } from '../middleware/rateLimit';

const router = express.Router();

router.post('/register', registerLimiter , registerUser); // POST /api/auth/register
router.post('/login', loginLimiter, loginUser);       // POST /api/auth/login
router.patch('/:id/password', authMiddleware, updatePassword);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

export default router;
