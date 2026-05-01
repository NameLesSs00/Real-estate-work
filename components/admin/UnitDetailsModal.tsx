import React from 'react';
import Image from 'next/image';
import { Unit } from '@/types/admin';

interface UnitDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit?: Unit | null;
}

// Info card helper
const InfoCard = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div className="bg-[#F9F6F2] rounded-2xl px-6 py-5">
    <div className="flex items-center gap-2 text-gray-500 text-[14px] mb-2">
      <Image src={icon} alt={label} width={18} height={18} className="object-contain opacity-70" />
      <span>{label}</span>
    </div>
    <p className="text-[#16273B] text-[20px] font-bold">{value}</p>
  </div>
);

export default function UnitDetailsModal({ isOpen, onClose, unit }: UnitDetailsModalProps) {
  if (!isOpen || !unit) return null;

  const galleryImages = [
    '/admin/units/details/img1.png',
    '/admin/units/details/img2.png',
    '/admin/units/details/img3.png',
    '/admin/units/details/img4.png',
  ];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-inter"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="bg-white rounded-[24px] w-full max-w-[860px] max-h-[92vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#16273B] px-8 py-5 flex items-center justify-between shrink-0">
          <h2 className="text-white text-[20px] font-bold">Unit Details</h2>
          <button onClick={onClose} className="hover:opacity-80 transition-opacity cursor-pointer">
            <Image src="/admin/units/details/close-square.png" alt="Close" width={26} height={26} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto scrollbar-hide flex-1">
          <div className="p-8 space-y-6">

            {/* Image Gallery */}
            <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[380px]">
              {/* Main large image — spans 2 rows on the left */}
              <div className="col-span-1 row-span-2 relative rounded-2xl overflow-hidden">
                <Image
                  src="/admin/units/details/mainImg.png"
                  alt="Main"
                  fill
                  className="object-cover"
                />
              </div>
              {/* 4 smaller images on the right 2 columns */}
              {galleryImages.map((src, idx) => (
                <div key={idx} className="relative rounded-2xl overflow-hidden">
                  <Image src={src} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>

            {/* Title & Badges */}
            <div className="space-y-3">
              <h3 className="text-[26px] font-bold text-[#16273B]">{unit.title}</h3>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1.5 rounded-lg text-[14px] font-bold ${getTypeBadgeStyle(unit.type)}`}>
                  {unit.type}
                </span>
                <span className={`px-4 py-1.5 rounded-lg text-[14px] font-bold ${getStatusBadgeStyle(unit.status)}`}>
                  {unit.status}
                </span>
              </div>
            </div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              <InfoCard
                icon="/admin/units/details/price.png"
                label="Price"
                value={unit.price}
              />
              <InfoCard
                icon="/admin/units/details/location.png"
                label="Location"
                value={unit.location}
              />
              <InfoCard
                icon="/admin/units/details/project.png"
                label="Project"
                value={unit.subtitle || 'Sky Tower Residences'}
              />
              <InfoCard
                icon="/admin/units/details/size.png"
                label="size"
                value="70m"
              />
              <InfoCard
                icon="/admin/units/details/lucide_bed.png"
                label="Bedroom"
                value="3"
              />
              <InfoCard
                icon="/admin/units/details/cil_bath.png"
                label="Bathroom"
                value="2"
              />
            </div>

            {/* Description */}
            <div className="bg-[#F9F6F2] rounded-2xl px-6 py-5">
              <div className="flex items-center gap-2 text-gray-500 text-[14px] mb-2">
                <Image src="/admin/units/details/Description.png" alt="Description" width={18} height={18} className="object-contain opacity-70" />
                <span>Description</span>
              </div>
              <p className="text-[#16273B] text-[16px] leading-relaxed">
                {unit.description || 'Stunning penthouse with panoramic city views'}
              </p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 shrink-0 flex justify-end bg-white">
          <button
            onClick={onClose}
            className="bg-[#16273B] hover:bg-[#1a304a] text-white font-bold px-14 py-4 rounded-full transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

// Badge helpers (duplicated here to keep the modal self-contained)
function getTypeBadgeStyle(type: string) {
  switch (type?.toLowerCase()) {
    case 'sell': return 'bg-[#DBEAFE] text-[#1447E6]';
    case 'rent': return 'bg-[#F3E8FF] text-[#8200DB]';
    case 'resale': return 'bg-[#FFEDD4] text-[#CA3500]';
    default: return 'bg-gray-100 text-gray-600';
  }
}

function getStatusBadgeStyle(status: string) {
  switch (status?.toLowerCase()) {
    case 'available': return 'bg-[#DCFCE7] text-[#008236]';
    case 'sold out': return 'bg-[#FEE2E2] text-[#DC2626]';
    default: return 'bg-gray-100 text-gray-600';
  }
}
