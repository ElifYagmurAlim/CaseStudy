'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { createOrder } from '@/api/orderService';
import { useRouter } from 'next/navigation';
import { ALERTS } from '@/constants/messages';

interface Address {
  street: string;
  city: string;
  postalCode: string;
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState<Address>({
    street: '',
    city: '',
    postalCode: '',
  });

  const [selectedAddressIndex, setSelectedAddressIndex] = useState<string>('new');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  useEffect(() => {
    const selected = user?.addresses?.[Number(selectedAddressIndex)];
  if (selected) {
    setForm({
      
      street: selected.street || '',
      city: selected.city || '',
      postalCode: selected.postalCode || '',
      
    });
  }
    }, [selectedAddressIndex, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async () => {
  if (items.length === 0) return alert(ALERTS.EMPTY_CHART);

  const { street, city, postalCode } = form;
  if (!street || !city || !postalCode) {
    return alert('Lütfen tüm adres alanlarını doldurun');
  }

  const payload = {
    user: user?._id || null,
    items: items.map(item => ({
      product: item.productId,
      qty: item.qty,
      price: item.price,
    })),
    shippingAddress: form,
    paymentMethod,
  };

    try {
    setLoading(true);
    await createOrder(payload);
    alert(ALERTS.ORDER_CREATED);
    clearCart();
    router.push('/order-confirmation');
  } catch (err) {
    console.error('Sipariş oluşturulamadı:', err);
    alert(ALERTS.ORDER_CREATION_FAILED);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Siparişi Tamamla</h1>

      {/* Adres Seçimi */}
      {user && user.addresses && (
        <div className="mb-4">
          <label className="font-semibold block mb-1">Kayıtlı Adres Seç</label>
          <select
            className="w-full border p-2 rounded"
            value={selectedAddressIndex}
            onChange={(e) => setSelectedAddressIndex(e.target.value)}
          >
            {user.addresses.map((addr, index) => (
              <option key={index} value={index}>
                 {addr.city} - {addr.street}
              </option>
            ))}
            <option value="new">Yeni adres gir</option>
          </select>
        </div>
      )}

      {/* Yeni adres formu */}
      {selectedAddressIndex === 'new' && (
        <div className="space-y-4 mb-4">
          
          <input
            name="street"
            placeholder="Adres"
            value={form.street}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            name="city"
            placeholder="Şehir"
            value={form.city}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            name="postalCode"
            placeholder="Posta Kodu"
            value={form.postalCode}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

        </div>
      )}

      {/* Ödeme yöntemi */}
      <div className="mb-4">
        <label className="font-semibold block mb-1">Ödeme Yöntemi</label>
        <select
          name="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="cash">Kapıda Ödeme</option>
          <option value="credit">Kredi Kartı (manuel)</option>
        </select>
      </div>

      {/* Toplam ve gönder */}
      <div className="text-right text-lg font-semibold mb-4">
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
  );
}
