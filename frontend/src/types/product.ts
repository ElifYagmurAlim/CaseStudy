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
    };
    rating: number;
    comment: string;
    approved?: boolean;
  }[];
  updatedAt?: string;
  active: boolean;
}

export interface Variant {
  size?: string;
  color?: string;
}

export interface Review {
  user: {
    _id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
  };
  rating: number;
  comment: string;
  approved?: boolean;
}