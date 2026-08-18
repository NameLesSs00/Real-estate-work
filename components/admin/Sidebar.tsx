'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { handleLogout } from '@/lib/auth/logout';
import { BarChart2 } from 'lucide-react';

const menuItems: { name: string; path: string; icon?: string; lucideIcon?: string }[] = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: '/admin/sidebar/home-2.png' },
  { name: 'Units', path: '/admin/units', icon: '/admin/sidebar/buildings-2.png' },
  { name: 'Sold Units', path: '/admin/sold-units', icon: '/admin/sidebar/receipt-search.png' },
  // { name: 'Deals',         path: '/admin/deals',        icon: '/admin/dashbaord/revenue.png' },
  { name: 'Projects', path: '/admin/projects', icon: '/admin/sidebar/folder-open.png' },
  { name: 'Developers', path: '/admin/developers', icon: '/admin/sidebar/profile-2user.png' },
  { name: 'Units Requests', path: '/admin/requests', icon: '/admin/sidebar/receipt-search.png' },
  { name: 'Property Leads', path: '/admin/leads', icon: '/admin/sidebar/receipt-search.png' },
  { name: 'Contacts', path: '/admin/contacts', icon: '/admin/sidebar/profile-2user.png' },
  { name: 'Locations', path: '/admin/locations', icon: '/admin/sidebar/location.png' },
  { name: 'Facilities', path: '/admin/facilities', icon: '/admin/sidebar/location.png' },
  { name: 'Services', path: '/admin/services', icon: '/admin/sidebar/setting-2.png' },
  { name: 'Blogs', path: '/admin/blogs', icon: '/admin/sidebar/blogger.png' },
  { name: 'FAQ', path: '/admin/faq', icon: '/admin/sidebar/setting-2.png' },
  { name: 'Reviews', path: '/admin/reviews', lucideIcon: 'BarChart2' },
  { name: 'Setting', path: '/admin/settings', icon: '/admin/sidebar/setting-2.png' },
];

export default function Sidebar() {
  const pathname = usePathname();

  // Hide sidebar on the login page (and potentially splash screen if it's at /admin)
  if (pathname === '/admin/login' || pathname === '/admin') {
    return null;
  }

  return (
    <aside className="w-[280px] h-screen bg-white text-gray-800 border-r border-gray-100 flex flex-col fixed left-0 top-0 z-50 font-inter">
      {/* Logo Area */}
      <div className="pt-12 pb-10 flex justify-center items-center">
        <Image
          src="/assists/header/headerLogo.png"
          alt="Luxe Estate"
          width={120}
          height={120}
          className="brightness-0"
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-6 overflow-y-auto space-y-2 py-4 scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = pathname?.endsWith(item.path) || pathname?.includes(item.path + '/');

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group mx-2
                ${isActive
                  ? 'bg-[#fbf9f6] text-[#A88849] font-semibold border-r-4 border-[#A88849]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#000000]'
                }
              `}
            >
              {/* Icon: Lucide component or CSS mask image */}
              {item.lucideIcon === 'BarChart2' ? (
                <BarChart2
                  size={22}
                  className={`transition-colors duration-300 ${isActive ? 'text-[#A88849]' : 'text-gray-400 group-hover:text-[#000000]'}`}
                />
              ) : (
                <div
                  className={`w-6 h-6 transition-colors duration-300 ${isActive ? 'bg-[#A88849]' : 'bg-gray-400 group-hover:bg-[#000000]'}`}
                  style={{
                    WebkitMask: `url('${item.icon}') center/contain no-repeat`,
                    mask: `url('${item.icon}') center/contain no-repeat`
                  }}
                />
              )}
              <span className="text-[17px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="px-6 pb-12 pt-4 mt-auto">
        <button
          onClick={() => handleLogout()}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-red-500 transition-all duration-300 group hover:bg-red-50 cursor-pointer"
        >
          <div
            className="w-6 h-6 bg-red-500 transition-colors duration-300 group-hover:bg-red-600"
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
