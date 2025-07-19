// /app/profile/page.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfileDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  if (!user) return <p className="p-4">Yükleniyor...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Merhaba, {user.firstName} 👋</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profil Yönetimi */}
        <Link href="/profile/edit">
          <div className="border p-4 rounded hover:shadow transition cursor-pointer">
            <h2 className="font-semibold text-lg mb-1">Profil Bilgileri</h2>
            <p className="text-sm text-gray-600">Ad, soyad, şifre ve iletişim bilgilerini güncelle.</p>
          </div>
        </Link>

        {/* Adres Defteri */}
        <Link href="/profile/edit#addresses">
          <div className="border p-4 rounded hover:shadow transition cursor-pointer">
            <h2 className="font-semibold text-lg mb-1">Adres Defteri</h2>
            <p className="text-sm text-gray-600">Teslimat adreslerini düzenle.</p>
          </div>
        </Link>

        {/* Siparişler */}
        <Link href="/orders">
          <div className="border p-4 rounded hover:shadow transition cursor-pointer">
            <h2 className="font-semibold text-lg mb-1">Siparişlerim</h2>
            <p className="text-sm text-gray-600">Geçmiş siparişlerini görüntüle ve durumunu takip et.</p>
          </div>
        </Link>

        {/* Wishlist */}
        <Link href="/wishlist">
          <div className="border p-4 rounded hover:shadow transition cursor-pointer">
            <h2 className="font-semibold text-lg mb-1">Favorilerim</h2>
            <p className="text-sm text-gray-600">Beğendiğin ürünleri kaydet.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
