import express from 'express';
import Product from '../models/product';
//import { isAdmin } from '../middlewares/auth'; // varsa admin kontrolü

const router = express.Router();

// ✅ GET /api/products?category=&minPrice=&maxPrice=&featured=
router.get('/', async (req, res) => {
  const { category, minPrice, maxPrice, featured } = req.query;

  let query: any = {};
  if (category) query.category = category;
  if (featured) query.featured = featured === 'true';
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  try {
    const products = await Product.find(query).populate('category');
    res.json(products);
  } catch (err) {
    console.error('GET /products error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('GET /products/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ POST /api/products (admin)
router.post('/', /* isAdmin, */ async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('POST /products error:', err);
    res.status(400).json({ message: 'Invalid data' });
  }
});

// ✅ PUT /api/products/:id (admin)
router.put('/:id', /* isAdmin, */ async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    console.error('PUT /products/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ DELETE /api/products/:id (admin)
router.delete('/:id', /* isAdmin, */ async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('DELETE /products/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
