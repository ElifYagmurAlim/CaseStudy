'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/axios';
import { useParams, useRouter } from 'next/navigation';

const schema = z.object({
  name: z.string().min(1),
  price: z.preprocess((val) => Number(val), z.number().min(0)),
  category: z.string().min(1),
  featured: z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Kategorileri çek
  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  // Ürün verisini çekip formu doldur
  useEffect(() => {
    api.get(`/products/${id}`).then((res) => {
      const product = res.data;
      reset({
        name: product.name,
        price: product.price,
        category: product.category, // kategori ID'si geliyor
        featured: product.featured,
      });
    });
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    await api.patch(`/products/${id}`, data);
    alert('Ürün güncellendi');
    router.push('/admin/products');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Ürün Güncelle</h1>

      <div>
        <label>Ad</label>
        <input {...register('name')} className="input" />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div>
        <label>Fiyat</label>
        <input type="number" {...register('price')} className="input" />
        {errors.price && <p>{errors.price.message}</p>}
      </div>

      <div>
        <label>Kategori</label>
        <select {...register('category')} className="input">
          <option value="">Kategori Seçin</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category && <p>{errors.category.message}</p>}
      </div>

      <div>
        <label>
          <input type="checkbox" {...register('featured')} className="mr-2" />
          Öne Çıkar
        </label>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Güncelle
      </button>
    </form>
  );
}
