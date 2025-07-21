import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Modelleri import et
import User from './models/user';
import Product from './models/product';
import Category from './models/category';
import Order from './models/order';
import Review from './models/review';
import ViewedTogether from './models/viewedTogether';

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
    const admin = await User.create({
    email: 'elifalim1506@gmail.com',
    password: '$2b$10$u9zMqSDe/X3FoNWqlLxgfe07WjqviL9AsT2UTuESCnEvI4WVPIVo2',
    role: 'admin',
    firstName: 'Elif',
    lastName: 'Alim',
    wishlist: [],
    favorites: [],
    isVerified: true,
    recentViews: [],
    emailVerified: false,
    addresses: [],
    __v: 0
  });
      const user = await User.create({
    email: 'elifyagmuralim@gmail.com',
    password: '$2b$10$Nfopv1j1H9mGyMaqzgzDI.bEytTzl6u3RUzTKT0tzQIL5mf0rTxr6',
    role: 'customer',
    firstName: 'Yağmura',
    lastName: 'Alim',
    wishlist: [],
    favorites: [],
    isVerified: true,
    recentViews: [],
    emailVerified: false,
    addresses: [
      {
        street: 'sisli',
        city: 'istanbul',
        postalCode: '43454',
      }
    ],
    __v: 6,
    phone: '5308449744',
    cart: []
  });
    // Kategori ekle
    const category = await Category.create({
    name: 'Food',
    description: 'Foods',
    image: '1753020505447-images.jpg',
    isActive: true,
    __v: 0
  });

    // Ürün ekle
    const product = await Product.create({
    name: 'Pasta',
    description: 'flavored',
    price: 50,
    category: '687cf8592d6c9472d9ef6fca',
    stock: 2000,
    images: [ '1753076079552-pasta.jpg' ],
    tags: [ 'food' ],
    featured: false,
    sold: 0,
    specs: { Color: 'Blue' },
    variants: [
      {
        size: 'Size',
        color: 'Standart',
      },
      {
        size: 'Color',
        color: 'Blue',
      }
    ],
    views: 0,
    reviews: [],
    active: true,
    __v: 0
  });


    console.log('Seed verileri başarıyla eklendi.');
  } catch (error) {
    console.error('Seed sırasında hata oluştu:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB bağlantısı kapatıldı.');
  }
}

seed();
