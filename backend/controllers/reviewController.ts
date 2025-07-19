import { Request, Response } from 'express';
import Review from '../models/review';

export const getReviewsForProduct = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'firstName lastName');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err });
  }
};

export const createReview = async (req: any, res: Response) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err });
  }
};
