import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  getAllOrders,
  getUserOrders,
  createOrder,
  updateOrderStatus,
  getOrderById
} from '../controllers/orderController';

const router = express.Router();

// @route GET /api/orders
router.get('/', getAllOrders);

// @route GET /api/orders/user
router.get('/user', authMiddleware, getUserOrders);

// @route POST /api/orders
router.post('/', createOrder);

// @route PATCH /api/orders/:id/status
router.patch('/:id/status', updateOrderStatus);

router.get('/:id', authMiddleware, getOrderById); // Backend route

export default router;
