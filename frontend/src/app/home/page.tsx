'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProductCard from '@/components/productCard';

type Product = {
  _id: string;
  name: string;
  price: number;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Ürünler alınamadı', err));
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Ürünler</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard key={product._id} {...product} />
        ))}
      </div>
    </main>
  );
}
