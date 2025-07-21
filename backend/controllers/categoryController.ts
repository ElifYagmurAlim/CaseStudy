import { Request, Response } from 'express';
import Category from '../models/category';
import { toBoolean } from '../utils/parse';

// @desc    Tüm kategorileri getir
export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error('GET /api/categories error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Yeni kategori oluştur
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, isActive } = req.body;
    const image = req.file?.filename;

    if (!name || !description || !image) {
      return res.status(400).json({ message: 'Zorunlu alanlar eksik' });
    }

    const category = await Category.create({
      name,
      description,
      image, // sadece dosya adı kaydolacak
      isActive: toBoolean(isActive),
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Kategori oluşturulamadı:', error);
    res.status(500).json({ message: 'Kategori oluşturulamadı' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Kategori bulunamadı' });

    category.name = name || category.name;
    category.description = description || category.description;

    if (req.file) {
      category.image = req.file.filename;
    }

    await category.save();
    res.json(category);
  } catch (err) {
    console.error('Kategori güncellenemedi:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }
    res.json(category);
  } catch (err) {
    console.error('Kategori alınırken hata:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}

// @desc    Kategori sil
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error('DELETE /api/categories/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
