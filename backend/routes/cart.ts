import express from 'express';
import {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
} from '../controllers/cartController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Sepet işlemleri için auth zorunlu
router.use(authMiddleware);

router.get('/', getCart);
router.post('/', addToCart);
router.patch('/', updateCart);
router.delete('/:productId', removeFromCart);

export default router;
