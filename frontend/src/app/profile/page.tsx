'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/store/auth';
import api from '@/lib/axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';



const schema = z.object({
  firstName: z.string().min(1, 'İsim zorunludur'),
  lastName: z.string().min(1, 'Soyisim zorunludur'),
  phone: z.string().optional(),
  addresses: z
    .array(
      z.object({
        street: z.string().min(1, 'Zorunlu'),
        city: z.string().min(1, 'Zorunlu'),
        postalCode: z.string().min(1, 'Zorunlu'),
      })
    )
    .optional(),
});

type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      addresses: user?.addresses || [{ street: '', city: '', postalCode: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'addresses',
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.patch(`/users/${user?._id}`, data);
      updateUser(res.data);
      setSuccessMessage('Bilgiler başarıyla güncellendi');
      setTimeout(() => setSuccessMessage(''), 3000); // 3 saniyede kaybolsun
    } catch (err) {
      console.error('Güncelleme hatası:', err);
      alert('Bir hata oluştu');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
  e.preventDefault();
    try {
      await api.patch(`/users/${user?._id}/password`, {
        currentPassword,
        newPassword,
      });
      setPasswordMessage('Şifre başarıyla güncellendi.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPasswordMessage('Şifre güncellenemedi: ' + err.response?.data?.message);
    }
  };

  if (!user) return <p>Yükleniyor...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profil Bilgileri</h1>
      {successMessage && (
        <div className="p-2 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Ad</label>
          <input {...register('firstName')} className="input" />
          {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
        </div>

        <div>
          <label>Soyad</label>
          <input {...register('lastName')} className="input" />
          {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
        </div>

        <div>
          <label>Telefon</label>
          <input {...register('phone')} className="input" />
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-2">Adresler</h2>
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-2 mb-4 border p-4 rounded">
              <div>
                <label>Sokak</label>
                <input {...register(`addresses.${index}.street`)} className="input" />
              </div>
              <div>
                <label>Şehir</label>
                <input {...register(`addresses.${index}.city`)} className="input" />
              </div>
              <div>
                <label>Posta Kodu</label>
                <input {...register(`addresses.${index}.postalCode`)} className="input" />
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 text-sm mt-2"
              >
                Bu adresi sil
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ street: '', city: '', postalCode: '' })}
            className="bg-gray-200 px-3 py-1 rounded text-sm"
          >
            Yeni adres ekle
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={isSubmitting}
        >
          Kaydet
        </button>
      </form>
      <h2 className="text-xl font-semibold mt-8 mb-4">Şifre Güncelle</h2>
<form onSubmit={handlePasswordChange} className="space-y-4">
  <div>
    <label>Mevcut Şifre</label>
    <input
      type="password"
      className="input"
      value={currentPassword}
      onChange={(e) => setCurrentPassword(e.target.value)}
    />
  </div>
  <div>
    <label>Yeni Şifre</label>
    <input
      type="password"
      className="input"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
    />
  </div>
  <button
    type="submit"
    className="bg-blue-600 text-white px-4 py-2 rounded"
    disabled={isSubmitting}
  >
    Şifreyi Güncelle
  </button>
  {passwordMessage && <p className="text-green-600">{passwordMessage}</p>}
</form>
    </div>
  );
}

// useFieldArray adresleri dinamik eklemek/silmek için kullanılıyor.

// updateUser(...) çağrısı ile local state güncelleniyor.

// Backend PATCH /api/users/:id endpoint’inde user.addresses = addresses; satırı da varsa tam uyumlu olur.