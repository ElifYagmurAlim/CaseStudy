import { Request, Response } from 'express';
import Product from '../models/product';
import mongoose from 'mongoose';

// @desc    Tüm ürünleri getir
// controllers/productController.ts
export const getAllProducts = async (req: Request, res: Response) => {
  const categoryId = req.query.category;

  try {
const filter = categoryId ? { category: new mongoose.Types.ObjectId(categoryId as string) } : {};
const products = await Product.find(filter).populate('review.user');
    res.json(products);
  } catch (err) {
    console.error('GET /products error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

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

// @desc    ID ile ürün getir
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
  .populate('review.user'); // ✅ Artık hata vermez
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('GET /api/products/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Yeni ürün oluştur
export const createProduct = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const images = req.files
          ? Array.isArray(req.files)
            ? req.files.map((file: any) => file.filename)
            : []
          : [];
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
    
    // 👇 JSON.parse burada zorunlu (FormData ile string gelir)
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

// @desc    Ürünü güncelle
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

// @desc    Ürünü sil
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
