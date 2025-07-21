import mongoose, { Document, Schema, Model } from 'mongoose';
import { OrderStatus, OrderStatusType } from '../constants/orderStatus';

export interface IOrder extends Document {
  user?: mongoose.Types.ObjectId; // Misafir siparişleri için optional
  items: {
    product: mongoose.Types.ObjectId;
    qty: number;
    price: number;
  }[];
  totalPrice: number;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  status: OrderStatusType;
  createdAt: Date;
  updatedAt: Date;

}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true }, // 💡 BU SATIRI EKLE
    paymentMethod: { type: String, default: 'cash' },
    shippingAddress: {
      fullName: String,
      street: String,
      city: String,
      postalCode: String,
      phone: String
    },
    status: { 
      type: String, 
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING },
  },
  { timestamps: true }
);

export default (mongoose.models.Order as Model<IOrder>) ||
  mongoose.model<IOrder>('Order', orderSchema);
