import express from 'express';
import {
  getAllCategories,
  createCategory,
  deleteCategory
} from '../controllers/categoryController';
import { upload } from '../middleware/upload';

const router = express.Router();

// @route GET /api/categories
router.get('/', getAllCategories);

// @route POST /api/categories
router.post('/', upload.single('image'), createCategory);

// @route DELETE /api/categories/:id
router.delete('/:id', deleteCategory);

export default router;
