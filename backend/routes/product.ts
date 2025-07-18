import express from 'express';
import {
  getAllProducts,
  getProductById,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController';
import { upload } from '../middleware/upload';

const router = express.Router();

// @route GET /api/products
router.get('/', getAllProducts);

// @route GET /api/products/:id
router.get('/:id', getProductById);

// @route GET /products/:id/related
router.get('/:id/related', getRelatedProducts);

// @route POST /api/products
router.post('/', upload.array('images', 5), createProduct);

// @route PATCH /api/products/:id
router.patch('/:id', updateProduct);

// @route DELETE /api/products/:id
router.delete('/:id', deleteProduct);

export default router;
