'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Kategoriler alınamadı:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (err) {
      console.error('Silme hatası:', err);
    }
  };

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kategori Yönetimi</h1>
        <button
          onClick={() => router.push('/admin/categories/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Yeni Kategori Ekle
        </button>
      </div>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : categories.length === 0 ? (
        <p>Henüz kategori yok.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat._id} className="border rounded p-4 flex gap-4 items-center">
              <div className="w-16 h-16 relative">
                <Image
                  src={`http://localhost:5000/uploads/${cat.image}`}
                  alt={cat.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{cat.name}</p>
                <p className="text-sm text-gray-600">{cat.description}</p>
                <p className="text-sm text-gray-500">
                  Durum: {cat.isActive ? 'Aktif' : 'Pasif'}
                </p>
                
              </div>
              <Link href={`/admin/categories/${cat._id}/edit`} className="text-blue-600 underline ml-2">
  Düzenle
</Link>
              <button
                onClick={() => handleDelete(cat._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
