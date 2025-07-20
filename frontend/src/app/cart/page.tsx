'use client';

import { useCart } from '@/store/cart';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { items, updateQty, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = () => {
    if (!items.length) return alert('Sepet boş');
    router.push('/checkout');
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sepetim</h1>

      {items.length === 0 ? (
        <p>Sepetiniz boş. <Link href="/product" className="text-blue-600">Ürünlere göz atın</Link>.</p>
      ) : (
        <>
          <ul className="divide-y mb-6">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <Image
                      src={`http://localhost:5000/uploads/${item.image || 'placeholder.jpg'}`}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.price.toFixed(2)} ₺</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={item.qty}
                    onChange={(e) => updateQty(item.productId, Number(e.target.value))}
                    className="w-16 border rounded px-2 py-1"
                  />
                  <button onClick={() => removeFromCart(item.productId)} className="text-red-600 text-sm">
                    Kaldır
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="text-right font-semibold text-lg mb-4">
            Ara Toplam: {subtotal.toFixed(2)} ₺
          </div>

          <div className="flex gap-4">
            <button onClick={clearCart} className="px-4 py-2 bg-gray-200 rounded">Temizle</button>
            <button onClick={handleCheckout} className="px-4 py-2 bg-blue-600 text-white rounded">Siparişi Tamamla</button>
          </div>
        </>
      )}
    </main>
  );
}
