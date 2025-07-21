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
