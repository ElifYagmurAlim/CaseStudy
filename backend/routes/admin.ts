import express from 'express';
import Order from '../models/order';
import User from '../models/user';
import Product from '../models/product';

const router = express.Router();

// @route GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const totalSalesAgg = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: { $sum: '$items.price' } } } }
    ]);

    const totalSales = totalSalesAgg[0]?.total || 0;
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    const topProducts = await Product.find()
      .sort({ sold: -1 })
      .limit(5)
      .select('name price sold');

    const statusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      totalSales,
      totalOrders,
      totalUsers,
      topProducts,
      statusCounts
    });
  } catch (err) {
    console.error('GET /api/admin/stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/admin/sales-trends
router.get('/sales-trends', async (req, res) => {
  try {
    const trends = await Order.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          total: { $sum: { $sum: '$items.price' } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthlySales = Array(12).fill(0);
    trends.forEach(item => {
      monthlySales[item._id - 1] = item.total;
    });

    res.json({ monthlySales });
  } catch (err) {
    console.error('GET /api/admin/sales-trends error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
