'use client';

import React from 'react';

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-8">
      <div className="bg-white rounded-[24px] shadow-sm border border-[#F0EDE8] p-16 flex flex-col items-center justify-center text-center max-w-[600px] w-full">
        <div className="w-20 h-20 bg-[#F8F5F0] rounded-full flex items-center justify-center mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C7B7A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
            <path d="M2 2l7.586 7.586"></path>
            <circle cx="11" cy="11" r="2"></circle>
          </svg>
        </div>
        <h1 className="text-[32px] font-bold text-[#1B2134] font-radley mb-3">
          Blogs
        </h1>
        <p className="text-[16px] text-[#666] font-poppins mb-8 leading-relaxed">
          We are currently building this section. You will soon be able to write and manage all your articles from here.
        </p>
        <div className="bg-[#1B2134] text-white px-8 py-3 rounded-full text-[15px] font-medium font-poppins shadow-md">
          Coming Soon
        </div>
      </div>
    </div>
  );
}
