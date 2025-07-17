'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

interface Order {
  _id: string;
  status: string;
  createdAt: string;
  items: {
    qty: number;
    price: number;
    product: {
      name: string;
      price: number;
    };
  }[];
}

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
        try {
            const res = await api.get<Order[]>('/orders/user');
            setOrders(res.data);
        } catch (err) {
            console.error('Siparişleri alırken hata:', err);
        } finally {
            setLoading(false);
        }
    };

        fetchOrders();
    }, [user]);

    if (loading) return <p className="p-4">Yükleniyor...</p>;


    return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Siparişlerim</h1>
      {orders.length === 0 ? (
        <p>Henüz siparişiniz yok.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order._id} className="border p-4 rounded shadow">
              <p><strong>Sipariş No:</strong> {order._id}</p>
              <p><strong>Durum:</strong> {order.status}</p>
              <p><strong>Tarih:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Ürünler:</strong></p>
              <ul className="ml-4 list-disc">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.product ? (
                      <>
                        {item.product.name} - {item.qty} adet - {item.price.toFixed(2)} ₺
                      </>
                    ) : (
                      <>
                        [Ürün silinmiş] - {item.qty} adet - {item.price.toFixed(2)} ₺
                      </>
                    )}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}