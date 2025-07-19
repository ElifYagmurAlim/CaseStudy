'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Product } from '@/types/types';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await api.get<Product[]>(`/users/${user._id}/wishlist`);
        setProducts(res.data);
      } catch (err) {
        console.error('Wishlist alınırken hata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  const removeFromWishlist = async (productId: string) => {
    try {
      await api.delete(`/users/wishlist/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error('Wishlist’ten silinemedi:', err);
    }
  };

  if (loading) return <p className="p-6">Yükleniyor...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Favorilerim</h1>
      {products.length === 0 ? (
        <p>Favori ürününüz bulunmamaktadır.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product._id} className="relative">
              <ProductCard {...product} />
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
