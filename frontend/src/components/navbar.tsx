'use client';

import Link from 'next/link';
import { useAuth } from '@/store/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import CartSummary from './CartSummary';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  let hoverTimeout: NodeJS.Timeout;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user?.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/');
    }
  };

  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`hover:underline ${
        pathname === href ? 'font-bold underline' : ''
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="flex items-center justify-between px-6 py-4 bg-gray-800 text-white">
        {/* Logo */}
        <a
          href="#"
          className="text-xl font-bold"
          onClick={handleLogoClick}
        >
          🛍️ E-Ticaret
        </a>

        {/* Hamburger Menü (Mobil) */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>

        {/* Menü (Desktop veya Açılmış Mobil Menü) */}
        <div
          className={`${
            mobileMenuOpen ? 'block' : 'hidden'
          } md:flex gap-4 items-center`}
        >
          {/* Merhaba mesajı */}
          {user && (
            <span className="text-sm text-gray-300">
              Merhaba, {user.firstName || user.email}
            </span>
          )}

          {!isAdmin && (
            <>
              {navLink('/product', '🛒 Ürünler')}
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
                {navLink('/cart', '🧺 Sepet')}

                {showCart && (
                  <div className="absolute right-0 mt-2 z-50">
                    <CartSummary />
                  </div>
                )}
              </div>
            </>
          )}

          {!user && (
            <>
              {navLink('/login', '🔐 Giriş')}
              {navLink('/register', '📝 Kayıt Ol')}
            </>
          )}

          {user && (
            <>
              {isAdmin && (
                <>
                  {navLink('/admin/orders', '📦 Siparişler')}
                  {navLink('/admin/customers', '👥 Müşteriler')}
                  {navLink('/admin/products', '📦 Ürün Yönetimi')}
                  {navLink('/admin/categories', '📂 Kategoriler')}
                </>
              )}

              {isCustomer && (
                <>
                  {navLink('/profile', '👤 Profil')}
                </>
              )}

              <button
                onClick={handleLogout}
                className="text-red-400 hover:underline"
              >
                🚪 Çıkış Yap
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
