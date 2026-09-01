'use client';

import React, { useState } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import Image from 'next/image';
import { deleteUnit } from '@/lib/api/projects';

interface DeleteUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  unitId: number | null;
  unitName?: string;
}

export default function DeleteUnitModal({ isOpen, onClose, onSuccess, unitId, unitName }: DeleteUnitModalProps) {
  useBodyScrollLock(isOpen);
  useEscapeKey(onClose, isOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!unitId) return;
    setIsLoading(true); setError('');
    try {
      await deleteUnit(unitId);
      onSuccess(); onClose();
    } catch (err) {
      console.error('[DeleteUnitModal]', err);
      setError('Failed to delete unit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-inter">
      <div className="bg-white rounded-[24px] w-full max-w-[500px] flex flex-col shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>

        <div className="bg-brand-primary px-8 py-5 flex items-center justify-between shrink-0">
          <h2 className="text-white text-[20px] font-bold">Delete Unit</h2>
          <button onClick={onClose} className="hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent outline-none">
            <Image src="/admin/units/addUnit/close-square.png" alt="Close" width={24} height={24} />
          </button>
        </div>

        <div className="p-10 text-center space-y-6">
          <p className="text-admin-muted text-[18px] leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-brand-primary">{unitName || 'this unit'}</span>? This action cannot be undone.
          </p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 py-4 rounded-xl border border-gray-200 text-brand-primary font-bold hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
            <button onClick={handleConfirm} disabled={isLoading}
              className="flex-1 py-4 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-bold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
