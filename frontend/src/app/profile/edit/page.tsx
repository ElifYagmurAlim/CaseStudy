'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { useForm, useFieldArray } from 'react-hook-form';
import { updateUserProfile, updateUserPassword } from '@/api/userService';
import { isAxiosError } from 'axios';
import { ALERTS } from '@/constants/messages';


export default function ProfileEditPage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'info' | 'addresses' | 'password'>('info');
  const [passwordMessage, setPasswordMessage] = useState('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm({
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

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }

    if (window.location.hash === '#addresses') {
      setActiveTab('addresses');
    } else if (window.location.hash === '#password') {
      setActiveTab('password');
    } else {
      setActiveTab('info');
    }
  }, [user]);

  const onSubmit = async (data: any) => {
    try {
      const res = await updateUserProfile(user!._id, data);
      updateUser(res.data);
      alert(ALERTS.PROFILE_CREATED);
    } catch (err) {
      console.error('Güncelleme hatası:', err);
      alert(ALERTS.SOMETHING_WENT_WRONG);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentPassword = (e.currentTarget.elements.namedItem('currentPassword') as HTMLInputElement).value;
    const newPassword = (e.currentTarget.elements.namedItem('newPassword') as HTMLInputElement).value;

    try {
      await updateUserPassword(user!._id, currentPassword, newPassword);
      setPasswordMessage('Şifre başarıyla güncellendi.');
    } catch (err: unknown) {
          if (isAxiosError(err)) {
            const message = err.response?.data?.message;
              setPasswordMessage(message || 'Şifre güncellenemedi.');
          } else {
            setPasswordMessage('Bilinmeyen bir hata oluştu.');
          }
        }
  };

  if (!user) return <p className="p-6 text-center">Yükleniyor...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Profil Düzenle</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setActiveTab('info');
            window.history.replaceState(null, '', '/profile/edit');
          }}
          className={`px-4 py-2 rounded ${activeTab === 'info' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Profil Bilgileri
        </button>
        <button
          onClick={() => {
            setActiveTab('addresses');
            window.history.replaceState(null, '', '/profile/edit#addresses');
          }}
          className={`px-4 py-2 rounded ${activeTab === 'addresses' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Adres Defteri
        </button>
        <button
          onClick={() => {
            setActiveTab('password');
            window.history.replaceState(null, '', '/profile/edit#password');
          }}
          className={`px-4 py-2 rounded ${activeTab === 'password' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Şifre Güncelle
        </button>
      </div>

      {activeTab === 'info' && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label>Ad</label>
            <input {...register('firstName')} className="input w-full" />
          </div>
          <div>
            <label>Soyad</label>
            <input {...register('lastName')} className="input w-full" />
          </div>
          <div>
            <label>Telefon</label>
            <input {...register('phone')} className="input w-full" />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={isSubmitting}>
            Güncelle
          </button>
        </form>
      )}

      {activeTab === 'addresses' && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="border p-4 rounded space-y-2">
              <input {...register(`addresses.${index}.street`)} placeholder="Sokak" className="input w-full" />
              <input {...register(`addresses.${index}.city`)} placeholder="Şehir" className="input w-full" />
              <input {...register(`addresses.${index}.postalCode`)} placeholder="Posta Kodu" className="input w-full" />
              <button type="button" onClick={() => remove(index)} className="text-red-600 text-sm">Sil</button>
            </div>
          ))}
          <button type="button" onClick={() => append({ street: '', city: '', postalCode: '' })} className="bg-gray-200 px-3 py-1 rounded">
            Yeni Adres Ekle
          </button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={isSubmitting}>
            Güncelle
          </button>
        </form>
      )}

      {activeTab === 'password' && (
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label>Mevcut Şifre</label>
            <input type="password" name="currentPassword" className="input w-full" required />
          </div>
          <div>
            <label>Yeni Şifre</label>
            <input type="password" name="newPassword" className="input w-full" required />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Şifreyi Güncelle</button>
          {passwordMessage && <p className="text-sm text-green-600 mt-2">{passwordMessage}</p>}
        </form>
      )}
    </div>
  );
}
