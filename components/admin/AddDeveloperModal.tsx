'use client';

import React from 'react';
import Image from 'next/image';
import { Developer } from '@/types/admin';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: Developer | null;
}

export default function AddDeveloperModal({ isOpen, onClose, editData }: DeveloperModalProps) {
  if (!isOpen) return null;

  const isEditMode = !!editData;
  const modalTitle = isEditMode ? 'Edit Developer' : 'Add New Developer';
  const submitText = isEditMode ? 'Save Update' : 'Add developer';

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
          
          {/* Developer Name */}
          <div className="space-y-2">
            <label className="text-[#16273B] font-semibold text-[15px]">Developer Name *</label>
            <input 
              type="text" 
              defaultValue={editData?.name || ''}
              placeholder="Enter developer name" 
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#16273B] placeholder-gray-400 "
            />
          </div>

          {/* Grid Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[#16273B] font-semibold text-[15px]">Email</label>
              <input 
                type="email" 
                defaultValue={editData?.contactEmail || ''}
                placeholder="Enter email address" 
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#16273B]" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[#16273B] font-semibold text-[15px]">Phone</label>
              <input 
                type="text" 
                defaultValue={editData?.contactPhone || ''}
                placeholder="Enter phone number" 
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#16273B]" 
              />
            </div>
          </div>

          {/* Number of Projects */}
          <div className="space-y-2">
            <label className="text-[#16273B] font-semibold text-[15px]">Number of Projects</label>
            <input 
              type="number" 
              defaultValue={editData?.projectCount || ''}
              placeholder="0" 
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#16273B]" 
            />
          </div>

          {/* Logo Image Upload Area */}
          <div className="space-y-2">
            <label className="text-[#16273B] font-semibold text-[15px]">Logo image</label>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50/50">
              <Image src="/admin/units/addUnit/upload.png" alt="Upload" width={40} height={40} className="mb-4 opacity-70" />
              <p className="text-gray-500 font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-gray-400 text-[13px] mb-6">PNG, JPG up to 10MB</p>
              
              <input type="file" id="logo-upload" className="hidden" accept="image/png, image/jpeg" />
              <label 
                htmlFor="logo-upload" 
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
