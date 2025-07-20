'use client';

import { useState } from 'react';
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: '',
    street: '',
    city: '',
    postalCode: '',
    phone: '',
    paymentMethod: 'cash',
  });

  const [loading, setLoading] = useState(false);

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (items.length === 0) return alert('Sepet boş');

    const { fullName, street, city, postalCode, phone } = form;
    if (!fullName || !street || !city || !postalCode || !phone) {
      return alert('Lütfen tüm alanları doldurun');
    }

    const payload = {
      user: user?._id || null, // login olanlar için kullanıcı id'si
      items: items.map(item => ({
        product: item.productId,
        qty: item.qty,
        price: item.price,
      })),
      shippingAddress: form,
      paymentMethod: form.paymentMethod,
    };

    try {
      setLoading(true);
      await api.post('/orders', payload);
      alert('Sipariş başarıyla oluşturuldu!');
      clearCart();
      router.push('/order-confirmation'); // ya da /thank-you
    } catch (err) {
      console.error('Sipariş oluşturulamadı:', err);
      alert('Sipariş oluşturulamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Siparişi Tamamla</h1>

      <div className="space-y-4">
        <input name="fullName" placeholder="Ad Soyad" onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="street" placeholder="Adres" onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="city" placeholder="Şehir" onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="postalCode" placeholder="Posta Kodu" onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="phone" placeholder="Telefon" onChange={handleChange} className="w-full border p-2 rounded" />

        <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="cash">Kapıda Ödeme</option>
          <option value="credit">Kredi Kartı (manuel)</option>
        </select>

        <div className="text-right text-lg font-semibold">
          Toplam: {totalPrice.toFixed(2)} ₺
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? 'İşleniyor...' : 'Siparişi Gönder'}
        </button>
      </div>
    </div>
  );
}
