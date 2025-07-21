'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Order } from '@/types/order';
import { getOrderById } from '@/api/orderService';


export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (error) {
        console.error('Sipariş detayları alınamadı:', error);
        router.push('/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, router]);

  const statusText = {
    pending: 'Beklemede',
    confirmed: 'Onaylandı',
    shipped: 'Kargoda',
    delivered: 'Teslim Edildi',
  };

  if (loading) return <p className="p-6 text-center">Yükleniyor...</p>;
  if (!order) return <p className="p-6 text-center">Sipariş bulunamadı.</p>;

  const totalPrice = order.items.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sipariş Detayı</h1>

      <div className="border rounded p-4 shadow-sm space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span><strong>Sipariş No:</strong> #{order._id.slice(-6)}</span>
          <span><strong>Tarih:</strong> {new Date(order.createdAt).toLocaleDateString()}</span>
        </div>

        <div>
          <strong>Durum:</strong>{' '}
          <span className="inline-block px-2 py-1 rounded bg-gray-100 text-sm text-gray-800">
            {statusText[order.status]}
          </span>
        </div>

        {order.shippingAddress && (
          <div>
            <strong>Adres:</strong>
            <p className="ml-2">
              {order.shippingAddress.street}, {order.shippingAddress.city} {order.shippingAddress.postalCode}
            </p>
          </div>
        )}

        <div>
          <strong>Ürünler:</strong>
          <ul className="mt-1 pl-4 list-disc text-sm space-y-1">
            {order.items.map((item, idx) => (
              <li key={idx}>
                {item.product
                  ? `${item.product.name} — ${item.qty} adet — ${item.price.toFixed(2)} ₺`
                  : `[Ürün silinmiş] — ${item.qty} adet — ${item.price.toFixed(2)} ₺`}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-right font-semibold mt-2">
          Toplam: {totalPrice.toFixed(2)} ₺
        </div>
      </div>
    </div>
  );
}
