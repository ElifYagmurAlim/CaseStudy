// app/checkout/page.tsx
'use client';

import { useCart } from '@/store/cart';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import api from '@/lib/axios';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const { user } = useAuth();
  
  const [shipping, setShipping] = useState('');
  const [payment, setPayment] = useState('');

const handleCheckout = async () => {
  if (!shipping || !payment) {
    alert('Please fill in shipping and payment information');
    return;
  }
const order = {
    user: user?._id, // ✅ kullanıcının ID'si olmalı
    shippingAddress: shipping,
    paymentMethod: payment,
    items: items.map((item) => ({
      product: item.productId,
      name: item.name, // ✅ opsiyonel ama gösterim için iyi
      qty: item.qty,
      price: item.price // ✅ bu alan zorunlu!
    })),
  };

    try {
      await api.post('/orders', order);
      alert('Order placed successfully!');
      router.push('/orders/confirmation');
    } catch (err) {
      console.error('Order failed:', err);
      alert('Order creation failed!');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <div>
        <label className="block font-medium">Shipping Address</label>
        <textarea
          className="w-full border rounded p-2"
          value={shipping}
          onChange={(e) => setShipping(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium">Payment Method</label>
        <select
          className="w-full border rounded p-2"
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
        >
          <option value="">Select Payment</option>
          <option value="card">Credit Card</option>
          <option value="cash">Cash on Delivery</option>
        </select>
      </div>

      <div className="text-right">
        <p className="text-xl font-semibold">Total: {total()} ₺</p>
        <button
          onClick={handleCheckout}
          className="bg-green-600 text-white px-6 py-2 rounded mt-2"
        >
          Complete Order
        </button>
      </div>
    </div>
  );
}
