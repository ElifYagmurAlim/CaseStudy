import mongoose, { Document, Schema , Model } from 'mongoose';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    qty: number;
    price: number;
  }[];
  paymentMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    paymentMethod: { type: String, required: true }, // e.g., 'card', 'cash'
    shippingAddress: {
      street: String,
      city: String,
      postalCode: String,
    },
    status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered'], default: 'pending' },
  },
  { timestamps: true }
);

export default (mongoose.models.Order as Model<IOrder>) 
    || mongoose.model<IOrder>('Order', orderSchema);

