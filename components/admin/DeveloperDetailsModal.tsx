'use client';

import React from 'react';
import Image from 'next/image';
import { Developer } from '@/types/admin';

interface DeveloperDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  developer?: Developer | null;
}

// Info card helper
const InfoCard = ({ icon, label, value, fullWidth = false }: { icon: string; label: string; value: string; fullWidth?: boolean }) => (
  <div className={`bg-[#F9F6F2] rounded-2xl px-6 py-5 flex flex-col justify-center ${fullWidth ? 'col-span-2' : ''}`}>
    <div className="flex items-center gap-2 text-gray-500 text-[14px] mb-1">
      <div className="relative w-4 h-4 flex items-center justify-center">
        <Image src={icon} alt={label} width={16} height={16} className="object-contain opacity-70" />
      </div>
      <span className="capitalize">{label}</span>
    </div>
    <p className="text-[#16273B] text-[18px] font-bold">{value}</p>
  </div>
);

export default function DeveloperDetailsModal({ isOpen, onClose, developer }: DeveloperDetailsModalProps) {
  if (!isOpen || !developer) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-inter"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="bg-white rounded-[32px] w-full max-w-[800px] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#16273B] px-8 py-5 flex items-center justify-between shrink-0">
          <h2 className="text-white text-[20px] font-bold">Developer Details</h2>
          <button onClick={onClose} className="hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent outline-none">
            <Image src="/admin/units/details/close-square.png" alt="Close" width={26} height={26} />
          </button>
        </div>

        {/* Body */}
        <div className="p-10 space-y-8 overflow-y-auto max-h-[80vh] scrollbar-hide">
          
          {/* Logo and Name */}
          <div className="flex items-center gap-6">
            <div className="w-[100px] h-[52px] relative rounded-xl overflow-hidden bg-black flex items-center justify-center shrink-0">
              <Image 
                src={developer.logo} 
                alt={developer.name} 
                width={80} 
                height={40} 
                className="object-contain"
              />
            </div>
            <h3 className="text-[28px] font-bold text-[#16273B]">{developer.name}</h3>
          </div>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-2 gap-4">
            <InfoCard
              icon="/admin/units/details/price.png"
              label="Email"
              value={developer.contactEmail}
            />
            <InfoCard
              icon="/admin/units/details/location.png"
              label="Phone"
              value={developer.contactPhone}
            />
            <InfoCard
              icon="/admin/units/details/project.png"
              label="Number of Projects"
              value={developer.projectCount.toString()}
              fullWidth={true}
            />
          </div>

        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-100 shrink-0 flex justify-end bg-white">
          <button
            onClick={onClose}
            className="bg-[#16273B] hover:bg-[#1a304a] text-white font-bold px-20 py-4 rounded-2xl transition-all active:scale-95 cursor-pointer shadow-lg hover:shadow-xl"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
