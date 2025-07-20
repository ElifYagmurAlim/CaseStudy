import { Request, Response } from 'express';
import Order from '../models/order';
import User from '../models/user';
import Product from '../models/product';

export const getAdminStats = async (_req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    res.json({ totalUsers, totalOrders, totalProducts });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err });
  }
};

export const getDashboard = async (_req: Request, res: Response) => {
  try {
    console.log("a");

    const [totalSales, orderCount, userCount, recentOrders, popularProducts] = await Promise.all([
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'email'),
      Product.aggregate([
        { $unwind: '$sold' },
        { $sort: { sold: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const salesTrend = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          total: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const statusCounts = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.json({
      totalSales: totalSales[0]?.total || 0,
      orderCount,
      userCount,
      recentOrders,
      popularProducts,
      salesTrend,
      statusCounts
    });
  } catch (err) {
    console.error('Dashboard verileri alınırken hata:', err);
    res.status(500).json({ message: 'Dashboard verileri alınamadı' });
  }

};
