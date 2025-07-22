'use client';

import { useCart } from '@/store/cart';
import { Product } from '@/types/product';
import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { BsHeartFill } from 'react-icons/bs';
import { Heart, Eye, ShoppingCart, Star } from 'lucide-react';
import { toggleWishlist } from '@/api/userService'; // Ekle
import { PLACEHOLDER_IMAGE } from '@/constants';
import { ALERTS } from '@/constants/messages';

type Props = Product;

export default function ProductCard({
  _id,
  name,
  price,
  stock,
  images,
  category,
  tags,
  featured,
  variants,
  sold,
  views,
  reviews
}: Props) {
  const { user, updateUser } = useAuth();
  const { addItem, items } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const currentQty = items.find(item => item.productId === _id)?.qty || 0;
const isWished = Array.isArray(user?.wishlist) && _id && user.wishlist.includes(_id);
  const mainImage = images?.[0] || PLACEHOLDER_IMAGE ;

  const handleAdd = async () => {
    if (currentQty + 1 > stock) {
      return alert(ALERTS.NOT_ENOUGH_STOCK);
    }

    try {
      await addItem({
        productId: _id,
        name: name,
        price: price,
        qty: 1,
        image: mainImage,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      console.error('Sepete ekleme başarısız:', err);
      alert(ALERTS.ADD_TO_CART_FAILED);
    }
  };

  const toggleWishlistHandler = async () => {
    if (!user) return alert(ALERTS.LOGIN_REQUIRED);
    try {
      setLoading(true);
      const updatedWishlist = await toggleWishlist(user._id, _id);
      updateUser({ wishlist: updatedWishlist.wishlist });
    } catch (err) {
      console.error('Favori işlemi başarısız:', err);
    } finally {
      setLoading(false);
    }
  };

  const avgRating = reviews?.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="relative h-full">
      <div className="border p-4 rounded shadow hover:shadow-lg transition h-full flex flex-col justify-between">
        <div>
          <div className="relative w-full h-48 mb-3">
            <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${mainImage}`}
              alt={name}
              fill
              className="object-cover rounded"
            />
          </div>

          <h3 className="text-lg font-bold">{name}</h3>
          <p className="font-semibold text-orange-600">{price} ₺</p>

          <div className="flex flex-wrap items-center text-xs text-gray-500 mt-2 gap-x-3">
            <span>📦 Stok: {stock}</span>
            <span>🛒 Satılan: {sold}</span>
            <span><Eye size={14} className="inline-block mr-1" /> {views}</span>
            {avgRating && (
              <span>
                <Star size={14} className="inline-block text-yellow-500" fill="#facc15" /> {avgRating}
              </span>
            )}
          </div>

          {featured && (
            <div className="text-xs text-yellow-600 font-semibold mt-1">
              ⭐ Öne Çıkan
            </div>
          )}

          {tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 text-xs text-gray-600 mt-2">
              {tags.map((tag, idx) => (
                <span key={idx} className="bg-gray-200 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {variants?.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {variants.map(v => `${v.size || ''} ${v.color || ''}`).join(', ')}
            </p>
          )}
        </div>

        {/* Butonlar en altta */}
        <div className="mt-auto flex gap-2 pt-4">
          <button
            onClick={handleAdd}
            disabled={stock === 0}
            className={`flex-1 py-2 rounded transition-all duration-100 text-sm ${
              added ? 'bg-green-500' : 'bg-orange-500'
            } text-white`}
          >
            {added ? '✔️ Eklendi' : stock > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
          </button>
          <button
            onClick={() => router.push(`/product/${_id}`)}
            className="flex-1 py-2 rounded transition-all duration-300 bg-blue-500 hover:bg-blue-700 text-white text-sm"
          >
            İncele
          </button>
        </div>
      </div>

      <button
        onClick={toggleWishlistHandler}
        className="absolute top-2 right-2 text-red-500 hover:scale-110 transition z-10"
        disabled={loading}
        title="Favorilere ekle veya kaldır"
      >
        {isWished ? <BsHeartFill size={20} /> : <Heart size={20} />}
      </button>
    </div>
  );
}
