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
  verificationToken: String,
  recentViews: mongoose.Types.ObjectId[];
  emailVerified: boolean,
  emailVerificationToken: {
    type: String,
  },
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true , select: false},
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String },
    addresses: [
      {
        street: String,
        city: String,
        postalCode: String,
      },
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    recentViews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
  },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);
