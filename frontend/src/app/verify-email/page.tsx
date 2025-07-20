'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/axios';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Geçersiz veya eksik bağlantı.');
        return;
      }

      try {
        const res = await api.get(`/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage(res.data.message || 'E-posta doğrulandı.');
      } catch (err: any) {
        console.error(err);
        setStatus('error');
        setMessage(err.response?.data?.message || 'Doğrulama başarısız.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      {status === 'pending' && <p>Doğrulama yapılıyor...</p>}
      {status === 'success' && (
        <>
          <h1 className="text-2xl font-bold text-green-600">Başarılı!</h1>
          <p className="mt-2">{message}</p>
        </>
      )}
      {status === 'error' && (
        <>
          <h1 className="text-2xl font-bold text-red-600">Hata!</h1>
          <p className="mt-2">{message}</p>
        </>
      )}
    </div>
  );
}
