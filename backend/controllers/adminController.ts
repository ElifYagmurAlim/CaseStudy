import { Request, Response } from 'express';
import Order from '../models/order';
import User from '../models/user';
import Product from '../models/product';
import { DateFilters } from '../constants/dateFilters';

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const range = req.query.range || DateFilters.MONTH; // "week", "month", "year"
    const now = new Date();
    let startDate = new Date();

    switch (range) {
      case DateFilters.WEEK:
        startDate.setDate(now.getDate() - 7);
        break;
      case DateFilters.MONTH:
        startDate.setMonth(now.getMonth() - 1);
        break;
      case DateFilters.YEAR:
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const [ordersInRange, totalOrders, userCount, recentOrders, popularProducts] = await Promise.all([
      Order.find({ createdAt: { $gte: startDate } }),
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'email'),
      Product.find().sort({ sold: -1 }).limit(5),
    ]);

    const totalSales = ordersInRange.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    const salesTrend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: range === DateFilters.YEAR ? "%Y-%m" : "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          total: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalSales,
      orderCount: totalOrders,
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

export const getAdminStats = async (_req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    res.json({
      totalUsers,
      totalOrders,
      totalProducts,
    });
  } catch (err) {
    console.error('getAdminStats error:', err);
    res.status(500).json({ message: 'Sunucu hatası', error: err });
  }
};
