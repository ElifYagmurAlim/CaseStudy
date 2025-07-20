import { Request, Response } from 'express';
import Product from '../models/product';
import ViewedTogether from '../models/viewedTogether';
import mongoose from 'mongoose';
import Order from '../models/order'; 

// Tüm ürünleri getir
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const categoryId = req.query.category;
    const filter = categoryId ? { category: new mongoose.Types.ObjectId(categoryId as string) } : {};
    const products = await Product.find(filter).populate('review.user');
    res.json(products);
  } catch (err) {
    console.error('GET /products error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Related Products
export const getRelatedProducts = async (req: Request, res: Response) => {
  try {
    const current = await Product.findById(req.params.id);
    if (!current) return res.status(404).json({ message: 'Ürün bulunamadı' });

    const related = await Product.find({
      category: current.category,
      _id: { $ne: req.params.id },
    }).limit(4);

    res.json(related);
  } catch (err) {
    console.error('Related ürün hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// ID ile ürün getir
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate('review.user');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('GET /api/products/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Yeni ürün oluştur
export const createProduct = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const images = Array.isArray(files) ? files.map(file => file.filename) : [];

    const {
      name,
      description,
      price,
      category,
      stock,
      tags,
      featured,
      specs,
      variants,
    } = req.body;

    const parsedTags = tags ? JSON.parse(tags) : [];
    const parsedSpecs = specs ? JSON.parse(specs) : {};
    const parsedVariants = variants ? JSON.parse(variants) : [];

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      tags: parsedTags,
      featured: featured === 'true' || featured === true,
      specs: parsedSpecs,
      variants: parsedVariants,
      images,
      views: 0,
      sold: 0,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Ürün ekleme hatası:', error);
    res.status(500).json({ message: 'Ürün oluşturulamadı' });
  }
};

// Ürün güncelle
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('PATCH /api/products/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Ürünü sil
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('DELETE /api/products/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toplu güncelleme
export const bulkUpdateStatus = async (req: Request, res: Response) => {
  const { ids, status } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ message: 'ID listesi gerekli' });

  await Product.updateMany({ _id: { $in: ids } }, { active: status });
  res.json({ message: 'Ürünler güncellendi' });
};

// View sayacı artır
export const viewCounter = async (req: Request, res: Response) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'View sayısı güncellenemedi' });
  }
};

// Son görüntülenen ürünler
export const lastViews = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ _id: { $in: req.body.ids } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'lastViews güncellenemedi' });
  }
};

// Viewed-together verisini kaydet
export const updateViewedTogether = async (req: Request, res: Response) => {
  try {
    const { current, recent } = req.body;
    if (!current || !recent) return res.status(400).json({ message: 'Eksik veri' });

    let doc = await ViewedTogether.findOne({ productId: current });
    if (!doc) {
      doc = new ViewedTogether({ productId: current, viewedWith: [] });
    }

recent.forEach((id: string) => {
  const objectId = new mongoose.Types.ObjectId(id);
  if (!doc.viewedWith.some((existingId) => existingId.equals(objectId))) {
    doc.viewedWith.push(objectId);
  }
});

    await doc.save();
    res.json(doc);
  } catch (err) {
    console.error('ViewedTogether update error:', err);
    res.status(500).json({ message: 'İlişkili ürünler güncellenemedi' });
  }
};

// Belirli ürün için önerilen diğer ürünleri getir
export const getViewedTogether = async (req: Request, res: Response) => {
  try {
    const record = await ViewedTogether.findOne({ productId: req.params.id }).populate('viewedWith');
    res.json(record?.viewedWith || []);
  } catch (err) {
    res.status(500).json({ message: 'Önerilen ürünler alınamadı' });
  }
};

export const addReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { comment, rating } = req.body;
    const { productId } = req.params;

    // Kullanıcı bu ürünü tamamlanmış bir siparişte aldı mı?
    const order = await Order.findOne({
      user: userId,
      status: 'delivered', // sipariş durumu kontrolü
      'items.product': productId,
    });

    if (!order) {
      return res.status(403).json({
        message: 'Yorum yapmak için ürünü tamamlanmış bir siparişte satın almış olmanız gerekir.',
      });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });

    // Daha önce yorum yapmış mı?
    const hasReviewed = product.review.some((r: any) => r.user.toString() === userId.toString());
    if (hasReviewed) {
      return res.status(400).json({ message: 'Bu ürüne daha önce yorum yaptınız.' });
    }

    // Yorumu ekle
    product.review.push({
      comment,
      rating,
      user: userId,
    });

    await product.save();
    res.status(201).json({ message: 'Yorum eklendi', reviews: product.review });
  } catch (err) {
    console.error('Yorum ekleme hatası:', err);
    res.status(500).json({ message: 'Yorum eklenemedi' });
  }
};