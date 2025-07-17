import express from 'express';
import Category from '../models/category';

const router = express.Router();

// @route GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error('GET /api/categories error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/categories
router.post('/', async (req, res) => {
  const { name, description, image, isActive } = req.body;

  try {
    const category = await Category.create({
      name,
      description,
      image,
      isActive
    });

    res.status(201).json(category);
  } catch (err) {
    console.error('POST /api/categories error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
