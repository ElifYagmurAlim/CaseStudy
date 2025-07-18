import express from 'express';
import { getAdminStats } from '../controllers/adminController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = express.Router();

router.get('/stats', authMiddleware, adminMiddleware, getAdminStats);

export default router;
