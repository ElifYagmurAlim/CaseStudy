'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/axios';

const schema = z.object({
  name: z.string().min(1, 'Ürün adı gerekli'),
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Fiyat zorunludur')
  ),
  category: z.string().min(1, 'Kategori gerekli'),
  featured: z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    } = useForm({
    resolver: zodResolver(schema),
    });

  // Ürün bilgisi ve kategoriler
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          api.get(`/products/${productId}`),
          api.get('/categories'),
        ]);

        const product = productRes.data;
        setValue('name', product.name);
        setValue('price', product.price);
        setValue('category', product.category?._id || '');
        setValue('featured', product.featured);
        setCategories(categoryRes.data);
      } catch (err) {
        console.error('Veri alınamadı:', err);
      }
    };

    fetchData();
  }, [productId, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      await api.put(`/products/${productId}`, data);
      alert('Ürün güncellendi');
      router.push('/admin/products');
    } catch (err) {
      console.error('Güncelleme hatası:', err);
      alert('Bir hata oluştu.');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ürünü Düzenle</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Ürün Adı</label>
          <input {...register('name')} className="input" />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label>Fiyat</label>
          <input type="number" {...register('price')} className="input" />
          {errors.price && <p className="text-red-500">{errors.price.message}</p>}
        </div>

        <div>
          <label>Kategori</label>
          <select {...register('category')} className="input">
            <option value="">Seçiniz</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500">{errors.category.message}</p>}
        </div>

        <div>
          <label>
            <input type="checkbox" {...register('featured')} className="mr-2" />
            Öne Çıkar
          </label>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={isSubmitting}
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}
