'use client';

import React from 'react';
import Image from 'next/image';
import { Project } from '@/types/admin';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
}

// Info card helper
const InfoCard = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div className="bg-[#F9F6F2] rounded-2xl px-6 py-5 flex flex-col justify-center">
    <div className="flex items-center gap-2 text-gray-500 text-[14px] mb-1">
      <div className="relative w-4 h-4 flex items-center justify-center">
        <Image src={icon} alt={label} width={16} height={16} className="object-contain opacity-70" />
      </div>
      <span className="capitalize">{label}</span>
    </div>
    <p className="text-[#16273B] text-[18px] font-bold">{value}</p>
  </div>
);

export default function ProjectDetailsModal({ isOpen, onClose, project }: ProjectDetailsModalProps) {
  if (!isOpen || !project) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-inter"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="bg-white rounded-[32px] w-full max-w-[860px] max-h-[95vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#16273B] px-8 py-5 flex items-center justify-between shrink-0">
          <h2 className="text-white text-[20px] font-bold">Project Details</h2>
          <button onClick={onClose} className="hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent outline-none">
            <Image src="/admin/units/details/close-square.png" alt="Close" width={26} height={26} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto scrollbar-hide flex-1">
          <div className="p-8 space-y-8">

            {/* Banner Image */}
            <div className="relative w-full aspect-[21/9] rounded-[24px] overflow-hidden shadow-sm">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Title */}
            <h3 className="text-[28px] font-bold text-[#16273B]">{project.title}</h3>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InfoCard
                icon="/admin/units/details/price.png"
                label="Price"
                value={project.price || '$850,000'}
              />
              <InfoCard
                icon="/admin/units/details/location.png"
                label="Location"
                value={project.location}
              />
              <InfoCard
                icon="/admin/units/details/project.png"
                label="Number of units"
                value={project.unitCount.toString()}
              />
              <InfoCard
                icon="/admin/units/details/size.png"
                label="size"
                value={project.unitSize || '300m'}
              />
              <InfoCard
                icon="/admin/sidebar/receipt-search.png" 
                label="Delivery time"
                value={project.deliveryDate || '11/25/2030'}
              />
              <InfoCard
                icon="/admin/sidebar/profile-2user.png"
                label="Developer"
                value={project.developer}
              />
            </div>

            {/* Description */}
            <div className="bg-[#F9F6F2] rounded-[24px] px-8 py-6">
              <div className="flex items-center gap-2 text-gray-500 text-[15px] mb-3">
                <Image src="/admin/units/details/Description.png" alt="Description" width={18} height={18} className="object-contain opacity-70" />
                <span className="font-medium">Description</span>
              </div>
              <p className="text-[#16273B] text-[17px] leading-relaxed">
                {project.description || 'Stunning penthouse with panoramic city views'}
              </p>
            </div>

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
