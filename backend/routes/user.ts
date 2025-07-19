import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getWishlist, 
  toggleWishlist,
} from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Kullanıcıları listele
router.get('/', authMiddleware, getAllUsers);

// Belirli kullanıcıyı al
router.get('/:id', authMiddleware, getUserById);

// Kullanıcıyı güncelle
router.patch('/:id', authMiddleware, updateUser);

// Kullanıcıyı sil (opsiyonel)
router.delete('/:id', authMiddleware, deleteUser);

router.get('/:id/wishlist', authMiddleware, getWishlist);

router.post('/:id/wishlist/:productId', authMiddleware, toggleWishlist);

// ✅ Default export
export default router;
