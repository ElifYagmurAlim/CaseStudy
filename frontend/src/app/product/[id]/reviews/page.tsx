'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Star } from 'lucide-react';

interface Review {
  comment: string;
  rating: number;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

interface Product {
  _id: string;
  name: string;
  reviews: Review[];
}

export default function ProductReviewsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Yorumlar yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="p-4">Yorumlar yükleniyor...</p>;
  if (!product) return <p className="p-4">Ürün bulunamadı.</p>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">
        {product.name} - Tüm Yorumlar
      </h1>

      {product.reviews?.length ? (
        <ul className="space-y-4">
          {product.reviews.map((r, idx) => (
            <li key={idx} className="border p-4 rounded bg-white shadow">
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold">
                  {r.user?.firstName} {r.user?.lastName}
                </p>
                <div className="flex gap-1">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star 
                    key={i} 
                    size={16} 
                    className="text-yellow-500" 
                    color='#facc15' 
                    fill='#facc15'                    
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600">{r.comment}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Bu ürün için henüz yorum yapılmamış.</p>
      )}

      <div className="mt-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline"
        >
          ← Ürün sayfasına geri dön
        </button>
      </div>
    </main>
  );
}
