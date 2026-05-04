'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, User, FileText } from 'lucide-react';
import { getLeads, Lead } from '@/lib/api/leads';
import { getRequests, RequestItem } from '@/lib/api/requests';

interface NotificationItem {
  id: string;
  type: 'lead' | 'request';
  title: string;
  subtitle: string;
  date: Date;
  isNew: boolean;
}

export default function AdminHeader() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const storedName = localStorage.getItem('adminName');
    if (storedName) {
      setAdminName(storedName);
    }
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [leadsRes, reqsRes] = await Promise.all([
          getLeads(1, 10).catch(() => ({ items: [] })),
          getRequests(1, 10).catch(() => ({ items: [] }))
        ]);

        const recentLeads = (leadsRes.items || []).map((l: Lead) => ({
          id: `lead-${l.id}`,
          type: 'lead' as const,
          title: `New Lead: ${l.fullName}`,
          subtitle: l.email,
          date: new Date(l.createdAt),
          isNew: l.statusLead === '0' || l.statusLead === 'Pending' || l.statusLead === 'New', // Assuming 0 is new
        }));

        const recentReqs = (reqsRes.items || []).map((r: RequestItem) => ({
          id: `req-${r.id}`,
          type: 'request' as const,
          title: `Unit Request: ${r.unitName}`,
          subtitle: `By ${r.applicantName}`,
          date: new Date(r.createdAt),
          isNew: r.status === '0' || r.status === 'Pending', // Assuming 0 is pending
        }));

        const all = [...recentLeads, ...recentReqs]
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .slice(0, 5);

        setNotifications(all);
        setUnreadCount(all.filter(n => n.isNew).length);
      } catch (err) {
        console.error('[AdminHeader] Error fetching notifications', err);
      }
    };
    fetchNotifications();
    
    // Optional: Set up an interval to poll for new notifications
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
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
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-[#EF4444] rounded-full border-2 border-[#16273B] animate-pulse"></span>
          )}
        </button>

        {/* Notification Popup Dropdown */}
        {showNotifications && (
          <>
            <div 
              className="fixed inset-0 z-40 cursor-default" 
              onClick={() => setShowNotifications(false)}
            />
            <div className="absolute right-0 mt-4 w-96 bg-white rounded-[24px] shadow-2xl border border-gray-100 z-50 p-6 animate-in fade-in slide-in-from-top-4 duration-200">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-xl font-bold text-[#16273B]">Notifications</h3>
                 {unreadCount > 0 && (
                   <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                     {unreadCount} New
                   </span>
                 )}
               </div>
               
               <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin pr-2">
                 {notifications.length === 0 ? (
                   <p className="text-center text-gray-500 py-6">No recent notifications.</p>
                 ) : (
                   notifications.map(n => (
                     <div key={n.id} className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                       <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${n.type === 'lead' ? 'bg-indigo-50 text-indigo-500' : 'bg-amber-50 text-amber-500'}`}>
                         {n.type === 'lead' ? <User size={20} /> : <FileText size={20} />}
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-[14px] font-bold text-[#16273B] truncate flex items-center gap-2">
                           {n.title}
                           {n.isNew && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                         </p>
                         <p className="text-[13px] text-gray-500 truncate mt-0.5">{n.subtitle}</p>
                         <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
                           {n.date.toLocaleDateString()} {n.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         </p>
                       </div>
                     </div>
                   ))
                 )}
               </div>

               <button 
                 onClick={() => setShowNotifications(false)}
                 className="mt-4 w-full py-3 bg-[#F8F9FA] hover:bg-gray-100 text-[#16273B] font-semibold rounded-xl transition-colors cursor-pointer"
               >
                 Close
               </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
