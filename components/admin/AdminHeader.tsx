'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';

export default function AdminHeader() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [adminName, setAdminName] = useState('Admin');

  React.useEffect(() => {
    const storedName = localStorage.getItem('adminName');
    if (storedName) {
      setAdminName(storedName);
    }
  }, []);

  // Extract and format the current page name from the URL
  const getPageName = () => {
    if (!pathname) return 'Dashboard';
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length < 2) return 'Dashboard';
    const page = parts[parts.length - 1];
    
    const formattedName = page.charAt(0).toUpperCase() + page.slice(1).replace(/-/g, ' ');
    if (formattedName.toLowerCase() === 'requests') return 'Units Requests';
    if (formattedName.toLowerCase() === 'settings') return 'Settings';
    
    return formattedName;
  };

  return (
    <header className="h-[100px] px-10 flex items-center justify-between bg-[#16273B] font-inter w-full text-white scrollbar-hide">
      {/* Left Side: Page Title and Greeting */}
      <div className="flex flex-col min-w-[200px]">
        <h1 className="text-[24px] font-bold tracking-tight">
          {getPageName()}
        </h1>
        <p className="text-[14px] text-gray-300 mt-0.5">
          Welcome back, {adminName}
        </p>
      </div>
      
      {/* Center: Search Bar */}
      <div className="flex-1 max-w-[500px] mx-8">
        <div className="relative w-full">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Search properties, projects..." 
            className="w-full bg-white rounded-full py-3.5 pl-12 pr-6 text-[#16273B] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-inter text-[15px]"
          />
        </div>
      </div>

      {/* Right Side: Notification Bell */}
      <div className="relative min-w-[50px] flex justify-end">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="p-2 relative text-white hover:text-gray-300 transition-colors cursor-pointer"
        >
          <Bell size={26} />
          {/* Notification Dot */}
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#EF4444] rounded-full border-2 border-[#16273B]"></span>
        </button>

        {/* Notification Popup Dropdown */}
        {showNotifications && (
          <>
            <div 
              className="fixed inset-0 z-40 cursor-default" 
              onClick={() => setShowNotifications(false)}
            />
            <div className="absolute right-0 mt-4 w-80 bg-white rounded-[24px] shadow-2xl border border-gray-100 z-50 p-6 animate-in fade-in slide-in-from-top-4 duration-200">
               <div className="text-center">
                  <div className="w-14 h-14 bg-[#F8F9FA] rounded-full flex items-center justify-center mx-auto mb-4 text-[#16273B]/50">
                    <Bell size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#16273B] mb-2">Notifications</h3>
                  <p className="text-[#64748B] leading-relaxed">
                    This feature will be implemented soon. Stay tuned!
                  </p>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="mt-6 w-full py-3 bg-[#F8F9FA] hover:bg-gray-100 text-[#16273B] font-medium rounded-xl transition-colors cursor-pointer"
                  >
                    Got it
                  </button>
               </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
