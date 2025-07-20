'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get('/admin/dashboard').then(res => setData(res.data));
  }, []);

  if (!data) return <p className="p-6">Yükleniyor...</p>;

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-lg font-semibold">Toplam Satış</h2>
          <p className="text-2xl">{data.totalSales.toFixed(2)} ₺</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-lg font-semibold">Sipariş Sayısı</h2>
          <p className="text-2xl">{data.orderCount}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-lg font-semibold">Müşteri Sayısı</h2>
          <p className="text-2xl">{data.userCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Satış Trendleri</h3>
          <BarChart width={400} height={200} data={data.salesTrend}>
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Sipariş Durumları</h3>
          <PieChart width={400} height={200}>
            <Pie
              data={data.statusCounts}
              dataKey="count"
              nameKey="_id"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.statusCounts.map((_: any, i: number) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">Son Siparişler</h3>
        <ul className="space-y-2 text-sm">
          {data.recentOrders.map((o: any) => (
            <li key={o._id}>
              {o.user?.email || 'Müşteri'} — {typeof o.totalPrice === 'number' ? o.totalPrice.toFixed(2) : 'Fiyat yok'} ₺ — {o.status}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">Popüler Ürünler</h3>
        <ul className="space-y-2 text-sm">
          {data.popularProducts.map((p: any) => (
            <li key={p._id}>{p.name} — {p.sold} satış</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
