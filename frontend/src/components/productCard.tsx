'use client';

import { useCart } from '@/store/cart';
import { Product } from '@/types/types';
import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import api from '@/lib/axios';
import { useState } from 'react';
import { Heart, HeartOff } from 'lucide-react';
import { BsHeartFill } from 'react-icons/bs';

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
}: Props) {
  const { addToCart, items } = useCart();
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const currentQty = items.find(item => item.productId === _id)?.qty || 0;

  const isWished = user?.wishlist?.includes(_id);

  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (currentQty + 1 > stock) {
      return alert("Stokta daha fazla ürün yok.");
    }
    addToCart({ productId: _id, name, price, qty: 1 , image: images?.[0] });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const mainImage = images?.[0] || '/placeholder.jpg';

  const toggleWishlist = async () => {
    if (!user) return alert('Favorilere eklemek için giriş yapmalısınız');
    try {
      setLoading(true);
      const res = await api.post(`/users/${user._id}/wishlist/${_id}`);
      updateUser({ wishlist: res.data.wishlist }); // güncellenmiş hali
    } catch (err) {
      console.error('Favori işlemi başarısız:', err);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className='relative'>
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      
      <div className="relative w-full h-48 mb-3">
        <Image
          src={`http://localhost:5000/uploads/${mainImage}`}
          alt={name}
          fill
          className="object-cover rounded"
        />
      </div>
      

      {/* Ürün içeriği */}
      <h3 className="text-lg font-bold">{name}</h3>
      <p>{price} ₺</p>
    

      {featured && (
        <div className="text-xs text-yellow-600 font-semibold mt-1">⭐ Öne Çıkan</div>
      )}

      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 text-xs text-gray-600 mt-2">
          {tags.map((tag, idx) => (
            <span key={idx} className="bg-gray-200 px-2 py-0.5 rounded">{tag}</span>
          ))}
        </div>
      )}

      {variants?.length > 0 && (
        <p className="text-xs text-gray-500 mt-1">
          {variants.map(v => `${v.size || ''} ${v.color || ''}`).join(', ')}
        </p>
      )}

      <div className="flex gap-2 mt-3">
        <button
          onClick={handleAdd}
          disabled={stock === 0}
            className={`px-6 py-2 rounded transition-all duration-100 text-sm ${
            added ? 'bg-green-500' : 'bg-orange-500'
          } text-white`}
        >
          {added ? '✔️ Eklendi' : stock > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
        </button>
        <button
          onClick={() => router.push(`/product/${_id}`)}
          className="px-6 py-2 rounded transition-all duration-300 bg-blue-500 hover:bg-blue-700 text-white text-sm"
        >
          İncele
        </button>
      </div>
      </div>
      {/* Favori butonu */}
      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 text-red-500 hover:scale-110 transition z-10"
        disabled={loading}
        title="Favorilere ekle veya kaldır"
      >
        {isWished ? <BsHeartFill size={20} /> : <Heart size={20} />}
      </button>
</div>
  );
}
