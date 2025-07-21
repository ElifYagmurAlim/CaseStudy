'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';
import {Order} from '@/types/order';
import Link from 'next/link';
import { getUserOrders } from '@/api/orderService'; 

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
      const data = await getUserOrders();
      setOrders(data);
    } catch (err) {
      console.error('Siparişleri alırken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, [user]);

  const statusBadge = (status: Order['status']) => {
    const base = 'px-2 py-1 text-xs rounded font-medium';
    switch (status) {
      case 'pending':
        return <span className={`${base} bg-yellow-100 text-yellow-800`}>Beklemede</span>;
      case 'confirmed':
        return <span className={`${base} bg-blue-100 text-blue-800`}>Onaylandı</span>;
      case 'shipped':
        return <span className={`${base} bg-purple-100 text-purple-800`}>Kargoda</span>;
      case 'delivered':
        return <span className={`${base} bg-green-100 text-green-800`}>Teslim Edildi</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  if (loading) return <p className="p-6 text-center">Yükleniyor...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Siparişlerim</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">Henüz siparişiniz yok.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-5 shadow-md hover:shadow-lg transition">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span><strong>Sipariş No:</strong> #{order._id.slice(-6)}</span>
                <span><strong>Tarih:</strong> {new Date(order.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="mb-3">{statusBadge(order.status)}</div>

              <div className="text-sm text-gray-800 mb-2">
                <strong>Ürünler:</strong>
                <ul className="mt-1 pl-4 list-disc space-y-1">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.product
                        ? `${item.product.name} — ${item.qty} adet — ${item.price.toFixed(2)} ₺`
                        : `[Ürün silinmiş] — ${item.qty} adet — ${item.price.toFixed(2)} ₺`}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/orders/${order._id}`}
                className="inline-block mt-2 text-sm text-blue-600 hover:underline"
              >
                Detayları Gör
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
