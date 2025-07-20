'use client';

import { useCart } from '@/store/cart';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import api from '@/lib/axios';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const { user } = useAuth();

  const [savedAddresses, setSavedAddresses] = useState<string[]>([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [customAddress, setCustomAddress] = useState('');
  const [useCustomAddress, setUseCustomAddress] = useState(false);

  const [payment, setPayment] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const [guestInfo, setGuestInfo] = useState({ name: '', email: '' });

  useEffect(() => {
    if (user?._id) {
      api.get(`/users/${user._id}/addresses`).then((res) => {
        setSavedAddresses(res.data || []);
      }).catch((err) => {
        console.error('Adresler alınamadı:', err);
      });
    }
  }, [user]);

  const handleCheckout = async () => {
    const shippingAddress = useCustomAddress ? customAddress : selectedAddress;

    if (!shippingAddress || !payment) {
      alert('Lütfen adres ve ödeme bilgilerini doldurun.');
      return;
    }

    if (!user && (!guestInfo.name || !guestInfo.email)) {
      alert('Lütfen isim ve email girin (misafir sipariş).');
      return;
    }

    if (payment === 'card' && cardNumber.length < 12) {
      alert('Geçerli bir kart numarası girin.');
      return;
    }

    const order = {
      user: user?._id || null,
      guest: user ? null : guestInfo,
      shippingAddress,
      paymentMethod: payment,
      items: items.map((item) => ({
        product: item.productId,
        name: item.name,
        qty: item.qty,
        price: item.price,
      })),
    };

    try {
      await api.post('/orders', order);
      alert('Sipariş başarıyla oluşturuldu!');
      clearCart();
      router.push('/order-confirmation');
    } catch (err) {
      console.error('Sipariş oluşturulamadı:', err);
      alert('Bir hata oluştu.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* Misafir Bilgileri */}
      {!user && (
        <div className="border p-4 rounded bg-gray-50">
          <h3 className="font-semibold mb-2">Misafir Bilgileri</h3>
          <input
            type="text"
            placeholder="Ad Soyad"
            value={guestInfo.name}
            onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
            className="w-full border p-2 mb-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={guestInfo.email}
            onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
            className="w-full border p-2 mb-2 rounded"
          />
        </div>
      )}

      {/* Adres Seçimi */}
      <div>
        <label className="block font-medium mb-1">Adres Seçimi</label>
        {user && savedAddresses.length > 0 && !useCustomAddress ? (
          <select
            className="w-full border rounded p-2 mb-2"
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
          >
            <option value="">Bir adres seçin</option>
            {savedAddresses.map((addr, i) => (
              <option key={i} value={addr}>{addr}</option>
            ))}
          </select>
        ) : null}

        {useCustomAddress && (
          <textarea
            placeholder="Yeni adres girin..."
            className="w-full border rounded p-2 mb-2"
            value={customAddress}
            onChange={(e) => setCustomAddress(e.target.value)}
          />
        )}

        <button
          className="text-sm text-blue-600 underline"
          onClick={() => setUseCustomAddress((prev) => !prev)}
        >
          {useCustomAddress ? 'Kayıtlı adresi seç' : 'Yeni adres gir'}
        </button>
      </div>

      {/* Ödeme Yöntemi */}
      <div>
        <label className="block font-medium">Ödeme Yöntemi</label>
        <select
          className="w-full border rounded p-2 mb-2"
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
        >
          <option value="">Seçiniz</option>
          <option value="card">Kredi Kartı</option>
          <option value="cash">Kapıda Ödeme</option>
        </select>

        {payment === 'card' && (
          <input
            type="text"
            placeholder="Kart Numarası (sahte)"
            className="w-full border rounded p-2"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
        )}
      </div>

      <div className="text-right mt-4">
        <p className="text-xl font-semibold">Toplam: {total()} ₺</p>
        <button
          onClick={handleCheckout}
          className="bg-green-600 text-white px-6 py-2 rounded mt-2"
        >
          Siparişi Tamamla
        </button>
      </div>
    </div>
  );
}
