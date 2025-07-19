import jwt from 'jsonwebtoken';
import User from '../models/user';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Yetkisiz erişim: token yok' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id).select('-password');

    if (!user) return res.status(401).json({ message: 'Kullanıcı bulunamadı' });

    req.user = user;
    next();
  } catch (err) {
    console.error('authMiddleware error:', err);
    res.status(401).json({ message: 'Token geçersiz' });
  }
};
