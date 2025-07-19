import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

//Routes
import authRoutes from './routes/auth';
import productRoutes from './routes/product';
import categoryRoutes from './routes/category';
import orderRoutes from './routes/order';
import reviewRoutes from './routes/review';
import userRoutes from './routes/user';
import adminRoutes from './routes/admin';

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

try {
  mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');
} catch (error) {
  console.error('MongoDB connection error:', error);
  process.exit(1);
}

app.get('/api/health', (req, res) => {
  res.json({ message: 'API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use(cors({
  origin: 'http://localhost:3000', // Next.js frontend
  credentials: false // eğer cookie gönderiyorsan true yaparsın
}));