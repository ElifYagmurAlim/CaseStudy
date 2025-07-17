'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/axios';
import { useAuth } from '@/store/auth';

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
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
}

export default function OrderDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${params.id}`);
        setOrder(res.data);
      } catch (err) {
        console.error('Sipariş alınamadı:', err);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [user, params.id]);

  if (!order) return <p className="p-4">Yükleniyor...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sipariş Detayı</h1>
      <p><strong>Sipariş No:</strong> {order._id}</p>
      <p><strong>Tarih:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
      <p><strong>Durum:</strong> {order.status}</p>
      <p className="mt-4"><strong>Adres:</strong></p>
      <p>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>

      <h2 className="text-lg font-semibold mt-6">Ürünler</h2>
      <ul className="list-disc ml-6 mt-2">
        {order.items.map((item, index) => (
          <li key={index}>
            {item.product.name} - {item.qty} adet - {item.price.toFixed(2)} ₺
          </li>
        ))}
      </ul>
    </div>
  );
}
