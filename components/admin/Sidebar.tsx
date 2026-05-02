'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { handleLogout } from '@/lib/auth/logout';

const menuItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: '/admin/sidebar/home-2.png' },
  { name: 'Units', path: '/admin/units', icon: '/admin/sidebar/buildings-2.png' },
  { name: 'Projects', path: '/admin/projects', icon: '/admin/sidebar/folder-open.png' },
  { name: 'Developers', path: '/admin/developers', icon: '/admin/sidebar/profile-2user.png' },
  { name: 'Units Requests', path: '/admin/requests', icon: '/admin/sidebar/receipt-search.png' },
  { name: 'Spots', path: '/admin/spots', icon: '/admin/sidebar/location.png' },
  { name: 'Blogs', path: '/admin/blogs', icon: '/admin/sidebar/blogger.png' },
  { name: 'Setting', path: '/admin/settings', icon: '/admin/sidebar/setting-2.png' },
];

export default function Sidebar() {
  const pathname = usePathname();

  // Hide sidebar on the login page (and potentially splash screen if it's at /admin)
  if (pathname === '/admin/login' || pathname === '/admin') {
    return null;
  }

  return (
    <aside className="w-[280px] h-screen bg-[#16273B] text-white flex flex-col fixed left-0 top-0 z-50 font-inter">
      {/* Logo Area */}
      <div className="pt-12 pb-10 flex justify-center items-center">
        <div 
          className="w-48 h-20 bg-white"
          style={{
            WebkitMask: `url('/admin/sidebar/Group 3.png') center/contain no-repeat`,
            mask: `url('/admin/sidebar/Group 3.png') center/contain no-repeat`
          }}
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-6 overflow-y-auto space-y-2 py-4 scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');
          
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group
                ${isActive 
                  ? 'bg-white text-[#16273B] font-semibold' 
                  : 'text-white hover:bg-white hover:text-[#16273B]'
                }
              `}
            >
              {/* Icon using CSS mask to easily invert color on hover/active */}
              <div 
                className={`w-6 h-6 transition-colors duration-300 ${isActive ? 'bg-[#16273B]' : 'bg-white group-hover:bg-[#16273B]'}`}
                style={{
                  WebkitMask: `url('${item.icon}') center/contain no-repeat`,
                  mask: `url('${item.icon}') center/contain no-repeat`
                }}
              />
              <span className="text-[17px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="px-6 pb-12 pt-4 mt-auto">
        <button 
          onClick={() => handleLogout()}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-white transition-all duration-300 group hover:bg-white hover:text-[#16273B] cursor-pointer"
        >
          <div 
            className="w-6 h-6 bg-white transition-colors duration-300 group-hover:bg-[#16273B]"
            style={{
              WebkitMask: `url('/admin/sidebar/basil_logout-solid.png') center/contain no-repeat`,
              mask: `url('/admin/sidebar/basil_logout-solid.png') center/contain no-repeat`
            }}
          />
          <span className="text-[17px] font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
