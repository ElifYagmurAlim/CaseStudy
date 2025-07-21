'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getUserById } from '@/api/userService';
import { getOrdersByUserId } from '@/api/orderService';
import type { User } from '@/types/user';
import type { Order } from '@/types/order';

export default function AdminCustomerDetail() {
   const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!id) return;

    getUserById(id).then(setUser);
    getOrdersByUserId(id).then(setOrders);
  }, [id]);

  if (!user) return <p className="p-6">Yükleniyor...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Kullanıcı Detayı</h1>

      <div className="mb-6">
        <p><strong>Ad Soyad:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Telefon:</strong> {user.phone || '-'}</p>
        <p><strong>Adresler:</strong> {user.addresses?.length || 0} kayıtlı adres</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Siparişler</h2>
      {orders.length === 0 ? (
        <p>Henüz sipariş yok.</p>
      ) : (
        <ul className="space-y-2">
          {orders.map(o => (
            <li key={o._id} className="border p-3 rounded">
              <p><strong>Tarih:</strong> {new Date(o.createdAt).toLocaleDateString()}</p>
              <p><strong>Durum:</strong> {o.status}</p>
              <p><strong>Ürünler:</strong> {o.items.map(i => `${i.product?.name} x${i.qty}`).join(', ')}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
