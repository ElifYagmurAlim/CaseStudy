'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useEffect, useState } from 'react';

type FormValues = {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  featured: boolean;
};

export default function CreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [images, setImages] = useState<FileList | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);
  const [variants, setVariants] = useState<{ size?: string; color?: string }[]>([]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data));
  }, []);

  const addSpec = () => setSpecs([...specs, { key: '', value: '' }]);
  const updateSpec = (i: number, field: 'key' | 'value', value: string) => {
    const updated = [...specs];
    updated[i][field] = value;
    setSpecs(updated);
  };
  const removeSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i));

  const addVariant = () => setVariants([...variants, { size: '', color: '' }]);
  const updateVariant = (i: number, field: 'size' | 'color', value: string) => {
    const updated = [...variants];
    updated[i][field] = value;
    setVariants(updated);
  };
  const removeVariant = (i: number) => setVariants(variants.filter((_, idx) => idx !== i));

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };
  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag));

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => formData.append(key, String(val)));
    formData.append('tags', JSON.stringify(tags));
    formData.append('specs', JSON.stringify(Object.fromEntries(specs.map(s => [s.key, s.value]))));
    formData.append('variants', JSON.stringify(variants));

    if (images) {
      Array.from(images).forEach(file => formData.append('images', file));
    }

    try {
      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Product created!');
      router.push('/admin/products');
    } catch (err) {
      console.error('Create failed:', err);
      alert('Error while creating product.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create Product</h1>

      <input {...register('name', { required: true })} placeholder="Name" className="input w-full" />
      <textarea {...register('description', { required: true })} placeholder="Description" className="input w-full" />
      <input type="number" {...register('price', { required: true })} placeholder="Price" className="input w-full" />
      <input type="number" {...register('stock', { required: true })} placeholder="Stock" className="input w-full" />
      <select {...register('category', { required: true })} className="input w-full">
        <option value="">Select Category</option>
        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>
      <label className="flex items-center gap-2">
        <input type="checkbox" {...register('featured')} /> Featured
      </label>

      {/* Images */}
      <div>
        <label>Images</label>
        <input type="file" accept="image/*" multiple onChange={e => setImages(e.target.files)} />
      </div>

      {/* Tags */}
      <div>
        <label>Tags</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add tag"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = '';
              }
            }}
            className="input w-full"
          />
        </div>
        <div className="flex gap-2 flex-wrap mt-2">
          {tags.map((tag, i) => (
            <span key={i} className="bg-gray-200 px-2 py-1 rounded text-sm">
              {tag}
              <button onClick={() => removeTag(tag)} className="ml-1 text-red-500">×</button>
            </span>
          ))}
        </div>
      </div>

      {/* Specs */}
      <div>
        <label>Specifications</label>
        {specs.map((s, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              value={s.key}
              placeholder="Key"
              onChange={(e) => updateSpec(i, 'key', e.target.value)}
              className="input w-1/2"
            />
            <input
              type="text"
              value={s.value}
              placeholder="Value"
              onChange={(e) => updateSpec(i, 'value', e.target.value)}
              className="input w-1/2"
            />
            <button type="button" onClick={() => removeSpec(i)} className="text-red-500">×</button>
          </div>
        ))}
        <button type="button" onClick={addSpec} className="text-blue-500 text-sm">+ Add Spec</button>
      </div>

      {/* Variants */}
      <div>
        <label>Variants</label>
        {variants.map((v, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              value={v.size}
              placeholder="Size"
              onChange={(e) => updateVariant(i, 'size', e.target.value)}
              className="input w-1/2"
            />
            <input
              type="text"
              value={v.color}
              placeholder="Color"
              onChange={(e) => updateVariant(i, 'color', e.target.value)}
              className="input w-1/2"
            />
            <button type="button" onClick={() => removeVariant(i)} className="text-red-500">×</button>
          </div>
        ))}
        <button type="button" onClick={addVariant} className="text-blue-500 text-sm">+ Add Variant</button>
      </div>

      <button type="submit" className="btn bg-blue-600 text-white px-4 py-2 rounded">Create Product</button>
    </form>
  );
}
