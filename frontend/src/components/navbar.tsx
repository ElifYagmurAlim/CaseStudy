'use client';

import Link from 'next/link';
import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CartSummary from './CartSummary';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [showCart, setShowCart] = useState(false);

  let hoverTimeout: NodeJS.Timeout;

  useEffect(() => {
    setHasMounted(true);
  }, []);
  
    if (!hasMounted) return null; // SSR sırasında DOM render'ı engeller

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
     <header className="bg-white shadow-md sticky top-0 z-50">
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-800 text-white">
      <Link href="/" className="text-xl font-bold">
        E-Commerce
      </Link>

      <div className="flex gap-4 items-center">
      

      {user && (
          <>
          <span>Hi, {user.firstName || user.email}</span>
                {user?.role === 'admin' && (
        <div><Link href="/admin/orders" className="ml-4">
          Customer Orders
        </Link>
        <Link href="/admin/customers" className="ml-4">Müşteriler</Link>

        <Link href="/admin/products" className="ml-4">Products</Link>
        <Link href="/admin/categories" className="ml-4">Categories</Link>
        </div>
      )}
      {user?.role === 'customer' && (
        <div className="flex items-center gap-4 ml-4">
          <Link href="/product">Ürünler</Link>
          <Link href="/profile">Profil</Link>
          
          <div
            className="relative"
            onMouseEnter={() => {
              clearTimeout(hoverTimeout);
              setShowCart(true);
            }}
            onMouseLeave={() => {
              hoverTimeout = setTimeout(() => setShowCart(false), 300);
            }}
          >
            <Link href="/cart" className="flex items-center gap-1">
              🛒 <span>Sepet</span>
            </Link>

            {showCart && (
              <div className="absolute right-0 mt-2 z-50">
                <CartSummary />
              </div>
            )}
          </div>
        </div>
      )}

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
    </header>
  );
}
