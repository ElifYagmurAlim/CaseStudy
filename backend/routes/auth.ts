import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';
import { generateToken } from '../utils/generateToken';

const router = express.Router();

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    phone,
    addresses: [], // isteğe bağlı
    isVerified: false,
  });


    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      token: generateToken(user._id.toString()),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      token: generateToken(user._id.toString()),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;
