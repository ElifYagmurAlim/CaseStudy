import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  approved: boolean;
}

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ✅ referans belirtildi
    required: true
  },
  rating: { type: Number, required: true },
  comment: { type: String }
}, { timestamps: true });

export default (mongoose.models.Review as Model<IReview>) 
  || mongoose.model<IReview>('Review', reviewSchema);
