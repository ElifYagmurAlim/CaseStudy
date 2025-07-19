'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
    const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

useEffect(() => {
  const fetchData = async () => {
    try {
      const catRes = await api.get('/categories');
      setCategories(catRes.data);

      let url = '/products';
      if (selectedCategory) {
        url += `?category=${selectedCategory}`;
      }

      const prodRes = await api.get(url);
      setProducts(prodRes.data);
    } catch (err) {
      console.error('Ürünler veya kategoriler alınamadı:', err);
    }
  };

  fetchData();
}, [selectedCategory]);


  const filteredProducts = products
    .filter(p => {
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priceLow') return a.price - b.price;
      if (sortBy === 'priceHigh') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime(); // newest
    });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tüm Ürünler</h1>

      {/* 🔍 Arama ve Filtreler */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Ürün ara..."
          className="border px-3 py-2 rounded flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full border p-2 rounded">
              <option value="">Tüm Kategoriler</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
                      <div>
              <label>Fiyat Aralığı</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full border p-1 rounded" />
                <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full border p-1 rounded" />
              </div>
            </div>
        <select
          className="border px-3 py-2 rounded"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">En Yeni</option>
          <option value="priceLow">Fiyat: Artan</option>
          <option value="priceHigh">Fiyat: Azalan</option>
          <option value="rating">Puan: Yüksekten Düşüğe</option>
        </select>
      </div>

      {/* 📦 Ürünler */}
      {filteredProducts.length === 0 ? (
        <p>Aramaya uygun ürün bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}
