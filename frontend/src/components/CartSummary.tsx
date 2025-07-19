'use client';

import Link from 'next/link';
import { useCart } from '@/store/cart';

export default function CartSummary() {
  const { items } = useCart();

  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  if (items.length === 0) {
    return (
      <div className="bg-white text-black p-4 shadow-lg rounded w-72">
        <p className="text-sm text-gray-500">Sepetiniz boş.</p>
      </div>
    );
  }

  return (
    <div className="bg-white text-black p-4 shadow-lg rounded w-72">
      <h3 className="text-lg font-semibold mb-3">Sepet Özeti</h3>
      <ul className="divide-y divide-gray-200 mb-4">
        {items.map((item) => (
          <li key={item.productId} className="py-2 text-sm flex justify-between">
            <span>{item.name}</span>
            <span>{item.qty} × {item.price.toFixed(2)} ₺</span>
          </li>
        ))}
      </ul>

      <div className="flex justify-between font-semibold text-sm mb-3">
        <span>Toplam:</span>
        <span>{total.toFixed(2)} ₺</span>
      </div>

      <Link
        href="/cart"
        className="block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
      >
        Sepete Git
      </Link>
    </div>
  );
}
