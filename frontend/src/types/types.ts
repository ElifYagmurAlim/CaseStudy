// types.ts
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {
    _id: string;
    name: string;
  };
  stock: number;
  images: string[]; // cloudinary veya uploads yolu
  tags: string[];
  featured: boolean;
  sold: number;
  specs: {
    [key: string]: string;
  };
  variants: {
    size?: string;
    color?: string;
  }[];
  views: number;
  createdAt?: string;
  rating?: number;
  reviews: {
    user: {
      _id: string;
      name: string;
    } | string;
    rating: number;
    comment: string;
    approved?: boolean;
  }[];
  updatedAt?: string;
}

export interface OrderItem {
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  shippingAddress: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
}

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
};

export interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  isActive?: boolean;
}