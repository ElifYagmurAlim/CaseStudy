import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  approved: boolean;
}

const reviewSchema = new Schema<IReview>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
    approved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default (mongoose.models.Review as Model<IReview>) 
  || mongoose.model<IReview>('Review', reviewSchema);
