import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';
import { generateToken } from '../utils/generateToken';

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, phone } = req.body;

  try {
    const userExists = await User.findOne({ email }).select('+password');
    if (userExists)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
    });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
    });
  } catch (err) {
    console.error('REGISTER error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');;
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      addresses: user.addresses,
      token: generateToken(user._id.toString()),
    });
  } catch (err) {
    console.error('LOGIN error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePassword = async (req, res) => {
  try {
    console.log(req.body);
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id).select('+password');
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mevcut şifre yanlış' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Şifre başarıyla güncellendi' });
  } catch (err) {
    console.error('Şifre güncelleme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};