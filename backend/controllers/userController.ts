import User from '../models/user';
import { Request, Response } from 'express';
import mongoose from 'mongoose'; // üstte varsa tekrar ekleme

// Tüm kullanıcıları getir (sadece admin)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err });
  }
};

// ID ile kullanıcı getir
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err });
  }
};

// Kullanıcı bilgilerini güncelle
export const updateUser = async (req: Request, res: Response) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select('-password');

    if (!updated) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Güncellenemedi', error: err });
  }
};

// Kullanıcı sil (isteğe bağlı)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Kullanıcı silindi' });
  } catch (err) {
    res.status(500).json({ message: 'Silinemedi', error: err });
  }
};

// Favori ürünleri getir
export const getWishlist = async (req: Request, res: Response) => {
            console.log("user");

  const user = await User.findById(req.params.id).populate('wishlist');
  if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
  res.json(user.wishlist);
};

// Favori ürün ekle/çıkar (toggle)
export const toggleWishlist = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    
    const productId = req.params.productId;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Geçersiz ürün ID' });
    }

    const productObjectId = new mongoose.Types.ObjectId(productId);

    const index = user.wishlist.findIndex((id) => id.equals(productObjectId));

    if (index > -1) {
      user.wishlist.splice(index, 1); // kaldır
    } else {
      user.wishlist.push(productObjectId); // ekle
    }

    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    console.error('Wishlist güncelleme hatası:', err);
    res.status(500).json({ message: 'Bir hata oluştu' });
  }
};
