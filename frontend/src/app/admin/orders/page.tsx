'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Order {
  _id: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  user: { email: string };
  total: number;
}

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Siparişler alınamadı:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const filtered = orders.filter((order) => {
    const emailMatch = order.user?.email?.toLowerCase().includes(search.toLowerCase());
    const statusMatch = statusFilter ? order.status === statusFilter : true;
    return emailMatch && statusMatch;
  });

  if (loading) return <p className="p-6">Yükleniyor...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sipariş Yönetimi</h1>

      {/* Arama ve Filtre */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Kullanıcı email ile ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Tüm Durumlar</option>
          <option value="pending">Beklemede</option>
          <option value="confirmed">Onaylandı</option>
          <option value="shipped">Kargoda</option>
          <option value="delivered">Teslim Edildi</option>
        </select>
      </div>

      {/* Liste */}
      <div className="space-y-4">
        {filtered.map((order) => (
          <div key={order._id} className="p-4 border rounded shadow-sm flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Tarih: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Email:</strong> {order.user?.email || '-'}</p>
              <p><strong>Durum:</strong> {order.status}</p>
            </div>
            <div className="flex items-center">
              <Link
                href={`/admin/orders/${order._id}`}
                className="text-blue-600 hover:underline"
              >
                Detay
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
