'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProductById, updateProduct, bulkUpdateProductStatus  } from '@/api/productService';
import { getCategories } from '@/api/categoryService';
import { Category } from '@/types/category';
import { Variant } from '@/types/product';

interface ProductForm {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string; // sadece _id
  featured: boolean;
  tags: string[];
  specs: Record<string, string>;
  variants: Variant[];
  images: string[];
}

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    featured: false,
    tags: [],
    specs: {},
    variants: [],
    images: [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [variant, setVariant] = useState<Variant>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [product, categoryList] = await Promise.all([
          getProductById(id as string),
          getCategories(),
        ]);

        setCategories(categoryList);

        setForm({
          name: product.name || '',
          description: product.description || '',
          price: product.price || 0,
          stock: product.stock || 0,
          category: typeof product.category === 'string' ? product.category : product.category?._id || '',
          featured: product.featured || false,
          tags: Array.isArray(product.tags) ? product.tags : [],
          specs: product.specs || {},
          variants: product.variants || [],
          images: product.images || [],
        });
      } catch (err) {
        console.error('Veri alınırken hata:', err);
      }
    };

    fetchData();
  }, [id]);
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

  const handleSpecAdd = () => {
    if (specKey && specValue) {
      setForm((prev) => ({
        ...prev,
        specs: { ...prev.specs, [specKey]: specValue },
      }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  const handleVariantAdd = () => {
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
    try {
      const selectedCategory = categories.find(cat => cat._id === form.category);

      
      await updateProduct(id as string, {
        ...form,
        category: selectedCategory ?? { _id: form.category, name: '' }, // fallback eklendi
        tags: form.tags.map((t) => t.trim()),
      });

      router.push('/admin/products');
    } catch (err) {
      console.error('Güncelleme hatası:', err);
    } finally {
      setLoading(false);
    }
  };
console.log(form);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Ürün Düzenle</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input name="name" placeholder="Ürün Adı" value={form.name} onChange={handleChange} className="input" />

        <textarea name="description" placeholder="Açıklama" value={form.description} rows={3} onChange={handleChange} className="input" />

        <div className="grid grid-cols-2 gap-4">
          <input name="price" type="number" placeholder="Fiyat (₺)" value={form.price} onChange={handleChange} className="input" />
          <input name="stock" type="number" placeholder="Stok" value={form.stock} onChange={handleChange} className="input" />
        </div>
       
        <select name="category" value={form.category} onChange={handleChange} className="input">
          <option value="">Kategori Seç</option>
          {categories.map((cat) => (
            <option key={cat._id} value={String(cat._id)}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          name="tags"
          placeholder="Etiketler (virgülle)"
          value={form.tags.join(', ')}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
            }))
          }
          className="input"
        />

        <div className="flex gap-2 items-center">
          <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
          <label>Öne Çıkan</label>
        </div>

        {/* Teknik Özellikler */}
        <div>
          <label>Teknik Özellikler</label>
          <div className="flex gap-2 mb-2">
            <input placeholder="Anahtar" value={specKey} onChange={(e) => setSpecKey(e.target.value)} className="input" />
            <input placeholder="Değer" value={specValue} onChange={(e) => setSpecValue(e.target.value)} className="input" />
            <button type="button" className="btn" onClick={handleSpecAdd}>Ekle</button>
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
            <button type="button" className="btn" onClick={handleVariantAdd}>Ekle</button>
          </div>
          <ul className="text-sm text-gray-600">
            {form.variants.map((v, i) => (
              <li key={i}>🧩 {v.size} {v.color}</li>
            ))}
          </ul>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Güncelleniyor...' : 'Ürünü Güncelle'}
        </button>
      </form>
    </div>
  );
}
