'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';

interface OrderItem {
  product?: { name: string };
  qty: number;
  price: number;
}

interface Order {
  _id: string;
  user: { email: string };
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
  items: OrderItem[];
}

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error('Sipariş alınamadı:', err);
      }
    };

    fetchOrder();
  }, [id]);

  const updateStatus = async (status: Order['status']) => {
    try {
      setUpdating(true);
      const res = await api.patch(`/orders/${id}/status`, { status });
      setOrder(res.data);
    } catch (err) {
      console.error('Durum güncelleme hatası:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (!order) return <p className="p-6">Yükleniyor...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Sipariş Detayı</h1>
      <p><strong>Email:</strong> {order.user?.email}</p>
      <p><strong>Durum:</strong> {order.status}</p>
      <p><strong>Tarih:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>

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

      <div className="mt-6">
        <label className="block mb-1 font-semibold">Durumu Güncelle:</label>
        <select
          disabled={updating}
          value={order.status}
          onChange={(e) => updateStatus(e.target.value as Order['status'])}
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
