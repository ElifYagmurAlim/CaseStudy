import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'admin' | 'customer';
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: {
    street: string;
    city: string;
    postalCode: string;
  }[];
  wishlist: mongoose.Types.ObjectId[];
  favorites: mongoose.Types.ObjectId[];
  isVerified: boolean;
  verificationToken: string;
  recentViews: mongoose.Types.ObjectId[];
  emailVerified: boolean;
  emailVerificationToken: {
    type: string;
  };
  cart: {
    product: mongoose.Types.ObjectId;
    quantity: number;
  }[];
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  firstName: String,
  lastName: String,
  phone: String,
  addresses: [
    {
      street: String,
      city: String,
      postalCode: String,
    },
  ],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  recentViews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: {
    type: String,
  },
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

export default mongoose.model<IUser>('User', userSchema);
