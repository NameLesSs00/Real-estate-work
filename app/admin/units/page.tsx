'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

// Mock data based on the design
const unitsData = [
  {
    id: 1,
    title: "Luxury Penthouse Suite",
    subtitle: "Sky Tower Residences",
    price: "$ 850,000",
    type: "Sell",
    status: "Available",
    location: "Downtown Manhattan"
  },
  {
    id: 2,
    title: "Luxury Penthouse Suite",
    subtitle: "Sky Tower Residences",
    price: "$ 850,000",
    type: "Rent",
    status: "Available",
    location: "Downtown Manhattan"
  },
  {
    id: 3,
    title: "Luxury Penthouse Suite",
    subtitle: "Sky Tower Residences",
    price: "$ 850,000",
    type: "Rent",
    status: "Available",
    location: "Downtown Manhattan"
  },
  {
    id: 4,
    title: "Luxury Penthouse Suite",
    subtitle: "Sky Tower Residences",
    price: "$ 850,000",
    type: "Resale",
    status: "Sold Out",
    location: "Downtown Manhattan"
  }
];

// Helper to get badge colors based on text
const getTypeBadgeStyle = (type: string) => {
  switch (type.toLowerCase()) {
    case 'sell': return 'bg-[#DBEAFE] text-[#1447E6]'; 
    case 'rent': return 'bg-[#F3E8FF] text-[#8200DB]'; 
    case 'resale': return 'bg-[#FFEDD4] text-[#CA3500]'; 
    default: return 'bg-gray-100 text-gray-600';
  }
};

const getStatusBadgeStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'available': return 'bg-[#DCFCE7] text-[#008236]'; 
    case 'sold out': return 'bg-[#FEE2E2] text-[#DC2626]'; 
    default: return 'bg-gray-100 text-gray-600';
  }
};

export default function UnitsPage() {
  return (
    <div className="p-10 min-h-screen font-inter" style={{ backgroundColor: '#F9F9F980' }}>
      <div className="max-w-[1450px] mx-auto space-y-10">
        
        {/* Top Section: Title & Add Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-[30px] font-bold text-[#16273B] mb-1">Units Management</h2>
            <p className="text-gray-500 text-base">Manage all property units</p>
          </div>
          <button className="flex items-center gap-2 bg-[#16273B] hover:bg-[#1a304a] text-white px-8 py-4 rounded-full font-semibold transition-colors shadow-sm">
            <Image src="/admin/units/add.png" alt="Add" width={22} height={22} className="object-contain" />
            <span>Add New Unit</span>
          </button>
        </div>

        {/* Filter & Search Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-8 items-center">
          {/* Search Bar */}
          <div className="w-full lg:w-[480px] relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-50">
              <Image src="/admin/units/search-line.png" alt="Search" width={22} height={22} />
            </div>
            <input 
              type="text" 
              placeholder="Search Unit" 
              className="w-full bg-white border border-gray-100 rounded-full py-4.5 pl-16 pr-8 text-[#16273B] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm text-lg"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-6 w-full lg:w-auto">
            <div className="flex items-center gap-3 text-gray-700 font-bold whitespace-nowrap px-2 text-lg">
              <Image src="/admin/units/filter.png" alt="Filter" width={24} height={24} />
              <span>Filter:</span>
            </div>
            
            <button className="flex items-center justify-between gap-10 bg-white border border-gray-100 rounded-full py-4 px-8 shadow-sm hover:bg-gray-50 transition-colors whitespace-nowrap text-gray-600 min-w-[180px]">
              <span className="font-medium">All Status</span>
              <Image src="/admin/units/arrow-down.png" alt="Dropdown" width={18} height={18} className="opacity-60" />
            </button>
            
            <button className="flex items-center justify-between gap-10 bg-white border border-gray-100 rounded-full py-4 px-8 shadow-sm hover:bg-gray-50 transition-colors whitespace-nowrap text-gray-600 min-w-[180px]">
              <span className="font-medium">All Types</span>
              <Image src="/admin/units/arrow-down.png" alt="Dropdown" width={18} height={18} className="opacity-60" />
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-[28px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[16px] font-bold text-[#16273B]">
                  <th className="py-7 px-10 whitespace-nowrap">Image</th>
                  <th className="py-7 px-4 whitespace-nowrap">Title</th>
                  <th className="py-7 px-4 whitespace-nowrap">Price</th>
                  <th className="py-7 px-4 whitespace-nowrap text-center">Type</th>
                  <th className="py-7 px-4 whitespace-nowrap text-center">Status</th>
                  <th className="py-7 px-4 whitespace-nowrap">Location</th>
                  <th className="py-7 px-10 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {unitsData.map((unit) => (
                  <tr key={unit.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-7 px-10">
                      <Image 
                        src="/admin/units/placeholder.jpg" 
                        alt="Unit" 
                        width={100} 
                        height={75} 
                        className="rounded-xl object-cover shadow-sm"
                      />
                    </td>
                    <td className="py-7 px-4">
                      <h4 className="text-[17px] font-bold text-[#16273B] mb-1">{unit.title}</h4>
                      <p className="text-[15px] text-gray-500">{unit.subtitle}</p>
                    </td>
                    <td className="py-7 px-4">
                      <span className="text-[17px] font-bold text-[#16273B]">{unit.price}</span>
                    </td>
                    <td className="py-7 px-4 text-center">
                      <span className={`inline-flex px-5 py-2 rounded-xl text-[14px] font-bold ${getTypeBadgeStyle(unit.type)}`}>
                        {unit.type}
                      </span>
                    </td>
                    <td className="py-7 px-4 text-center">
                      <span className={`inline-flex px-5 py-2 rounded-xl text-[14px] font-bold ${getStatusBadgeStyle(unit.status)}`}>
                        {unit.status}
                      </span>
                    </td>
                    <td className="py-7 px-4">
                      <div className="flex items-center gap-2 text-gray-500 text-[15px]">
                        <MapPin size={18} className="opacity-70" />
                        <span>{unit.location}</span>
                      </div>
                    </td>
                    <td className="py-7 px-10">
                      <div className="flex items-center justify-end gap-5">
                        <button className="hover:scale-125 transition-transform duration-200">
                          <Image src="/admin/units/view.png" alt="View" width={28} height={28} className="object-contain" />
                        </button>
                        <button className="hover:scale-125 transition-transform duration-200">
                          <Image src="/admin/units/edit.png" alt="Edit" width={28} height={28} className="object-contain" />
                        </button>
                        <button className="hover:scale-125 transition-transform duration-200">
                          <Image src="/admin/units/delete.png" alt="Delete" width={28} height={28} className="object-contain" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
