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
    // Kullanıcının bu ürünü içeren tüm teslim edilmiş siparişlerini al
    const deliveredOrders = await Order.find({
      user: userId,
      status: 'delivered',
      'items.product': productId,
    });

    // Aynı ürünü içeren sipariş sayısı kadar yorum hakkı var
    const deliveredCount = deliveredOrders.length;

    if (deliveredCount === 0) {
      return res.json({ canReview: false });
    }

    // Kullanıcının o ürüne yaptığı yorum sayısı
    const reviewCount = await Review.countDocuments({
      user: userId,
      product: productId,
    });

    // Eğer teslim edilen sipariş sayısı > yorum sayısı ise yorum yapabilir
    const canReview = deliveredCount > reviewCount;

    res.json({ canReview });
  } catch (err) {
    console.error('Review izin kontrolü hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
