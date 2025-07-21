import { Request, Response } from 'express';
import User, {IUser} from '../models/user';
import Product from '../models/product';

// GET /cart → Kullanıcının sepetini getir
export const getCart = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ error: 'Sepet alınamadı' });
  }
};

// POST /cart → Sepete ürün ekle
export const addToCart = async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;

  
  try {
    const user = await User.findById(req.user.id) as IUser;
    const existingItem = user.cart.find((item: typeof user.cart[0]) =>
      item.product.equals(productId)
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    const updated = await User.findById(req.user.id).populate('cart.product');
    res.json(updated.cart);
  } catch (err) {
    res.status(500).json({ error: 'Ürün sepete eklenemedi' });
  }
};

// PATCH /cart → Sepetteki ürünün miktarını güncelle
export const updateCart = async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;

  try {
    const user = await User.findById(req.user.id) as IUser;
    const item = user.cart.find((item: typeof user.cart[0]) =>
      item.product.equals(productId)
    );

    if (item) {
      item.quantity = quantity;
      await user.save();
    }

    const updated = await User.findById(req.user.id).populate('cart.product');
    res.json(updated.cart);
  } catch (err) {
    res.status(500).json({ error: 'Sepet güncellenemedi' });
  }
};

// DELETE /cart/:productId → Sepetten ürün sil
export const removeFromCart = async (req: Request, res: Response) => {
  const { productId } = req.params;

  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(
      (item: any) => !item.product.equals(productId)
    );
    await user.save();
    const updated = await User.findById(req.user.id).populate('cart.product');
    res.json(updated.cart);
  } catch (err) {
    res.status(500).json({ error: 'Ürün sepetten silinemedi' });
  }
};
