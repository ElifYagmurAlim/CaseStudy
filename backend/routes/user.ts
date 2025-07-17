import express from 'express';
import User from '../models/user';
import { authMiddleware } from '../middleware/authMiddleware';
import bcrypt from 'bcrypt';

const router = express.Router();

// @route POST /api/users/:id/view
router.post('/:id/view', async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.recentViews = [productId, ...user.recentViews.filter(p => p.toString() !== productId)].slice(0, 5);
    await user.save();

    res.json({ message: 'View updated', recentViews: user.recentViews });
  } catch (err) {
    console.error('POST /api/users/:id/view error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/users/:id/profile
router.get('/:id/profile', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route PUT /api/users/:id/profile
router.put('/:id/profile', async (req, res) => {
  const { firstName, lastName, phone } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phone = phone || user.phone;

    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/users/:id/orders
import Order from '../models/order';

router.get('/:id/orders', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route PUT /api/users/:id/addresses
router.put('/:id/addresses', async (req, res) => {
  const { addresses } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses = addresses;
    await user.save();

    res.json({ message: 'Addresses updated', addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route PUT /api/users/:id/addresses
router.put('/:id/addresses', async (req, res) => {
  const { addresses } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses = addresses;
    await user.save();

    res.json({ message: 'Addresses updated', addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/users/:id
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;

    await user.save();
    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    });
  } catch (err) {
    console.error('PATCH /users/:id error:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// PATCH /api/users/:id/password
router.patch('/:id/password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mevcut şifre yanlış' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Şifre güncellendi' });
  } catch (err) {
    console.error('Şifre güncelleme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

export default router;
