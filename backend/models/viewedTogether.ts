import mongoose, { Document, Schema } from 'mongoose';

export interface IViewedTogether extends Document {
  productId: mongoose.Types.ObjectId[];
  viewedWith: mongoose.Types.ObjectId[];
}

const viewedTogetherSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  viewedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

export default mongoose.model<IViewedTogether>('ViewedTogether', viewedTogetherSchema);
