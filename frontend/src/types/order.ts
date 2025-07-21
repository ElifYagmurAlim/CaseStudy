import { User } from '../types/user'
export interface OrderItem {
  qty: number;
  price: number;
  product: {
    name: string;
    price: number;
  } | null;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
  user: User;
  paymentMethod: string;
  shippingAddress: {
    fullName?: string;
    street?: string;
    city?: string;
    postalCode?: string;
    phone?: string;
  };
}

export interface CreateOrderPayload {
  user: string | null;
  items: {
    product: string;
    qty: number;
    price: number;
  }[];
  shippingAddress: {
    fullName?: string;
    street: string;
    city: string;
    postalCode: string;
    phone?: string;
  };
  paymentMethod: string;
}