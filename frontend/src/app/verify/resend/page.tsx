'use client';

import { useState } from 'react';
import { resendVerificationEmail } from '@/api/authService';
import { isAxiosError } from 'axios';

export default function ResendVerifyPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const msg = await resendVerificationEmail(email);
      setStatus('success');
      setMessage(msg || 'Doğrulama e-postası gönderildi.');
    } catch (err: unknown) {
              if (isAxiosError(err)) {
                const message = err.response?.data?.message;
                  setMessage(message || 'Bir hata oluştu.');
setStatus('error');
                } else {
                setMessage('Bilinmeyen bir hata oluştu.');
setStatus('error');
              }
            }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">E-posta Doğrulama Yeniden Gönder</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-posta adresiniz"
          required
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Gönder
        </button>
      </form>

      {status === 'success' && <p className="text-green-600 mt-4">{message}</p>}
      {status === 'error' && <p className="text-red-600 mt-4">{message}</p>}
    </div>
  );
}
