'use client';

import React from 'react';
import Image from 'next/image';

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectTitle?: string;
}

export default function DeleteProjectModal({ isOpen, onClose, onConfirm, projectTitle }: DeleteProjectModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-inter"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="bg-white rounded-[24px] w-full max-w-[500px] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-[#16273B] px-8 py-5 flex items-center justify-between shrink-0">
          <h2 className="text-white text-[20px] font-bold">Delete Project</h2>
          <button onClick={onClose} className="hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent outline-none">
            <Image src="/admin/units/addUnit/close-square.png" alt="Close" width={24} height={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-10 text-center space-y-8">
          <p className="text-[#475467] text-[18px] leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-[#16273B]">{projectTitle || 'this project'}</span>? This action cannot be undone.
          </p>

          {/* Footer Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 py-4 rounded-xl border border-gray-200 text-[#16273B] font-bold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 py-4 rounded-xl bg-[#16273B] hover:bg-[#1a304a] text-white font-bold transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
