'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { deleteLocation } from '@/lib/api/locations';

interface DeleteSpotModalProps {
  isOpen: boolean;
  locationId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteSpotModal({ isOpen, locationId, onClose, onSuccess }: DeleteSpotModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!locationId) return;
    setIsLoading(true);
    setError('');
    try {
      await deleteLocation(locationId);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('[DeleteSpotModal] Delete error:', err);
      setError('Failed to delete. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-inter"
    >
      <div
        className="bg-white rounded-[24px] w-full max-w-[500px] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#16273B] px-8 py-5 flex items-center justify-between">
          <h2 className="text-white text-[20px] font-bold">Delete Location</h2>
          <button onClick={onClose} className="hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent outline-none">
            <Image src="/admin/units/addUnit/close-square.png" alt="Close" width={24} height={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-10 text-center space-y-6">
          <p className="text-[#475467] text-[18px] leading-relaxed">
            Are you sure you want to delete this location? This action cannot be undone.
          </p>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-xl border border-gray-200 text-[#16273B] font-bold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 py-4 rounded-xl bg-[#16273B] hover:bg-[#1a304a] text-white font-bold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
