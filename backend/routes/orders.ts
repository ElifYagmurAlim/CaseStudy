import express from 'express';
import Order from '../models/order';
import Product from '../models/product';
import User from '../models/user';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = express.Router();

// @route GET /api/orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'email')
      .populate('items.product', 'name price');

    res.json(orders);
  } catch (err) {
    console.error('GET /api/orders error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/orders/user/
// @desc  Get orders of logged-in user
// @access Private
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name price');

    res.json(orders);
  } catch (err) {
    console.error('GET /api/orders/user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/orders/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name price')
      .populate('user', 'email');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Bu sipariş kullanıcıya mı ait kontrolü
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(order);
  } catch (err) {
    console.error('GET /api/orders/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/orders
router.post('/', async (req, res) => {
  const { user, items, shippingAddress, paymentMethod } = req.body;

  try {
    const order = await Order.create({
      user,
      items,
      shippingAddress,
      paymentMethod,
      status: 'pending'
    });

    // Ürünlerin sold miktarını güncelle
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { sold: item.qty }
      });
    }

    res.status(201).json({ message: 'Order created', order });
  } catch (err) {
    console.error('POST /api/orders error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route PATCH /api/orders/:id/status
router.patch('/:id/status', async (req, res) => {
    const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    console.error('PATCH /api/orders/:id/status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Kullanıcı bilgilerini güncelle
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone, addresses } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phone = phone || user.phone;
    user.addresses = addresses || user.addresses;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error('PATCH /api/users/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
