'use client';

import Link from 'next/link';
import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-800 text-white">
      <Link href="/" className="text-xl font-bold">
        E-Commerce
      </Link>

      <div className="flex gap-4 items-center">
        
      {user && (
          <>
          <span>Hi, {user.firstName || user.email}</span>
            <Link href="/orders">Orders</Link>
            <Link href="/profile">Profile</Link>
            <Link href="/cart">Chart</Link>
            <button onClick={handleLogout} className="text-red-400 hover:underline">
              Çıkış Yap
            </button>
          </>
      )}
      {!user && (
          <>
            <Link href="/login">Giriş</Link>
            <Link href="/register">Kayıt Ol</Link>
          </>
        )}
      </div>
    </nav>
  );
}
