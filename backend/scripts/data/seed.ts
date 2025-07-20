// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import Product from '../models/product';

// import categories from './data/categories.json';

// dotenv.config();

// const runSeed = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI!);
//     await Product.deleteMany();
//     await Category.deleteMany();

//     const insertedCategories = await Category.insertMany(categories);
//     const categoryMap = insertedCategories.reduce((acc, cat) => {
//       acc[cat.name] = cat._id;
//       return acc;
//     }, {} as Record<string, mongoose.Types.ObjectId>);

//     const adjustedProducts = products.map(p => ({
//       ...p,
//       category: categoryMap[p.categoryName], // products.json'da categoryName alanı olmalı
//     }));

//     await Product.insertMany(adjustedProducts);
//     console.log('✅ Seed başarılı!');
//     process.exit(0);
//   } catch (err) {
//     console.error('❌ Seed hatası:', err);
//     process.exit(1);
//   }
// };

// runSeed();
