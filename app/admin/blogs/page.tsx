'use client';

import React from 'react';
import Image from 'next/image';

export default function BlogsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] font-inter p-10">
      <div className="w-32 h-32 bg-[#F8F9FA] rounded-full flex items-center justify-center mb-8">
        <Image 
          src="/admin/sidebar/blogger.png" 
          alt="Blogs" 
          width={64} 
          height={64} 
          className="opacity-20 grayscale"
        />
      </div>
      <h1 className="text-[32px] font-bold text-[#16273B] mb-4 text-center">
        Blogs Management
      </h1>
      <p className="text-[#64748B] text-[18px] text-center max-w-md leading-relaxed">
        We are working on this feature! Soon you will be able to manage all your property articles and news right from here.
      </p>
      
      <div className="mt-12 px-8 py-3 bg-[#EBF3FF] text-[#1447E6] rounded-full text-[15px] font-bold animate-pulse">
        Coming Soon
      </div>
    </div>
  );
}
