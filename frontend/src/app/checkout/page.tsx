'use client';

import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    street: '',
    city: '',
    postalCode: '',
    paymentMethod: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('Lütfen giriş yapın');
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      alert('Sepetiniz boş');
      return;
    }

    setLoading(true);

    try {
      await api.post('/orders', {
        user: user._id,
        items: items.map((item) => ({
          product: item.productId,
          qty: item.qty,
          price: item.price,
        })),
        shippingAddress: {
          street: form.street,
          city: form.city,
          postalCode: form.postalCode,
        },
        paymentMethod: form.paymentMethod || 'Nakit', // opsiyonel alan
      });

      clearCart();
      alert('Sipariş başarıyla oluşturuldu!');
      router.push('/');
    } catch (err) {
      console.error('Sipariş oluşturulamadı:', err);
      alert('Sipariş gönderilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sipariş Bilgileri</h1>

      <div className="space-y-4">
        <input
          type="text"
          name="street"
          placeholder="Cadde/Sokak"
          value={form.street}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="city"
          placeholder="Şehir"
          value={form.city}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Posta Kodu"
          value={form.postalCode}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="paymentMethod"
          placeholder="Ödeme Yöntemi (örnek: Nakit, Kredi Kartı)"
          value={form.paymentMethod}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          {loading ? 'Gönderiliyor...' : 'Siparişi Tamamla'}
        </button>
      </div>
    </main>
  );
}
