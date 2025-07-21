import { Request, Response } from 'express';
import Review from '../models/review';
import Order from '../models/order';

export const getReviewsForProduct = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'firstName lastName');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err });
  }
};

export const createReview = async (req: Request, res: Response) => {
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

export const canUserReview = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { productId } = req.params;

  try {
    // 1. Ürünü teslim almış mı?
    const hasDeliveredOrder = await Order.findOne({
      user: userId,
      status: 'delivered',
      'items.product': productId,
    });

    if (!hasDeliveredOrder) {
      return res.json({ canReview: false });
    }

    // 2. Daha önce yorum yapmış mı?
    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
      return res.json({ canReview: false });
    }

    res.json({ canReview: true });
  } catch (err) {
    console.error('Review izin kontrolü hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
