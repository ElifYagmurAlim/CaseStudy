'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsFiltered, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);

  const perPage = 8;

  useEffect(() => {
    try {
          const fetchData = async () => {
      const res = await api.get('/products');
      setProducts(res.data);
      const cats = await api.get('/categories');
      setCategories(cats.data);
            let url = '/products';
      if (selectedCategory) {
        url += `?category=${selectedCategory}`;
      }

      const prodRes = await api.get(url);
      setFilteredProducts(prodRes.data);
    };
    fetchData();
    } catch (err) {
      console.error('Ürünler veya kategoriler alınamadı:', err);
    }

  }, [selectedCategory]);

  const filteredProducts = productsFiltered
    .filter(p => {
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sort === 'newest') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt|| 0).getTime();
      return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime(); // newest
    });

  const paginatedProducts = filteredProducts.slice((page - 1) * perPage, page * perPage);

  const totalPages = Math.ceil(filteredProducts.length / perPage);

  const featured = products.filter(p => p.featured).slice(0, 4);
  const newArrivals = [...products].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt|| 0).getTime()).slice(0, 4);
  const popular = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4);

  return (
    <main>
      {/* ✅ Hero */}
      <section className="bg-blue-100 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Yeni Sezon Ürünleri Burada!</h1>
        <p className="text-lg text-gray-700">Yeni gelenleri, en çok satanları ve favori markaları keşfedin.</p>
        <Link href="/product">
          <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded">Hemen Keşfet</button>
        </Link>
      </section>

      {/* ✅ Arama ve Filtreler */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="col-span-1 space-y-4">
            <input
              type="text"
              placeholder="Ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border p-2 rounded"
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

            <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full border p-2 rounded">
              <option value="newest">En Yeni</option>
              <option value="price-asc">Fiyat: Artan</option>
              <option value="price-desc">Fiyat: Azalan</option>
              <option value="rating">Puan: Yüksek</option>
            </select>
          </div>

          {/* ✅ Ürün Listesi */}
          <div className="col-span-1 md:col-span-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedProducts.map(p => (
              <ProductCard key={p._id} {...p} />
            ))}
          </div>
        </div>

        {/* ✅ Pagination */}
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${page === i + 1 ? 'bg-blue-600 text-white' : ''}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </section>

      {/* ✅ Featured */}
      <section className="p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Öne Çıkan Ürünler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map(p => <ProductCard key={p._id} {...p} />)}
        </div>
      </section>

      {/* ✅ Kategoriler */}
      <section className="p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Kategoriler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(cat => (
            <Link key={cat._id} href={`/product?category=${cat._id}`}>
              <div className="border p-4 rounded text-center hover:shadow transition">
                <div className="w-24 h-24 relative mx-auto mb-2">
                  <Image
                    src={`http://localhost:5000/uploads/${cat.image}`}
                    alt={cat.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <p>{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ✅ Yeni Gelenler */}
      <section className="p-8 bg-gray-50 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Yeni Gelenler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {newArrivals.map(p => <ProductCard key={p._id} {...p} />)}
        </div>
      </section>

      {/* ✅ Popüler Ürünler */}
      <section className="p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Popüler Ürünler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popular.map(p => <ProductCard key={p._id} {...p} />)}
        </div>
      </section>

      {/* ✅ Newsletter */}
      <section className="bg-blue-600 text-white py-12 text-center">
        <h3 className="text-xl font-bold mb-2">Yeniliklerden İlk Sen Haberdar Ol!</h3>
        <input
          type="email"
          placeholder="E-mail adresinizi girin"
          className="p-2 w-64 text-black rounded"
        />
        <button className="ml-2 bg-white text-blue-600 px-4 py-2 rounded">Abone Ol</button>
      </section>
    </main>
  );
}
