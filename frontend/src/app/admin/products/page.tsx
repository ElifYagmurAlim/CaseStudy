'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

interface Product {
  _id: string;
  name: string;
  price: number;
  category?: { name: string };
  featured: boolean;
}

export default function AdminProductsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'admin') {
      router.push('/');
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Ürünler alınamadı:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Silme hatası:', err);
    }
  };

  if (loading) return <p className="p-4">Yükleniyor...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Ürün Yönetimi</h1>
        <button
          onClick={() => router.push('/admin/products/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Yeni Ürün Ekle
        </button>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{product.name}</p>
              <p>{product.price.toFixed(2)} ₺</p>
              <p className="text-sm text-gray-600">
                Kategori: {product.category?.name || 'Yok'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/admin/products/edit/${product._id}`)}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
