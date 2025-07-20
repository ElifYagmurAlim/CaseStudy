'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/axios';
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { BsHeartFill } from 'react-icons/bs';
import { Heart, Star } from 'lucide-react';

interface Variant {
  size?: string;
  color?: string;
}

interface Review {
  comment: string;
  rating: number;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: { _id: string; name: string };
  specs: Record<string, string>;
  tags: string[];
  featured: boolean;
  variants: Variant[];
  reviews?: Review[];
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user, updateUser } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProduct = useCallback(async () => {
    if (!id) return;

    const [productRes, relatedRes] = await Promise.all([
      api.get(`/products/${id}`),
      api.get(`/products/${id}/related`),
    ]);

    setProduct(productRes.data);
    setRelated(relatedRes.data);
  }, [id]);

  useEffect(() => {
    fetchProduct();
    if (!id) return;

    api.post(`/products/${id}/viewed`);

    const recent = JSON.parse(localStorage.getItem('recentlyViewedProducts') || '[]');
    const updated = [id, ...recent.filter((pid: string) => pid !== id)].slice(0, 5);
    localStorage.setItem('recentlyViewedProducts', JSON.stringify(updated));
  }, [id, fetchProduct]);

  useEffect(() => {
    if (product && user) {
const alreadyReviewed = product.reviews?.some(
  (r) => r.user?._id?.toString() === user._id
);      setHasReviewed(alreadyReviewed || false);
    }
  }, [product, user]);

  const handleAddToCart = () => {
    if (!product || quantity > product.stock) return alert('Stokta yeterli ürün yok.');
    addToCart({ productId: product._id, qty: quantity, name: product.name, price: product.price });
  };

  const isWished = !!(product?._id && user?.wishlist?.includes(product._id));

  const toggleWishlist = async () => {
    if (!user || !product) return alert('Favorilere eklemek için giriş yapmalısınız');
    try {
      setLoading(true);
      const res = await api.post(`/users/${user._id}/wishlist/${product._id}`);
      updateUser({ wishlist: res.data.wishlist });
    } catch (err) {
      console.error('Favori işlemi başarısız:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!comment || rating === 0 || !product?._id) return alert("Lütfen puan ve yorum girin.");
    try {
      setSubmittingReview(true);
      await api.post(`/reviews/${product._id}`, { comment, rating });
      setComment('');
      setRating(0);
      await fetchProduct();
      setHasReviewed(true);
    } catch (err) {
      console.error("Yorum gönderilemedi:", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!product) return <p className="p-4">Yükleniyor...</p>;

  const mainImage = product.images?.[0] || '/placeholder.jpg';

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="relative w-full aspect-square border rounded overflow-hidden">
          <Image src={`http://localhost:5000/uploads/${mainImage}`} alt={product.name} fill className="object-cover" />
          <button
            onClick={toggleWishlist}
            className="absolute top-2 right-2 text-red-500 hover:scale-110 transition z-10"
            disabled={loading}
            title="Favorilere ekle veya kaldır"
          >
            {isWished ? <BsHeartFill size={30} /> : <Heart size={30} />}
          </button>
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl text-gray-700 my-2">{product.price.toFixed(2)} ₺</p>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-sm text-gray-500 mb-1">Kategori: {product.category?.name || 'Belirtilmemiş'}</p>

          {product.tags?.length > 0 && (
            <p className="text-sm text-gray-500 mb-2">Etiketler: {product.tags.join(', ')}</p>
          )}

          {product.featured && (
            <div className="text-xs text-white bg-yellow-500 inline-block px-2 py-1 rounded mb-2">
              Öne Çıkan Ürün
            </div>
          )}

          {product.variants?.length > 0 && (
            <div className="text-sm mb-3">
              <strong>Varyantlar:</strong>{' '}
              {product.variants.map((v, i) => (
                <span key={i} className="inline-block bg-gray-200 rounded px-2 py-0.5 mr-1">
                  {v.size || ''} {v.color || ''}
                </span>
              ))}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Adet:</label>
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border px-2 py-1 w-24 rounded"
            />
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
          </button>

          {product.specs && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Teknik Özellikler</h3>
              <ul className="list-disc pl-6 text-gray-600">
                {Object.entries(product.specs).map(([key, value]) => (
                  <li key={key}>{key}: {value}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Yorumlar</h2>

        {user && !hasReviewed && (
          <div className="mb-6 border p-4 rounded bg-gray-50">
            <h4 className="text-lg font-semibold mb-2">Yorum Bırakın</h4>
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  className={`cursor-pointer ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            <textarea
              placeholder="Yorumunuzu yazın..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border p-2 rounded mb-2"
            />
            <button
              onClick={submitReview}
              className="bg-blue-600 text-white px-4 py-2 rounded"
              disabled={submittingReview}
            >
              Gönder
            </button>
          </div>
        )}

        {product.reviews?.length ? (
          <ul className="space-y-4">
            {product.reviews.map((r, idx) => (
              <li key={idx} className="border p-4 rounded bg-white shadow">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold">{r.user?.firstName + " " + r.user?.lastName || 'Anonim'}</p>
                  <div className="flex gap-1">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-500" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{r.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Henüz yorum yapılmamış.</p>
        )}
      </section>

      {related.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Benzer Ürünler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <div key={p._id} className="border p-4 rounded">
                <p className="font-semibold">{p.name}</p>
                <p>{p.price.toFixed(2)} ₺</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
