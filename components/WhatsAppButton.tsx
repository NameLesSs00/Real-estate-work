'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

const WhatsAppButton = () => {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  // Hide on admin pages
  if (pathname?.startsWith('/admin')) return null;

  return (
    <div 
      className="fixed bottom-6 right-6 z-[100] hidden md:bottom-8 md:right-8 md:block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip */}
      <div 
        className={`
          absolute bottom-full right-0 mb-4 px-3 py-1.5 bg-brand-primary text-white text-[12px] font-medium rounded-md shadow-lg whitespace-nowrap
          transition-all duration-200 transform origin-bottom
          ${isHovered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'}
        `}
      >
        01200339790
        {/* Tooltip Arrow */}
        <div className="absolute top-full right-[22px] md:right-[26px] -translate-y-px border-[6px] border-transparent border-t-brand-primary"></div>
      </div>

      {/* WhatsApp Icon */}
      <a
        href="https://wa.me/01200339790"
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-14 h-14 md:w-16 md:h-16 bg-social-whatsapp rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 group"
        aria-label="Contact us on WhatsApp"
        title="01200339790"
      >
        <svg 
          width="28" 
          height="28" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="md:w-[32px] md:h-[32px]"
        >
          <path 
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.445 0 .081 5.363.079 11.971c0 2.112.552 4.175 1.599 6.011L0 24l6.149-1.613a11.847 11.847 0 005.897 1.584h.005c6.604 0 11.967-5.363 11.97-11.972a11.85 11.85 0 00-3.561-8.432" 
            fill="currentColor"
          />
        </svg>
      </a>
    </div>
  );
};

export default WhatsAppButton;
