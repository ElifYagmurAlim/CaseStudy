'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { getAllProducts, deleteProduct, bulkUpdateProductStatus } from '@/api/productService';
import { Product } from '@/types/product';


export default function AdminProductsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res);
    } catch (err) {
      console.error('Ürünler alınamadı:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Silme hatası:', err);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const updateStatus = async (status: boolean) => {
    try {
      await bulkUpdateProductStatus(selectedIds, status);
      fetchProducts();
      setSelectedIds([]);
    } catch (err) {
      console.error('Toplu işlem hatası:', err);
    }
  };

  if (loading) return <p className="p-4">Yükleniyor...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ürün Yönetimi</h1>
        <button
          onClick={() => router.push('/admin/products/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Yeni Ürün Ekle
        </button>
      </div>

      {selectedIds.length > 0 && (
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => updateStatus(true)}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Seçilenleri Aktif Et
          </button>
          <button
            onClick={() => updateStatus(false)}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Seçilenleri Pasif Et
          </button>
        </div>
      )}

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={selectedIds.includes(product._id)}
                onChange={() => toggleSelect(product._id)}
              />
              <div>
                <p className="font-semibold">{product.name}</p>
                <p>{product.price.toFixed(2)} ₺</p>
                <p className="text-sm text-gray-600">
                  Kategori: {product.category?.name || 'Yok'}
                </p>
                <p className="text-sm mt-1">
                  Durum:{' '}
                  <span
                    className={`font-semibold ${
                      product.active ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {product.active ? 'Aktif' : 'Pasif'}
                  </span>
                </p>
              </div>
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
