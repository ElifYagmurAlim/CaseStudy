'use client';

import { PLACEHOLDER_IMAGE, RECENTLY_VIEWED_KEY } from '@/constants';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { BsHeartFill } from 'react-icons/bs';
import { Heart, Star } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product, Review } from '@/types/product';
import {
  getProductById,
  getRelatedProducts,
  getViewedTogether,
  markProductAsViewed,
  updateViewedTogether
} from '@/api/productService';
import {
  canReviewProduct,
  submitReview
} from '@/api/reviewService';
import { ALERTS } from '@/constants/messages';

export default function ProductDetailPage() {
  const rawId = useParams().id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

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

    const [productData, relatedData, viewedData] = await Promise.all([
      getProductById(id),
      getRelatedProducts(id),
      getViewedTogether(id)
    ]);

    setProduct(productData);
    setRelated(relatedData);
    setViewedTogether(viewedData);
    setLastReviews(productData.reviews?.slice(-3).reverse() || []);
  }, [id]);

  useEffect(() => {
    const fetchAll = async () => {
      await fetchProduct();
      if (!id || viewedOnce.current) return;

      try {
        await markProductAsViewed(id);
        viewedOnce.current = true;

const recent = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]');
        const updated = [id, ...recent.filter((pid: string) => pid !== id)].slice(0, 5);
        localStorage.setItem('recentlyViewedProducts', JSON.stringify(updated));

        const toSend = updated.filter((pid) => pid !== id);
        if (toSend.length > 0) {
          await updateViewedTogether(id, toSend);
        }

        if (user) {
          const can = await canReviewProduct(id);
          setCanReview(can);
        }

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
    if (!user || !product) return alert(ALERTS.LOGIN_REQUIRED);
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${user._id}/wishlist/${product._id}`, {
        method: 'POST',
      });
      const data = await res.json();
      updateUser({ wishlist: data.wishlist });
    } catch (err) {
      console.error('Favori işlemi başarısız:', err);
    } finally {
      setLoading(false);
    }
  };

const handleSubmitReview = async () => {
  if (!comment || rating === 0 || !product?._id) return alert(ALERTS.REVIEW);
  try {
    setSubmittingReview(true);
    await submitReview(product._id, { comment, rating });
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
        image: product.images?.[0] || PLACEHOLDER_IMAGE,
      });
      alert(ALERTS.ADDED_TO_CART);
    } catch (err) {
      console.error('Sepete ekleme hatası:', err);
    }
  };

  if (!product) return <p className="p-4">Yükleniyor...</p>;
  const mainImage = product.images?.[0] || PLACEHOLDER_IMAGE;
  const avgRating = product.reviews.length
    ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
    : null;

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="relative w-full aspect-square border rounded overflow-hidden">
          <Image src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${mainImage}`} alt={product.name} fill className="object-cover" />
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

      {/* Yorumlar */}
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
                onClick={handleSubmitReview}
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
                      <Star key={i} size={16} className="text-yellow-500" color='#facc15' fill='#facc15' />
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

      {/* Görüntülenen ve benzer ürünler */}
      {viewedTogether.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-2">Önerilen Ürünler</h2>
          <p className="text-sm text-gray-500 mb-4">Bu ürünü görüntüleyen kullanıcılar şunlara da baktı</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {viewedTogether.map((item) => (
              <ProductCard key={item._id} {...item} />
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
              <ProductCard key={item._id} {...item} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
