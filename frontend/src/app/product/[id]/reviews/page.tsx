'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProductById } from '@/api/productService';
import { Star } from 'lucide-react';
import { Product } from '@/types/product';

export default function ProductReviewsPage() {
const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const id = typeof params.id === 'string' ? params.id : params.id?.[0] ?? '';

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
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
                  {r.user?.name}
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