'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

interface Order {
  _id: string;
  user: { email: string };
  createdAt: string;
  status: string;
  items: {
    qty: number;
    price: number;
    product: {
      name: string;
      price: number;
    };
  }[];
}

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return router.push('/login');
    if (user.role !== 'admin') return router.push('/');

    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Siparişler alınamadı:', err);
      }
    };

    fetchOrders();
  }, [user]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await api.patch(`/orders/${id}/status`, { status });
      setOrders((prev) =>
        prev.map((order) => (order._id === id ? { ...order, status } : order))
      );
    } catch (err) {
      console.error('Durum güncellenemedi:', err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tüm Siparişler</h1>
      {orders.map((order) => (
        <div key={order._id} className="border p-4 mb-4 rounded shadow">
          <p><strong>Sipariş No:</strong> {order._id}</p>
          <p><strong>Kullanıcı:</strong> {order.user?.email}</p>
          <p><strong>Tarih:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Durum:</strong> 
            <select
              value={order.status}
              onChange={(e) => updateStatus(order._id, e.target.value)}
              className="ml-2 border rounded p-1"
            >
              <option value="pending">Bekliyor</option>
              <option value="shipped">Kargoya Verildi</option>
              <option value="delivered">Teslim Edildi</option>
              <option value="cancelled">İptal Edildi</option>
            </select>
          </p>

          <h2 className="mt-4 font-semibold">Ürünler</h2>
          <ul className="ml-4 list-disc">
            {order.items.map((item, i) => (
              <li key={i}>
                {item.product?.name} - {item.qty} adet - {item.price.toFixed(2)} ₺
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
