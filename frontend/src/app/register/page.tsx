'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from '@/lib/axios';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email('Geçerli bir e-posta girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
  firstName: z.string().min(1, 'İsim zorunludur'),
  lastName: z.string().min(1, 'Soyisim zorunludur'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await axios.post('/auth/register', data);
      setSuccessMessage('Kayıt başarılı! Lütfen e-posta adresinize gönderilen doğrulama linkini kontrol edin.');
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Kayıt sırasında hata oluştu.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow rounded bg-white">
      <h1 className="text-2xl font-bold mb-4">Kayıt Ol</h1>

      {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
      {serverError && <p className="text-red-600 mb-4">{serverError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          placeholder="İsim"
          {...register('firstName')}
          className="border p-2 w-full"
        />
        {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}

        <input
          type="text"
          placeholder="Soyisim"
          {...register('lastName')}
          className="border p-2 w-full"
        />
        {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}

        <input
          type="email"
          placeholder="E-posta"
          {...register('email')}
          className="border p-2 w-full"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Şifre"
          {...register('password')}
          className="border p-2 w-full"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600"
        >
          Kayıt Ol
        </button>
      </form>
    </div>
  );
}
