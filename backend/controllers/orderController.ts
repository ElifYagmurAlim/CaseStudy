import { Request, Response } from 'express';
import Order from '../models/order';
import Product from '../models/product';
import product from '../models/product';

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
  if (order.user && req.user && order.user.toString() !== req.user._id.toString()) {
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
  const { user, items, address, paymentMethod = 'cash' } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Sipariş ürünleri boş olamaz' });
  }

  try {
    // Stok kontrolü
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: 'Ürün bulunamadı' });
      }
      if (product.stock < item.qty) {
        return res.status(400).json({
          message: `${product.name} ürünü için stok yetersiz`,
        });
      }
    }
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    // Sipariş oluştur
    const newOrder = await Order.create({
      user: user || null, // null olabilir, misafir siparişi
      items: items.map(item => ({
        product: item.product,
        qty: item.qty,
        price: item.price,
      })),
      shippingAddress: address,
      paymentMethod,
      status: 'pending',
      totalPrice: totalPrice,
    });

    // Stok güncelleme
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.qty, sold: item.qty },
      });
    }

    res.status(201).json({ message: 'Sipariş oluşturuldu', order: newOrder });
  } catch (err) {
    console.error('POST /api/orders error:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// @desc    Sipariş durumunu güncelle
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.status = status;
    order.totalPrice = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);

    await order.save();
    res.json({ message: 'Order status updated', order });
  } catch (err) {
    console.error('PATCH /api/orders/:id/status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
