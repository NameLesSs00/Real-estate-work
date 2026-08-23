import React from 'react';
import Image from 'next/image';
import BrandLogo from '@/components/BrandLogo';

const AdminSplash = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#000000] z-50 overflow-hidden">
      {/* Background Illustration */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Image
          src="/admin/splash/bg.png"
          alt="Background Buildings"
          fill
          className="object-cover object-bottom pointer-events-none select-none grayscale invert contrast-125"
        />
      </div>

      {/* Center Logo */}
      <div className="relative z-10 flex flex-col items-center animate-pulse">
        <div className="flex h-[220px] w-[260px] items-center justify-center md:h-[320px] md:w-[380px]">
          <BrandLogo
            variant="light"
            lockup="full"
            priority
            className="h-full w-full object-contain"
          />
        </div>
      </div>
      
      {/* Subtle Loading indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="w-full h-full bg-white/40 origin-left animate-loading-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminSplash;
