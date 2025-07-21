'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getOrderById, updateOrderStatus } from '@/api/orderService';
import { Order, OrderItem } from '@/types/order'

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    getOrderById(id).then(setOrder).catch((err) => {
      console.error('Sipariş alınamadı:', err);
    });
  }, [id]);

  const handleStatusUpdate = async (status: Order['status']) => {
          if (!id) return;
    try {
      setUpdating(true);
      const updated = await updateOrderStatus(id, status);
      setOrder(updated);
    } catch (err) {
      console.error('Durum güncelleme hatası:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (!order) return <p className="p-6">Yükleniyor...</p>;

  const total = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-4">
        <Link href="/admin/orders" className="text-blue-600 underline text-sm">
          ← Sipariş listesine dön
        </Link>
      </div>

      <h1 className="text-xl font-bold mb-4">Sipariş Detayı</h1>
      <p><strong>Email:</strong> {order.user?.email}</p>
      <p><strong>Durum:</strong> {order.status}</p>
      <p><strong>Tarih:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
      <p><strong>Ödeme Yöntemi:</strong> {order.paymentMethod}</p>

      <div className="my-4">
        <h3 className="font-semibold mb-2">Gönderim Adresi</h3>
        <p>{order.shippingAddress?.fullName}</p>
        <p>{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
        <p>{order.shippingAddress?.postalCode}</p>
        <p>{order.shippingAddress?.phone}</p>
      </div>

      <div className="my-4">
        <h3 className="font-semibold mb-2">Ürünler</h3>
        <ul className="list-disc pl-5 space-y-1">
          {order.items.map((item, i) => (
            <li key={i}>
              {item.product?.name || '[Ürün silinmiş]'} — {item.qty} × {item.price.toFixed(2)} ₺
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 font-semibold">
        <p>Toplam: {total.toFixed(2)} ₺</p>
      </div>

      <div className="mt-6">
        <label className="block mb-1 font-semibold">Durumu Güncelle:</label>
        <select
          disabled={updating}
          value={order.status}
          onChange={(e) => handleStatusUpdate(e.target.value as Order['status'])}
          className="border px-3 py-2 rounded"
        >
          <option value="pending">Beklemede</option>
          <option value="confirmed">Onaylandı</option>
          <option value="shipped">Kargoda</option>
          <option value="delivered">Teslim Edildi</option>
        </select>
      </div>
    </div>
  );
}
