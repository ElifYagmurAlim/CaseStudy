"use client";
// src/pages/ResendVerification.tsx
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { resendVerification } from '@/api/authService';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email('Geçerli bir e-posta girin'),
});

type FormData = z.infer<typeof schema>;

const ResendVerification = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await resendVerification(data.email);
      setMessage(response.message);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Bir hata oluştu.');
      setMessage(null);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Doğrulama Maili Gönder</h2>

      <input type="email" placeholder="E-posta adresiniz" {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={isSubmitting}>
        Gönder
      </button>
    </form>
  );
};

export default ResendVerification;
