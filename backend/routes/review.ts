import express from 'express';
import { getReviewsForProduct, createReview } from '../controllers/reviewController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/:productId', getReviewsForProduct);
router.post('/:productId', authMiddleware, createReview);

export default router;
