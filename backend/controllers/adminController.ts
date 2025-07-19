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
