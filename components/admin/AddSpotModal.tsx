'use client';

import React from 'react';
import Image from 'next/image';

interface SpotData {
  id: number;
  title: string;
  location: string;
  description: string;
  image: string;
  propertyCount?: number;
}

interface AddSpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: SpotData | null;
}

export default function AddSpotModal({ isOpen, onClose, editData }: AddSpotModalProps) {
  if (!isOpen) return null;

  const isEditMode = !!editData;
  const modalTitle = isEditMode ? 'Edit Spot' : 'Add New Spot';
  const submitText = isEditMode ? 'Save Update' : 'Add Spot';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-inter"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="bg-white rounded-[24px] w-full max-w-[800px] max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-[#16273B] rounded-t-[24px] px-8 py-5 flex items-center justify-between shrink-0">
          <h2 className="text-white text-[22px] font-bold">{modalTitle}</h2>
          <button onClick={onClose} className="hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent outline-none">
            <Image src="/admin/units/addUnit/close-square.png" alt="Close" width={24} height={24} />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-8 overflow-y-auto space-y-6 scrollbar-hide">
          
          {/* Spot Name */}
          <div className="space-y-2">
            <label className="text-[#16273B] font-semibold text-[15px]">Spot Name *</label>
            <input 
              type="text" 
              defaultValue={editData?.title || ''}
              placeholder="Enter spot name" 
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#16273B] placeholder-gray-400"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-[#16273B] font-semibold text-[15px]">Location</label>
            <input 
              type="text" 
              defaultValue={editData?.location || ''}
              placeholder="Enter location" 
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#16273B] placeholder-gray-400" 
            />
          </div>

          {/* Number of Properties */}
          <div className="space-y-2">
            <label className="text-[#16273B] font-semibold text-[15px]">Number of Properties</label>
            <input 
              type="number" 
              defaultValue={editData?.propertyCount || ''}
              placeholder="0" 
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#16273B] placeholder-gray-400" 
            />
          </div>

          {/* Image Upload Area */}
          <div className="space-y-2">
            <label className="text-[#16273B] font-semibold text-[15px]">Image</label>
            <div className="border border-dashed border-gray-300 rounded-[16px] p-8 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors cursor-pointer">
              <Image src="/admin/units/addUnit/upload.png" alt="Upload" width={40} height={40} className="mb-4 opacity-70" />
              <p className="text-gray-500 font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-gray-400 text-[13px] mb-6">PNG, JPG up to 10MB</p>
              
              <input type="file" id="image-upload" className="hidden" accept="image/png, image/jpeg" />
              <label 
                htmlFor="image-upload" 
                className="cursor-pointer bg-white border border-gray-200 text-[#16273B] font-semibold px-6 py-2.5 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
              >
                Browse Files
              </label>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-8 pt-4 border-t border-gray-100 flex gap-4 shrink-0 bg-white rounded-b-[24px]">
          <button 
            onClick={onClose}
            className="flex-1 py-4 rounded-xl border border-gray-200 text-[#16273B] font-bold hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            className="flex-1 py-4 rounded-xl bg-[#16273B] hover:bg-[#1a304a] text-white font-bold transition-colors cursor-pointer"
          >
            {submitText}
          </button>
        </div>

      </div>
    </div>
  );
}
