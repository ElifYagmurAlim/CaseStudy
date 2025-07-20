import express from 'express';
import * as productController from '../controllers/productController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { upload } from '../middleware/upload';

const router = express.Router();

// Public Routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/:id/related', productController.getRelatedProducts);
router.get('/:id/viewed-together', productController.getViewedTogether);

// Öneri sistemi
router.post('/:id/viewed', productController.viewCounter);      // görüntülenme + viewedWith update
router.post('/recent', productController.lastViews);            // tarayıcıdaki son gezilenleri döner
router.post('/viewed-together', productController.updateViewedTogether); // viewedWith kaydı

// Admin Routes
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  upload.array('images'),
  productController.createProduct
);

router.patch(
  '/:id',
  authMiddleware,
  adminMiddleware,
  productController.updateProduct
);

router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  productController.deleteProduct
);

router.patch(
  '/bulk/update-status',
  authMiddleware,
  adminMiddleware,
  productController.bulkUpdateStatus
);

// Yorum ekleme
router.post('/:productId/review', authMiddleware, productController.addReview);

export default router;
