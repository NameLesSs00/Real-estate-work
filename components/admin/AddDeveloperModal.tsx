'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  createDeveloper,
  updateDeveloper,
  uploadDeveloperLogo,
  Developer,
} from '@/lib/api/developers';

interface AddDeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: Developer | null;
}

const EMPTY_FORM = { name: '', description: '' };

export default function AddDeveloperModal({
  isOpen,
  onClose,
  onSuccess,
  editData,
}: AddDeveloperModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = !!editData;

  useEffect(() => {
    if (editData) {
      setForm({ name: editData.name, description: editData.description });
    } else {
      setForm(EMPTY_FORM);
    }
    setLogoFile(null);
    setLogoPreview(null);
    setError('');
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleChange =
    (field: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError('Developer name is required.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      let developerId: number;

      if (isEditMode && editData) {
        const response = await updateDeveloper({
          id: editData.id,
          name: form.name,
          description: form.description,
        });
        developerId = typeof response === 'number' ? response : response.id;
      } else {
        const response = await createDeveloper({
          name: form.name,
          description: form.description,
        });
        developerId = typeof response === 'number' ? response : response.id;
      }

      // Upload logo if one was selected
      if (logoFile && developerId) {
        await uploadDeveloperLogo(developerId, logoFile);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('[AddDeveloperModal] Submit error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-inter"
    >
      <div
        className="bg-white rounded-[24px] w-full max-w-[620px] max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#16273B] rounded-t-[24px] px-8 py-5 flex items-center justify-between shrink-0">
          <h2 className="text-white text-[22px] font-bold">
            {isEditMode ? 'Edit Developer' : 'Add New Developer'}
          </h2>
          <button
            onClick={onClose}
            className="hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent outline-none"
          >
            <Image
              src="/admin/units/addUnit/close-square.png"
              alt="Close"
              width={24}
              height={24}
            />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto space-y-6 scrollbar-hide">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-[#16273B] font-semibold text-[15px]">
              Developer Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              placeholder="Enter developer name"
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#16273B]/20 text-[#16273B] placeholder-gray-400"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[#16273B] font-semibold text-[15px]">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={handleChange('description')}
              placeholder="Enter developer description"
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#16273B]/20 text-[#16273B] placeholder-gray-400 resize-none"
            />
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <label className="text-[#16273B] font-semibold text-[15px]">
              Logo {isEditMode ? '(upload to replace)' : '(optional)'}
            </label>

            {logoPreview ? (
              <div className="relative w-full h-36 border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                <Image src={logoPreview} alt="Logo preview" fill className="object-contain p-4" />
                <button
                  onClick={() => { setLogoFile(null); setLogoPreview(null); }}
                  className="absolute top-2 right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow-md text-gray-600 hover:text-red-500 text-lg font-bold cursor-pointer"
                >
                  ×
                </button>
              </div>
            ) : (
              <label
                htmlFor="logo-upload"
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors cursor-pointer"
              >
                <Image
                  src="/admin/units/addUnit/upload.png"
                  alt="Upload"
                  width={36}
                  height={36}
                  className="mb-3 opacity-60"
                />
                <p className="text-gray-500 font-medium text-sm mb-1">
                  Click to upload logo
                </p>
                <p className="text-gray-400 text-xs">PNG, JPG up to 10MB</p>
              </label>
            )}
            <input
              type="file"
              id="logo-upload"
              className="hidden"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleLogoChange}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Footer */}
        <div className="p-8 pt-0 border-t border-gray-100 flex gap-4 shrink-0">
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
            {isLoading
              ? 'Saving...'
              : isEditMode
              ? 'Save Changes'
              : 'Add Developer'}
          </button>
        </div>
      </div>
    </div>
  );
}
