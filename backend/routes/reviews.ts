import express from 'express';
import Review from '../models/review';

const router = express.Router();

// @route POST /api/reviews
router.post('/', async (req, res) => {
  const { user, product, rating, comment } = req.body;

  try {
    const review = await Review.create({ user, product, rating, comment });
    res.status(201).json(review);
  } catch (err) {
    console.error('POST /api/reviews error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/reviews/product/:id
router.get('/product/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id, approved: true })
      .populate('user', 'firstName lastName');
    res.json(reviews);
  } catch (err) {
    console.error('GET /api/reviews/product/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route PATCH /api/reviews/:id/approve
router.patch('/:id/approve', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.approved = true;
    await review.save();

    res.json({ message: 'Review approved', review });
  } catch (err) {
    console.error('PATCH /api/reviews/:id/approve error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
