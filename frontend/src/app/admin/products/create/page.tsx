'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

interface Category {
  _id: string;
  name: string;
}

interface Variant {
  size?: string;
  color?: string;
}

export default function CreateProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    featured: false,
    images: [] as File[],
    tags: '',
    specs: {} as Record<string, string>,
    variants: [] as Variant[],
  });

  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [variant, setVariant] = useState<Variant>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const input = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? input.checked : value,
    }));
  };

const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const filesArray = Array.from(e.target.files); // artık güvenli
    setForm((prev) => ({ ...prev, images: filesArray }));
  }
};

  const addSpec = () => {
    if (specKey && specValue) {
      setForm((prev) => ({
        ...prev,
        specs: { ...prev.specs, [specKey]: specValue },
      }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  const addVariant = () => {
    if (variant.size || variant.color) {
      setForm((prev) => ({
        ...prev,
        variants: [...prev.variants, variant],
      }));
      setVariant({});
    }
  };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === 'images') {
          (value as File[]).forEach((file) => formData.append('images', file));
        } else if (key === 'specs' || key === 'variants') {
          formData.append(key, JSON.stringify(value));
        } else if (key === 'tags') {
          // string "yeni,kış,unisex" → ["yeni", "kış", "unisex"]
          const tagsArray = (value as string).split(',').map(tag => tag.trim());
          formData.append('tags', JSON.stringify(tagsArray));
        } else {
          formData.append(key, value as string);
        }
      });

      try {
        await api.post('/products', formData);
        router.push('/admin/products');
      } catch (err) {
        console.error('Ürün eklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    };


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Yeni Ürün Oluştur</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label>Ürün Adı</label>
          <input name="name" className="input" value={form.name} onChange={handleChange} required />
        </div>

        <div>
          <label>Açıklama</label>
          <textarea name="description" className="input" rows={3} value={form.description} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input name="price" type="number" placeholder="Fiyat (₺)" className="input" value={form.price} onChange={handleChange} required />
          <input name="stock" type="number" placeholder="Stok" className="input" value={form.stock} onChange={handleChange} required />
        </div>

        <div>
          <label>Kategori</label>
          <select name="category" className="input" value={form.category} onChange={handleChange} required>
            <option value="">Kategori Seçin</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Etiketler (virgülle)</label>
          <input name="tags" className="input" value={form.tags} onChange={handleChange} placeholder="Örn: yaz, indirim, yeni" />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
          <span>Öne Çıkan Ürün</span>
        </div>

        <div>
          <label>Görseller</label>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
        </div>

        {/* Teknik Özellikler */}
        <div>
          <label>Teknik Özellikler</label>
          <div className="flex gap-2 mb-2">
            <input placeholder="Özellik" value={specKey} onChange={(e) => setSpecKey(e.target.value)} className="input" />
            <input placeholder="Değer" value={specValue} onChange={(e) => setSpecValue(e.target.value)} className="input" />
            <button type="button" onClick={addSpec} className="btn">Ekle</button>
          </div>
          <ul className="text-sm text-gray-600">
            {Object.entries(form.specs).map(([key, val]) => (
              <li key={key}>🔹 {key}: {val}</li>
            ))}
          </ul>
        </div>

        {/* Varyantlar */}
        <div>
          <label>Varyantlar</label>
          <div className="flex gap-2 mb-2">
            <input placeholder="Beden" value={variant.size || ''} onChange={(e) => setVariant((v) => ({ ...v, size: e.target.value }))} className="input" />
            <input placeholder="Renk" value={variant.color || ''} onChange={(e) => setVariant((v) => ({ ...v, color: e.target.value }))} className="input" />
            <button type="button" onClick={addVariant} className="btn">Ekle</button>
          </div>
          <ul className="text-sm text-gray-600">
            {form.variants.map((v, i) => (
              <li key={i}>🧩 {v.size} {v.color}</li>
            ))}
          </ul>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Kaydediliyor...' : 'Ürünü Oluştur'}
        </button>
      </form>
    </div>
  );
}
