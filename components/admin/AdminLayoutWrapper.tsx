'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/admin/login' || pathname === '/admin';

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {!isAuthPage && <Sidebar />}
      <main className={`flex-1 transition-all duration-300 ${!isAuthPage ? 'ml-[280px]' : ''}`}>
        {children}
      </main>
    </div>
  );
}
