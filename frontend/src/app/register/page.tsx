"use client";

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerUser } from '@/api/authService';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email('Geçerli bir e-posta girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
  firstName: z.string().min(1, 'İsim zorunludur'),
  lastName: z.string().min(1, 'Soyisim zorunludur'),
});

type FormData = z.infer<typeof schema>;

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data);
      setSuccessMessage('Kayıt başarılı! Lütfen e-postanızı kontrol edin.');
      setServerError(null);
      reset();
    } catch (err: any) {
      console.error(err);
      setServerError(err.response?.data?.message || 'Kayıt başarısız');
      setSuccessMessage(null);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4">Kayıt Ol</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input className="w-full p-2 border rounded" placeholder="Ad" {...register('firstName')} />
        {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}

        <input className="w-full p-2 border rounded" placeholder="Soyad" {...register('lastName')} />
        {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}

        <input className="w-full p-2 border rounded" type="email" placeholder="E-posta" {...register('email')} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

        <input className="w-full p-2 border rounded" type="password" placeholder="Şifre" {...register('password')} />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}

        {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
        {serverError && <p className="text-sm text-red-500">{serverError}</p>}

        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Kayıt Ol
        </button>
      </form>
    </div>
  );
};

export default Register;
