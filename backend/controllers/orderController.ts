import { Request, Response } from 'express';
import Order from '../models/order';
import Product from '../models/product';

// @desc    Admin: Tüm siparişleri getir
export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate('user', 'email')
      .populate('items.product', 'name price');

    res.json(orders);
  } catch (err) {
    console.error('GET /api/orders error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Kullanıcının kendi siparişlerini getir
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const orders = await Order.find({ user: userId })
      .populate('items.product', 'name price');

    res.json(orders);
  } catch (err) {
    console.error('GET /api/orders/user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      return res.status(404).json({ message: 'Sipariş bulunamadı' });
    }

    //admin denetimi gelmeli
    // Sadece kullanıcı kendi siparişini görebilsin
    if (order.user.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Yetkisiz erişim' });
    }
    console.log(order);

    res.json(order);
  } catch (err) {
    console.error('Order get error:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// export const getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id).populate('user', 'email').populate('items.product');
//     if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı' });
//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ message: 'Hata oluştu' });
//   }
// };

// @desc    Yeni sipariş oluştur
export const createOrder = async (req: Request, res: Response) => {
  const { user, items, shippingAddress, paymentMethod } = req.body;

  try {
    for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.stock < item.qty) {
      return res.status(400).json({ message: `${product.name} is out of stock or quantity too high` });
    }
}
    const order = await Order.create({
      user,
      items,
      shippingAddress,
      paymentMethod,
      status: 'pending'
    });

    // Sipariş başarıyla oluşturulduktan sonra
    for (const item of req.body.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty, sold: +item.qty }
      });
    }


    res.status(201).json({ message: 'Order created', order });
  } catch (err) {
    console.error('POST /api/orders error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Sipariş durumunu güncelle
export const updateOrderStatus = async (req: Request, res: Response) => {
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
};
