'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyEmail } from '@/api/authService';

const Verify = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Next.js'te token query paramından alınır

  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        if (!token) throw new Error('Doğrulama tokenı bulunamadı.');
        const msg = await verifyEmail(token);
        setStatus('success');
        setMessage(msg);
        setTimeout(() => router.push('/login'), 3000);
      } catch (err: any) {
        setStatus('error');
        setMessage(err?.response?.data?.message || err.message || 'Doğrulama başarısız.');
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">E-posta Doğrulama</h2>
      {status === 'pending' && <p>Doğrulama yapılıyor...</p>}
      {status === 'success' && <p className="text-green-600">{message}</p>}
      {status === 'error' && <p className="text-red-600">{message}</p>}
    </div>
  );
};

export default Verify;
