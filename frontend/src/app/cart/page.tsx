'use client';

import { useCart } from '@/store/cart';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { items, updateQty, removeItem, clearCart } = useCart();

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sepetim</h1>

      {items.length === 0 ? (
        <p>
          Sepetiniz boş.{' '}
          <Link href="/product" className="text-blue-600 underline">
            Ürünleri incele
          </Link>
        </p>
      ) : (
        <>
          <table className="w-full mb-6 border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Ürün</th>
                <th>Adet</th>
                <th>Fiyat</th>
                <th>Sil</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.productId} className="border-t">
                  <td className="p-2 flex items-center gap-2">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.image}`}
                      alt={item.name}
                      width={50}
                      height={50}
                      className="rounded"
                    />
                    {item.name}
                  </td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => updateQty(item.productId, Number(e.target.value))}
                      className="w-16 border rounded px-2 py-1"
                    />
                  </td>
                  <td>{item.price * item.qty} ₺</td>
                  <td>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-500"
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={clearCart}
              className="text-sm text-red-500 underline"
            >
              Sepeti Temizle
            </button>

            <div className="text-right font-semibold text-lg">
              Toplam: {totalPrice.toFixed(2)} ₺
            </div>
          </div>

          <div className="text-right mt-4">
            <Link href="/checkout">
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Siparişi Tamamla
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
