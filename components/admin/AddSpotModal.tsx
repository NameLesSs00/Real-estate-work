'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createLocation, updateLocation, Location } from '@/lib/api/locations';

interface AddSpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: Location | null;
}

const EMPTY_FORM = { city: '', district: '', street: '', country: '' };

export default function AddSpotModal({ isOpen, onClose, onSuccess, editData }: AddSpotModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // When the modal opens for editing, populate the form
  useEffect(() => {
    if (editData) {
      setForm({
        city: editData.city || '',
        district: editData.district || '',
        street: editData.street || '',
        country: editData.country || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError('');
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const isEditMode = !!editData;

  const handleChange = (field: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.city.trim() || !form.district.trim()) {
      setError('City and District are required.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      if (isEditMode && editData) {
        await updateLocation({
          id: editData.id,
          city: form.city,
          district: form.district,
          street: form.street,
          country: form.country,
          latitude: null,
          longitude: null,
        });
      } else {
        await createLocation({
          city: form.city,
          district: form.district,
          street: form.street,
          country: form.country,
          latitude: null,
          longitude: null,
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('[AddSpotModal] Submit error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-inter"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[24px] w-full max-w-[600px] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#16273B] rounded-t-[24px] px-8 py-5 flex items-center justify-between">
          <h2 className="text-white text-[22px] font-bold">
            {isEditMode ? 'Edit Location' : 'Add New Location'}
          </h2>
          <button onClick={onClose} className="hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent outline-none">
            <Image src="/admin/units/addUnit/close-square.png" alt="Close" width={24} height={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-5">

          {/* City */}
          <div className="space-y-2">
            <label className="text-[#16273B] font-semibold text-[15px]">City *</label>
            <input
              type="text"
              value={form.city}
              onChange={handleChange('city')}
              placeholder="e.g. Cairo"
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#16273B]/20 text-[#16273B] placeholder-gray-400"
            />
          </div>

          {/* District */}
          <div className="space-y-2">
            <label className="text-[#16273B] font-semibold text-[15px]">District *</label>
            <input
              type="text"
              value={form.district}
              onChange={handleChange('district')}
              placeholder="e.g. New Cairo"
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#16273B]/20 text-[#16273B] placeholder-gray-400"
            />
          </div>

          {/* Street */}
          <div className="space-y-2">
            <label className="text-[#16273B] font-semibold text-[15px]">Street</label>
            <input
              type="text"
              value={form.street}
              onChange={handleChange('street')}
              placeholder="e.g. 90th Street (optional)"
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#16273B]/20 text-[#16273B] placeholder-gray-400"
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <label className="text-[#16273B] font-semibold text-[15px]">Country</label>
            <input
              type="text"
              value={form.country}
              onChange={handleChange('country')}
              placeholder="e.g. Egypt (optional)"
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#16273B]/20 text-[#16273B] placeholder-gray-400"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Footer */}
        <div className="p-8 pt-0 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-xl border border-gray-200 text-[#16273B] font-bold hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 py-4 rounded-xl bg-[#16273B] hover:bg-[#1a304a] text-white font-bold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Location'}
          </button>
        </div>
      </div>
    </div>
  );
}
