'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { verifyEmail } from '@/api/authService';
import { isAxiosError } from 'axios';

const Verify = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawToken = useParams();
  const token = Array.isArray(rawToken) ? rawToken[0].token : rawToken.token;

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
      } 
      catch (err: unknown) {
                    if (isAxiosError(err)) {
                      const message = err.response?.data?.message;
                        setMessage(message || 'Doğrulama başarısız.');
                        setStatus('error');      
                      } else {
                      setMessage('Bilinmeyen bir hata oluştu.');
                      setStatus('error');      
                    }
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
