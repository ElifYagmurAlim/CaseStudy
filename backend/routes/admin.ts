import express from 'express';
import { getAdminStats, getDashboard } from '../controllers/adminController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = express.Router();

router.get('/stats', authMiddleware, adminMiddleware, getAdminStats);
router.get('/dashboard', authMiddleware,adminMiddleware, getDashboard);
export default router;
