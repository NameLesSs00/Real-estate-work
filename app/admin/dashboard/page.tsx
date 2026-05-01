import React from 'react';
import Image from 'next/image';

const stats = [
  { 
    title: "Total Units", 
    value: "248", 
    icon: "/admin/dashbaord/units.png", 
    bg: "bg-white border border-gray-100", 
    textCol: "text-[#16273B]", 
    subText: "text-gray-500", 
    iconBg: "bg-[#EEF0F5]" 
  },
  { 
    title: "Active Projects", 
    value: "32", 
    icon: "/admin/dashbaord/activeProject.png", 
    bg: "bg-[#1B2134]", 
    textCol: "text-white", 
    subText: "text-gray-400", 
    iconBg: "bg-[#F3E8FF]" 
  },
  { 
    title: "Developers", 
    value: "18", 
    icon: "/admin/dashbaord/developers.png", 
    bg: "bg-white border border-gray-100", 
    textCol: "text-[#16273B]", 
    subText: "text-gray-500", 
    iconBg: "bg-[#EEF0F5]" 
  },
  { 
    title: "Revenue", 
    value: "$2.4M", 
    icon: "/admin/dashbaord/revenue.png", 
    bg: "bg-[#1B2134]", 
    textCol: "text-white", 
    subText: "text-gray-400", 
    iconBg: "bg-[#F3E8FF]" 
  },
];

const recentUnits = Array(5).fill({
  title: "Luxury Apartment 1",
  location: "Downtown District",
  price: "$450,000",
  status: "Available"
});

const pendingRequests = Array(5).fill({
  title: "Unit Request #1",
  owner: "Owner: John Doe"
});

export default function DashboardPage() {
  return (
    <div className="p-10 min-h-screen font-inter" style={{ backgroundColor: '#F9F9F980' }}>
      <div className="max-w-[1400px] mx-auto">
        
        {/* Dashboard Title & Subtitle */}
        <div className="mb-10">
          <h2 className="text-[32px] font-bold text-[#16273B] mb-2">Dashboard Overview</h2>
          <p className="text-[#64748B] text-lg">Welcome back! Here's what's happening today.</p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div key={idx} className={`${stat.bg} p-6 rounded-[24px] shadow-sm flex flex-col justify-between h-[160px]`}>
              <div className={`${stat.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center`}>
                <Image src={stat.icon} alt={stat.title} width={24} height={24} className="object-contain" />
              </div>
              <div className="mt-4">
                <h3 className={`${stat.subText} text-[15px] font-medium mb-1`}>{stat.title}</h3>
                <p className={`${stat.textCol} text-[32px] font-bold leading-none`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Recent Units */}
          <div>
            <h3 className="text-[22px] font-bold text-[#16273B] mb-5">Recent Units</h3>
            <div className="p-6 rounded-[32px] space-y-5" style={{ backgroundColor: '#F8F5F080' }}>
              {recentUnits.map((unit, idx) => (
                <div key={idx} className="bg-white rounded-[24px] p-5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-6">
                    <Image 
                      src="/admin/dashbaord/placeHolder.png" 
                      alt={unit.title} 
                      width={120} 
                      height={90} 
                      className="rounded-2xl object-cover"
                    />
                    <div>
                      <h4 className="text-[19px] font-bold text-[#16273B]">{unit.title}</h4>
                      <p className="text-[15px] text-gray-500 mt-1">{unit.location}</p>
                    </div>
                  </div>
                  <div className="text-right pr-2">
                    <p className="text-[20px] font-bold text-[#16273B]">{unit.price}</p>
                    <p className="text-[14px] font-medium text-[#22C55E] mt-1">{unit.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Pending Requests */}
          <div>
            <h3 className="text-[22px] font-bold text-[#16273B] mb-5">Pending Requests</h3>
            <div className="p-6 rounded-[32px] space-y-5" style={{ backgroundColor: '#F8F5F080' }}>
              {pendingRequests.map((req, idx) => (
                <div key={idx} className="bg-white rounded-[24px] p-6 flex items-center justify-between shadow-sm">
                  <div>
                    <h4 className="text-[18px] font-bold text-[#16273B]">{req.title}</h4>
                    <p className="text-[15px] text-gray-500 mt-1">{req.owner}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-6 py-2.5 bg-[#Ecfdf3] text-[#027A48] rounded-xl text-[14px] font-semibold hover:bg-green-100 transition-colors">
                      Accept
                    </button>
                    <button className="px-6 py-2.5 bg-[#FEF3F2] text-[#B42318] rounded-xl text-[14px] font-semibold hover:bg-red-100 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
