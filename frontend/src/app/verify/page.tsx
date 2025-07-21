"use client";
// src/pages/Verify.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // veya useRouter (Next.js kullanıyorsan)
import axios from '@/lib/axios'; // interceptor'lu axios instance

const Verify = () => {
  const { token } = useParams(); // Next.js için useRouter().query.token
  const navigate = useNavigate();
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/auth/verify/${token}`);
        setStatus('success');
        setMessage(response.data.message || 'E-posta doğrulandı. Giriş yapabilirsiniz.');
        // otomatik yönlendirme:
        setTimeout(() => navigate('/login'), 3000);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Doğrulama başarısız.');
      }
    };

    if (token) verifyEmail();
  }, [token, navigate]);

  return (
    <div>
      <h2>E-posta Doğrulama</h2>
      {status === 'pending' && <p>Doğrulama yapılıyor...</p>}
      {status === 'success' && <p style={{ color: 'green' }}>{message}</p>}
      {status === 'error' && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
};

export default Verify;
