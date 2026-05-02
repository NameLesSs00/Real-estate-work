'use client';

import React from 'react';

export default function RequestsPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-8">
      <div className="bg-white rounded-[24px] shadow-sm border border-[#F0EDE8] p-16 flex flex-col items-center justify-center text-center max-w-[600px] w-full">
        <div className="w-20 h-20 bg-[#F8F5F0] rounded-full flex items-center justify-center mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C7B7A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <h1 className="text-[32px] font-bold text-[#1B2134] font-radley mb-3">
          Units Requests
        </h1>
        <p className="text-[16px] text-[#666] font-poppins mb-8 leading-relaxed">
          We are currently building this section. You will soon be able to review and manage all property requests from here.
        </p>
        <div className="bg-[#1B2134] text-white px-8 py-3 rounded-full text-[15px] font-medium font-poppins shadow-md">
          Coming Soon
        </div>
      </div>
    </div>
  );
}
