'use client';

import './globals.css';
import { useEffect } from 'react';
import { useAuth } from '@/store/auth';
import Navbar from '@/components/Navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { loadUserFromStorage } = useAuth();

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  return (
    <html lang="tr">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}