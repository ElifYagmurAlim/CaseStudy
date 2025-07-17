'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

// ✅ Schema
const schema = z.object({
  name: z.string().min(1, 'Ürün adı gerekli'),
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Fiyat zorunludur')
    ),
  category: z.string().min(1, 'Kategori gerekli'),
  featured: z.boolean().default(false),
});

// ✅ Inferred form data (doğru yerde kullanılıyor)
type FormData = z.infer<typeof schema>;

export default function CreateProductPage() {
  const router = useRouter();

  // ❌ <FormData> verme — zaten resolverdan geliyor!
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      price: 0,
      category: '',
      featured: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/products', data);
      alert('Ürün eklendi!');
      router.push('/admin/products');
    } catch (err) {
      console.error('Ürün ekleme hatası:', err);
      alert('Bir hata oluştu.');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Yeni Ürün Ekle</h1>
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
          <input {...register('category')} className="input" />
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
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={isSubmitting}
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}
