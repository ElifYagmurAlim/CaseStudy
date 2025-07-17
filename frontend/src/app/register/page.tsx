'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import * as z from 'zod';
import { useState } from 'react';

const schema = z.object({
    firstName: z.string().min(1, 'İsim zorunlu'),
    lastName: z.string().min(1, 'Soyisim zorunlu'),
    email: z.string().email('Geçerli bir email girin'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
    phone: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [serverError, setServerError] = useState('');

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', data);
      alert('Kayıt başarılı!');
    } catch (error: any) {
      setServerError(error.response?.data?.message || 'Bir hata oluştu.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <input {...register('email')} placeholder="Email" className="border p-2 w-full" />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <input {...register('password')} placeholder="Password" type="password" className="border p-2 w-full" />
      {errors.password && <p className="text-red-500">{errors.password.message}</p>}

      <input {...register('firstName')} placeholder="First Name" className="border p-2 w-full" />
      {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}

      <input {...register('lastName')} placeholder="Last Name" className="border p-2 w-full" />
      {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}

      <input {...register('phone')} placeholder="Phone (optional)" className="border p-2 w-full" />

      {serverError && <p className="text-red-500">{serverError}</p>}

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Kayıt Ol
      </button>
    </form>
  );
}
