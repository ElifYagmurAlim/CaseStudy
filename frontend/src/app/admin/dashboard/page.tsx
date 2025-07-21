'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, Tooltip } from 'recharts';
import Link from 'next/link';
import { DashboardData } from '@/types/dashboard';
import { fetchDashboardData } from '@/api/adminService';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const statusMap: Record<string, string> = {
  pending: 'Beklemede',
  confirmed: 'Onaylandı',
  shipped: 'Kargoda',
  delivered: 'Teslim Edildi',
};

export default function AdminDashboard() {
const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'


  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchDashboardData(timeRange);
        setData(result);
      } catch (err) {
        console.error('Dashboard verisi alınamadı:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [timeRange]);

  if (loading || !data) return <p className="p-6">Yükleniyor...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Paneli</h1>

      {/* Zaman Aralığı Filtresi */}
      <div className="mb-6">
        <label className="mr-2 font-semibold">Zaman Aralığı:</label>
        <select
          className="border rounded px-3 py-2"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="week">Bu Hafta</option>
          <option value="month">Bu Ay</option>
          <option value="year">Bu Yıl</option>
        </select>
      </div>

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
          {data.salesTrend?.length > 0 ? (
            <BarChart width={400} height={200} data={data.salesTrend}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          ) : (
            <p className="text-sm text-gray-500">Grafik verisi bulunamadı.</p>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Sipariş Durumları</h3>
          {data.statusCounts?.length > 0 ? (
            <PieChart width={400} height={200}>
              <Pie
                data={data.statusCounts}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name }) => statusMap[name] || name}
              >
                {data.statusCounts.map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          ) : (
            <p className="text-sm text-gray-500">Grafik verisi bulunamadı.</p>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">Son Siparişler</h3>
        <ul className="space-y-2 text-sm">
          {data.recentOrders?.length > 0 ? (
            data.recentOrders.map((o: any) => (
              <li key={o._id} className="flex justify-between">
                <span>{o.user?.email || 'Müşteri'} — {o.totalPrice?.toFixed(2) || 0} ₺ — {statusMap[o.status]}</span>
                <Link href={`/admin/orders/${o._id}`} className="text-blue-600 underline">Detay</Link>
              </li>
            ))
          ) : (
            <li>Henüz sipariş alınmamış.</li>
          )}
        </ul>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">Popüler Ürünler</h3>
        <ul className="space-y-2 text-sm">
          {data.popularProducts?.length > 0 ? (
            data.popularProducts.map((p: any) => (
              <li key={p._id}>{p.name} — {p.sold} satış</li>
            ))
          ) : (
            <li>Popüler ürün bulunamadı.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
