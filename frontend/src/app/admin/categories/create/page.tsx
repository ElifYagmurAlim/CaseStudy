'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  const [file, setFile] = useState<File | null>(null);

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value, type } = e.target;
    
    setForm({
        ...form,
        [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value,
    });
    };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return alert('Lütfen bir görsel seçin.');

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('isActive', String(form.isActive));
    formData.append('image', file);

    try {
      await axios.post('http://localhost:5000/api/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Kategori oluşturuldu');
      router.push('/admin/categories');
    } catch (err) {
      console.error('Kategori oluşturma hatası:', err);
      alert('Bir hata oluştu.');
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Yeni Kategori Oluştur</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Kategori Adı"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Açıklama"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          Aktif mi?
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Kaydet
        </button>
      </form>
    </main>
  );
}
