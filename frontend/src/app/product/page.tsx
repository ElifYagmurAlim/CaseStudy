'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSpecs, setSelectedSpecs] = useState<{ [key: string]: string }>({});

  const searchParams = useSearchParams();

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, []);

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
    console.log(selectedCategory);

  const filteredProducts = products
    .filter(p => {
      if (onlyInStock && p.stock <= 0) return false;
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedSize && !p.variants.some(v => v.size === selectedSize)) return false;
      if (selectedColor && !p.variants.some(v => v.color === selectedColor)) return false;

      for (const [key, val] of Object.entries(selectedSpecs)) {
        if (val && p.specs?.[key]?.toLowerCase() !== val.toLowerCase()) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priceLow') return a.price - b.price;
      if (sortBy === 'priceHigh') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'newest') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      return 0;
    });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tüm Ürünler</h1>

      {/* 🔍 Arama ve Filtreler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Ürün ara..."
          className="border px-3 py-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="border p-2 rounded">
          <option value="">Tüm Kategoriler</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min ₺"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border p-1 rounded"
          />
          <input
            type="number"
            placeholder="Max ₺"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border p-1 rounded"
          />
        </div>

        <select
          className="border p-2 rounded"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">En Yeni</option>
          <option value="priceLow">Fiyat: Artan</option>
          <option value="priceHigh">Fiyat: Azalan</option>
          <option value="rating">Puan: Yüksekten Düşüğe</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={() => setOnlyInStock(prev => !prev)}
          />
          Stokta Olanlar
        </label>

        <input
          placeholder="Varyant Renk (örn: Red)"
          className="border p-1 rounded"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        />

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
