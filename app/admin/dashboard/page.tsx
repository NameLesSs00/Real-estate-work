import React from 'react';

export default function DashboardPage() {
  return (
    <div className="p-10 min-h-screen bg-[#F8F9FA] font-inter">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#16273B] mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-medium mb-2 uppercase text-sm">Total Properties</h3>
            <p className="text-4xl font-bold text-[#16273B]">24</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-medium mb-2 uppercase text-sm">Active Inquiries</h3>
            <p className="text-4xl font-bold text-[#16273B]">12</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-medium mb-2 uppercase text-sm">Pending Reviews</h3>
            <p className="text-4xl font-bold text-[#16273B]">5</p>
          </div>
        </div>
        
        <div className="mt-10 bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 min-h-[400px] flex items-center justify-center">
          <p className="text-gray-400 text-lg italic">Welcome back, Admin. Dashboard statistics are currently being loaded...</p>
        </div>
      </div>
    </div>
  );
}
