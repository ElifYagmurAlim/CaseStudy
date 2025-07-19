import express from 'express';
import { registerUser, loginUser, updatePassword  } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser); // POST /api/auth/register
router.post('/login', loginUser);       // POST /api/auth/login
router.patch('/:id/password', authMiddleware, updatePassword);

export default router;
