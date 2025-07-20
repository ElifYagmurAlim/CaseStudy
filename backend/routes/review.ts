import express from 'express';
import { getReviewsForProduct, createReview , canUserReview,} from '../controllers/reviewController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/:productId', getReviewsForProduct);
router.post('/:productId', authMiddleware, createReview);
router.get('/can-review/:productId', authMiddleware, canUserReview);

export default router;
