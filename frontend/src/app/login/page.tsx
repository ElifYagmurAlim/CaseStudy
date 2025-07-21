"use client";

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginUser } from '@/api/authService';
import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth'; 
import { resendVerification } from '@/api/authService';

const schema = z.object({
  email: z.string().email('Geçerli bir e-posta girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [serverError, setServerError] = useState<string | null>(null);
  const [emailForResend, setEmailForResend] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth(); // custom auth store'un (token vs için)

  const onSubmit = async (data: FormData) => {
    try {
      const res = await loginUser(data);

      login(res, res.token); // kullanıcıyı kaydet, token'ı al
      if (res.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }

    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const message = err.response?.data?.message;

        if (message === 'Email not verified') {
          setServerError('E-posta adresiniz henüz doğrulanmamış.');
          setEmailForResend(data.email);
        } else {
          setServerError(message || 'Giriş başarısız');
        }
      } else {
        console.error(err);
        setServerError('Bilinmeyen bir hata oluştu.');
      }
    }
  };

const handleResend = async () => {
  if (!emailForResend) return;
  try {
    await resendVerification(emailForResend);
    alert('Doğrulama e-postası yeniden gönderildi.');
  } catch (err: any) {
    alert(err.response?.data?.message || 'Gönderim sırasında hata oluştu.');
  }
};

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4">Giriş Yap</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input className="w-full p-2 border rounded" type="email" placeholder="E-posta" {...register('email')} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

        <input className="w-full p-2 border rounded" type="password" placeholder="Şifre" {...register('password')} />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}

        {serverError && (
          <div className="text-sm text-red-500">
            <p>{serverError}</p>

            {serverError.includes('doğrulanmamış') && emailForResend && (
              <button
                type="button"
                onClick={handleResend}
                className="mt-2 text-blue-600 underline text-sm"
              >
                Doğrulama e-postasını tekrar gönder
              </button>
            )}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default Login;
