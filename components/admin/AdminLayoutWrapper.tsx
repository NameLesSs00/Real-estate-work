'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';
export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.includes('/admin/login') || pathname.endsWith('/admin') || pathname.endsWith('/admin/');

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {!isAuthPage && <Sidebar />}
      <main className={`flex-1 transition-all duration-300 flex flex-col ${!isAuthPage ? 'ml-[280px]' : ''}`}>
        {!isAuthPage && <AdminHeader />}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {children}
        </div>
      </main>
    </div>
  );
}
