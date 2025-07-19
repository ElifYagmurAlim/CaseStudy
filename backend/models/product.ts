import mongoose, { Document, Schema } from 'mongoose';
import '../models/category';
import '../models/review';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: mongoose.Types.ObjectId;
  stock: number;
  images: string[];
  tags: string[];
  featured: boolean;
  sold: number;
  specs: { [key: string]: string };
  variants: {
    size?: string;
    color?: string;
  }[];
  views: number;
  review: mongoose.Types.ObjectId;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    stock: { type: Number, default: 0 },
    images: [String],
    tags: [String],
    featured: { type: Boolean, default: false },
    sold: { type: Number, default: 0 },
    specs: { type: Map, of: String },
    variants: [
      {
        size: String,
        color: String,
      },
    ],
    views: { type: Number, default: 0 },
    review:{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', productSchema);
