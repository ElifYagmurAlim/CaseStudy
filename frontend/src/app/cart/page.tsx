'use client';

import { useCart } from '@/store/cart';
import Link from 'next/link';

export default function CartPage() {
  const items = useCart(state => state.items); //gets zustand chart datas
  const removeFromCart = useCart(state => state.removeFromCart);//removes item from zustand chart
  const clearCart = useCart(state => state.clearCart);//removes all items in zustand chart

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);//calculates total price

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sepetim</h1>

      {items.length === 0 ? (
        <p className="text-gray-600">Sepetiniz boş.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex justify-between items-center border p-4 rounded"
              >
                <div>
                  <h2 className="font-medium">{item.name}</h2>
                  <p>
                    {item.qty} x {item.price}₺ = {item.qty * item.price}₺
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-red-500 hover:underline"
                >
                  Sil
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 text-right">
            <p className="font-bold text-lg">Toplam: {total.toFixed(2)}₺</p>
            <button
              onClick={clearCart}
              className="mt-2 text-sm text-gray-500 hover:underline"
            >
              Sepeti Temizle
            </button>
          </div>
        </>
      )}
      
      <Link href="/checkout">
  <button className="bg-green-600 text-white px-4 py-2 rounded mt-4">
    Siparişi Tamamla
  </button>
</Link>

    </main>
    
  );
}
