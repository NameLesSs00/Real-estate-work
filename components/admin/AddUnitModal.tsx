import React from 'react';
import Image from 'next/image';
import { Unit } from '@/types/admin';

interface UnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: Unit | null; // Passing null or undefined means "Add Mode"
}

export default function AddUnitModal({ isOpen, onClose, editData }: UnitModalProps) {
  if (!isOpen) return null;

  const isEditMode = !!editData;
  const modalTitle = isEditMode ? 'Edit Unit' : 'Add New Unit';
  const submitText = isEditMode ? 'Update Unit' : 'Add Unit';

  // Helper to extract a plain number from a price string like "$ 850,000"
  const getNumericPrice = (priceStr?: string) => {
    if (!priceStr) return '';
    return priceStr.replace(/[^0-9]/g, '');
  };

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
          <button onClick={onClose} className="hover:opacity-80 transition-opacity cursor-pointer">
            <Image src="/admin/units/addUnit/close-square.png" alt="Close" width={24} height={24} />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-8 overflow-y-auto space-y-6 scrollbar-hide">
          
          {/* Title */}
          <div className="space-y-2">
            <label className="text-[#16273B] font-semibold text-[15px]">Title</label>
            <input 
              type="text" 
              defaultValue={editData?.title || ''}
              placeholder="Enter unit title" 
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#16273B] placeholder-gray-400 "
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[#16273B] font-semibold text-[15px]">Description</label>
            <textarea 
              defaultValue={editData?.subtitle || ''}
              placeholder="Enter unit description" 
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#16273B] placeholder-gray-400 resize-none"
            />
          </div>

          {/* 2-Column Grid Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[#16273B] font-semibold text-[15px]">Price</label>
              <input 
                type="number" 
                defaultValue={getNumericPrice(editData?.price)}
                placeholder="0" 
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#16273B]" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[#16273B] font-semibold text-[15px]">Type</label>
              <div className="relative">
                <select 
                  defaultValue={editData?.type || 'Sell'}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#16273B] appearance-none bg-white"
                >
                  <option value="Sell">Sell</option>
                  <option value="Rent">Rent</option>
                  <option value="Resale">Resale</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                  <Image src="/admin/units/arrow-down.png" alt="Select" width={16} height={16} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[#16273B] font-semibold text-[15px]">Bedrooms</label>
              <input type="number" placeholder="0" className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#16273B]" />
            </div>
            <div className="space-y-2">
              <label className="text-[#16273B] font-semibold text-[15px]">Bathrooms</label>
              <input type="number" placeholder="0" className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#16273B]" />
            </div>

            <div className="space-y-2">
              <label className="text-[#16273B] font-semibold text-[15px]">Status</label>
              <div className="relative">
                <select 
                  defaultValue={editData?.status || 'Available'}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#16273B] appearance-none bg-white"
                >
                  <option value="Available">Available</option>
                  <option value="Sold Out">Sold Out</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                  <Image src="/admin/units/arrow-down.png" alt="Select" width={16} height={16} />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[#16273B] font-semibold text-[15px]">Location</label>
              <input 
                type="text" 
                defaultValue={editData?.location || ''}
                placeholder="Enter location" 
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#16273B]" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[#16273B] font-semibold text-[15px]">Project</label>
              <input type="text" placeholder="Select or enter project name" className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#16273B]" />
            </div>
            <div className="space-y-2">
              <label className="text-[#16273B] font-semibold text-[15px]">Unit size</label>
              <input type="number" placeholder="0" className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#16273B]" />
            </div>
          </div>

          {/* Image Upload Area */}
          <div className="space-y-2">
            <label className="text-[#16273B] font-semibold text-[15px]">Image</label>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50/50">
              <Image src="/admin/units/addUnit/upload.png" alt="Upload" width={40} height={40} className="mb-4 opacity-70" />
              <p className="text-gray-500 font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-gray-400 text-[13px] mb-6">PNG, JPG up to 10MB</p>
              
              <input type="file" id="image-upload" className="hidden" accept="image/png, image/jpeg" multiple />
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
            className="flex-1 py-4 rounded-xl border border-gray-200 text-[#16273B] font-bold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            className="flex-1 py-4 rounded-xl bg-[#16273B] hover:bg-[#1a304a] text-white font-bold transition-colors"
          >
            {submitText}
          </button>
        </div>

      </div>
    </div>
  );
}
