import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Modelleri import et
import User from './models/user';
import Product from './models/product';
import Category from './models/category';
import Order from './models/order';
import Review from './models/review';
import ViewedTogether from './models/viewedTogether';

import { userSeeds } from './data/users';
import { categorySeeds } from './data/categories';
import { productSeeds } from './data/products';

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mydb';

async function seed() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB bağlantısı başarılı.');

    // Mevcut verileri temizle
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
      Order.deleteMany({}),
      Review.deleteMany({}),
      ViewedTogether.deleteMany({})
    ]);
    console.log('🧹 Tüm koleksiyonlar temizlendi.');

    // Kullanıcı ekle
    await User.insertMany(userSeeds);
  
    // Kategori ekle
    await Category.insertMany(categorySeeds);

    // Ürün ekle
    await Product.insertMany(productSeeds);


    console.log('Seed verileri başarıyla eklendi.');
  } catch (error) {
    console.error('Seed sırasında hata oluştu:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB bağlantısı kapatıldı.');
  }
}

seed();
