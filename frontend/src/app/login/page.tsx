'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email('Geçerli bir email girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [serverError, setServerError] = useState('');
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema) });

    const onSubmit = async (data: any) => {
    try {
        const res = await axios.post('http://localhost:5000/api/auth/login', data);
        login(res.data, res.data.token ); // <-- Burada store'a yazıyoruz
        router.push('/');
    } catch (err: any) {
        setServerError(err.response?.data?.message || 'Giriş sırasında hata oluştu.');
    }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 shadow rounded bg-white">
        <h1 className="text-2xl font-bold mb-4">Giriş Yap</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
            placeholder="Email"
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

            <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">
            Giriş Yap
            </button>
        </form>
        </div>
    );
}
