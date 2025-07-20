import express from 'express';
import {
  getAllCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  getCategory,
} from '../controllers/categoryController';
import { upload } from '../middleware/upload';

const router = express.Router();

// @route GET /api/categories
router.get('/', getAllCategories);

// @route POST /api/categories
router.post('/', upload.single('image'), createCategory);

// @route DELETE /api/categories/:id
router.delete('/:id', deleteCategory);

router.patch('/:id', upload.single('image'), updateCategory);

router.get('/:id', getCategory);

export default router;
