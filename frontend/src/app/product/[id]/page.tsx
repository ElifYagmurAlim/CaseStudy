'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/axios';
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { BsHeartFill } from 'react-icons/bs';
import { Heart, Star } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useRef } from 'react';
import { Product, Variant, Review } from '@/types/product';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { user, updateUser } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [viewedTogether, setViewedTogether] = useState<Product[]>([]);
  const [lastReviews, setLastReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const viewedOnce = useRef(false);

  const fetchProduct = useCallback(async () => {
    if (!id) return;

    const [productRes, relatedRes, viewedRes] = await Promise.all([
      api.get(`/products/${id}`),
      api.get(`/products/${id}/related`),
      api.get(`/products/${id}/viewed-together`)
    ]);

    setProduct(productRes.data);
    setRelated(relatedRes.data);
    setViewedTogether(viewedRes.data || []);
    setLastReviews(productRes.data.reviews?.slice(-3).reverse() || []);
  }, [id]);

  useEffect(() => {
    const fetchAll = async () => {
      await fetchProduct();
      if (!id || viewedOnce.current) return;

      try {
        
        await api.post(`/products/${id}/viewed`);
        viewedOnce.current = true;
        const recent = JSON.parse(localStorage.getItem('recentlyViewedProducts') || '[]');
        const updated = [id, ...recent.filter((pid: string) => pid !== id)].slice(0, 5);
        localStorage.setItem('recentlyViewedProducts', JSON.stringify(updated));
        
        const toSend = updated.filter((pid) => pid !== id);
        if (toSend.length > 0) {
          await api.post(`/products/update-viewed-together`, {
            current: id,
            recent: toSend,
          });
        }

        if (user) {
          const res = await api.get(`/reviews/can-review/${id}`);
          setCanReview(res.data.canReview);
        }
        viewedOnce.current = true;

      } catch (err) {
        console.error("Veri çekme hatası:", err);
      }
    };

    fetchAll();
  }, [id, fetchProduct, user]);

  useEffect(() => {
    if (product && user) {
      const alreadyReviewed = lastReviews.some(r => r.user?._id === user._id);
      setHasReviewed(alreadyReviewed);
    }
  }, [lastReviews, product, user]);

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

  const handleAdd = async () => {
    if (!product) return;
    try {
      await addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        qty: quantity,
        image: product.images?.[0] || '/placeholder.jpg',
      });
      alert('Ürün sepete eklendi!');
    } catch (err) {
      console.error('Sepete ekleme hatası:', err);
    }
  };

  if (!product) return <p className="p-4">Yükleniyor...</p>;
    const mainImage = product.images?.[0] || '/placeholder.jpg';
  const avgRating = product.reviews.length
    ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
    : null;

return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="relative w-full aspect-square border rounded overflow-hidden">
          <Image src={`http://localhost:5000/uploads/${mainImage}`} alt={product.name} fill className="object-cover" />
          <button
            onClick={toggleWishlist}
            className="absolute top-2 right-2 text-red-500 hover:scale-110 transition z-10"
            disabled={loading}
          >
            {isWished ? <BsHeartFill size={30} /> : <Heart size={30} />}
          </button>
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl text-gray-700 my-2">{product.price.toFixed(2)} ₺</p>
          <p className="text-gray-600 mb-4">{product.description}</p>

          <div className="text-sm text-gray-600 mb-2">
            <p><strong>Kategori:</strong> {product.category.name}</p>
            <p><strong>Stok:</strong> {product.stock}</p>
            <p><strong>Satış:</strong> {product.sold}</p>
            <p><strong>Görüntüleme:</strong> {product.views}</p>
            {avgRating && (
              <p><strong>Ortalama Puan:</strong> {avgRating} <Star size={16} className="inline-block text-yellow-500" /></p>
            )}
          </div>

          {product.tags.length > 0 && (
            <div className="mb-2">
              <strong>Etiketler:</strong>{' '}
              {product.tags.map((tag, i) => (
                <span key={i} className="inline-block bg-gray-200 rounded px-2 py-0.5 mr-1">{tag}</span>
              ))}
            </div>
          )}

          {product.variants?.length > 0 && (
            <div className="text-sm mb-3">
              <strong>Varyantlar:</strong>{' '}
              {product.variants.map((v, i) => (
                <span key={i} className="inline-block bg-gray-100 rounded px-2 py-0.5 mr-1">
                  {v.size || ''} {v.color || ''}
                </span>
              ))}
            </div>
          )}

          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="text-sm mb-3">
              <strong>Teknik Özellikler:</strong>
              <ul className="list-disc ml-5">
                {Object.entries(product.specs).map(([key, val]) => (
                  <li key={key}>{key}: {val}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2">
            <input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 border rounded px-2 py-1"
            />
            <button
              onClick={handleAdd}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Sepete Ekle
            </button>
          </div>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Yorumlar</h2>

        {user ? (
          canReview ? (
            <div className="mb-6 border p-4 rounded bg-gray-50">
              <h4 className="text-lg font-semibold mb-2">Yorum Bırakın</h4>
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className="cursor-pointer"
                    onClick={() => setRating(star)}
                    color={rating >= star ? '#facc15' : '#d1d5db'}
                    fill={rating >= star ? '#facc15' : 'none'}
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
          ) : (
            <p className="text-sm text-gray-500">Bu ürünü teslim aldıktan sonra yorum yapabilirsiniz.</p>
          )
        ) : (
          <p className="text-sm text-gray-500">Yorum yapmak için giriş yapmalısınız.</p>
        )}

        {lastReviews.length > 0 ? (
          <ul className="space-y-4">
            {lastReviews.map((r, idx) => (
              <li key={idx} className="border p-4 rounded bg-white shadow">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold">{r.user?.firstName + " " + r.user?.lastName || 'Anonim'}</p>
                  <div className="flex gap-1">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-500" color='#facc15' fill='#facc15'/>
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

        <div className="mt-4">
          <button
            onClick={() => router.push(`/products/${id}/reviews`)}
            className="text-blue-600 hover:underline"
          >
            Tüm yorumları gör
          </button>
        </div>
      </section>

{viewedTogether.length > 0 && (
  <section className="mt-12">
    <h2 className="text-2xl font-bold mb-2">Önerilen Ürünler</h2>
    <p className="text-sm text-gray-500 mb-4">Bu ürünü görüntüleyen kullanıcılar şunlara da baktı</p>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {viewedTogether.map((item) => (
        <ProductCard key={item._id} {...(item as any)} />
      ))}
    </div>
  </section>
)}

{related.length > 0 && (
  <section className="mt-16">
    <h2 className="text-2xl font-bold mb-4">Benzer Ürünler</h2>
    <p className="text-sm text-gray-500 mb-4">Aynı kategorideki diğer ürünler</p>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {related.map((item) => (
        <ProductCard key={item._id} {...(item as any)} />
      ))}
    </div>
  </section>
)}

    </main>
  );
}
