'use client';

import React from 'react';
import Link from 'next/link';

const ComingSoon = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-8 pt-32">
      <div className="max-w-[600px] w-full text-center space-y-8">
        <div className="inline-block px-6 py-2 bg-[#F8F5F0] rounded-full text-[#C7B7A1] font-bold text-sm tracking-widest uppercase">
          Coming Soon
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-[#1B2134] font-radley italic italic-bold leading-tight">
          {title}
        </h1>
        
        <p className="text-[#666] text-lg md:text-xl font-poppins leading-relaxed">
          {description}
        </p>

        <div className="pt-8">
          <Link 
            href="/"
            className="inline-block bg-[#16273B] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#1a304a] transition-all shadow-xl"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function ContactPage() {
  return (
    <ComingSoon 
      title="Contact Us" 
      description="We're setting up our communication channels to better serve you. Soon you'll be able to reach us through multiple ways!" 
    />
  );
}
