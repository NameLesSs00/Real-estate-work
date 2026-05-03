'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createProject, updateProject, uploadProjectImages, Project } from '@/lib/api/projects';
import { getDevelopers } from '@/lib/api/developers';
import { getLocations } from '@/lib/api/locations';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: Project | null;
}

interface DropdownOption { id: number; label: string; }

const EMPTY_FORM = { name: '', description: '', developerId: null as number | null, locationId: null as number | null };

export default function AddProjectModal({ isOpen, onClose, onSuccess, editData }: AddProjectModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [developers, setDevelopers] = useState<DropdownOption[]>([]);
  const [locations, setLocations] = useState<DropdownOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = !!editData;

  // Load dropdown options
  useEffect(() => {
    if (!isOpen) return;

    const fetchAllDevelopers = async () => {
      let page = 1;
      let all: DropdownOption[] = [];
      try {
        while (true) {
          const res = await getDevelopers(page);
          all = [...all, ...res.items.map(item => ({ id: item.id, label: item.name }))];
          if (!res.hasNextPage) break;
          page++;
        }
        setDevelopers(all);
      } catch (err) {
        console.error('[AddProjectModal] Failed to fetch developers', err);
      }
    };

    const fetchAllLocations = async () => {
      let page = 1;
      let all: DropdownOption[] = [];
      try {
        while (true) {
          const res = await getLocations(page);
          all = [...all, ...res.items.map(item => ({ 
            id: item.id, 
            label: [item.city, item.district, item.street, item.country].filter(Boolean).join(' - ') 
          }))];
          if (!res.hasNextPage) break;
          page++;
        }
        setLocations(all);
      } catch (err) {
        console.error('[AddProjectModal] Failed to fetch locations', err);
      }
    };

    fetchAllDevelopers();
    fetchAllLocations();
  }, [isOpen]);

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        description: editData.description,
        developerId: editData.developerId,
        locationId: editData.locationId,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setImageFiles([]);
    setImagePreviews([]);
    setError('');
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const val = e.target.value;
      if (field === 'developerId' || field === 'locationId') {
        setForm((prev) => ({ ...prev, [field]: val === '' ? null : Number(val) }));
      } else {
        setForm((prev) => ({ ...prev, [field]: val }));
      }
    };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setImageFiles(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('Project name is required.'); return; }
    setIsLoading(true); setError('');
    try {
      let projectId: number;
      if (isEditMode && editData) {
        const res = await updateProject(editData.id, {
          id: editData.id,
          name: { en: form.name, de: form.name, pl: form.name },
          description: { en: form.description, de: form.description, pl: form.description },
          developerId: form.developerId,
        });
        projectId = typeof res === 'number' ? res : res.id;
      } else {
        const res = await createProject({
          name: { en: form.name, de: form.name, pl: form.name },
          description: { en: form.description, de: form.description, pl: form.description },
          developerId: form.developerId,
          locationId: form.locationId
        });
        projectId = typeof res === 'number' ? res : res.id;
      }
      if (imageFiles.length > 0) await uploadProjectImages(projectId, imageFiles);
      onSuccess(); onClose();
    } catch (err) {
      console.error('[AddProjectModal]', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-inter" onClick={onClose}>
      <div className="bg-white rounded-[24px] w-full max-w-[680px] max-h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-[#16273B] rounded-t-[24px] px-8 py-5 flex items-center justify-between shrink-0">
          <h2 className="text-white text-[22px] font-bold">{isEditMode ? 'Edit Project' : 'Add New Project'}</h2>
          <button onClick={onClose} className="hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent outline-none">
            <Image src="/admin/units/addUnit/close-square.png" alt="Close" width={24} height={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto space-y-6 scrollbar-hide">

          {/* Name */}
          <div className="space-y-2">
            <label className="text-[#16273B] font-semibold text-[15px]">Project Name *</label>
            <input type="text" value={form.name} onChange={handleChange('name')} placeholder="Enter project name"
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#16273B]/20 text-[#16273B] placeholder-gray-400" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[#16273B] font-semibold text-[15px]">Description</label>
            <textarea value={form.description} onChange={handleChange('description')} placeholder="Enter project description" rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#16273B]/20 text-[#16273B] placeholder-gray-400 resize-none" />
          </div>

          {/* Developer + Location dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[#16273B] font-semibold text-[15px]">Developer</label>
              <select value={form.developerId ?? ''} onChange={handleChange('developerId')}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#16273B]/20 text-[#16273B] bg-white cursor-pointer">
                <option value="">— None —</option>
                {developers.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
              </select>
            </div>
            {!isEditMode && (
              <div className="space-y-2">
                <label className="text-[#16273B] font-semibold text-[15px]">Location</label>
                <select value={form.locationId ?? ''} onChange={handleChange('locationId')}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#16273B]/20 text-[#16273B] bg-white cursor-pointer"
                  disabled={isEditMode}>
                  <option value="">— None —</option>
                  {locations.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
                </select>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-[#16273B] font-semibold text-[15px]">Images (optional)</label>
            {imagePreviews.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-gray-100">
                    <Image src={src} alt="preview" fill className="object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <label htmlFor="proj-img-upload"
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors cursor-pointer">
                <Image src="/admin/units/addUnit/upload.png" alt="Upload" width={36} height={36} className="mb-3 opacity-60" />
                <p className="text-gray-500 font-medium text-sm mb-1">Click to upload images</p>
                <p className="text-gray-400 text-xs">PNG, JPG, WEBP</p>
              </label>
            )}
            <input type="file" id="proj-img-upload" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
            {imagePreviews.length > 0 && (
              <label htmlFor="proj-img-upload" className="inline-block text-[13px] text-[#16273B] underline cursor-pointer">Change images</label>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Footer */}
        <div className="p-8 pt-0 border-t border-gray-100 flex gap-4 shrink-0">
          <button onClick={onClose} className="flex-1 py-4 rounded-xl border border-gray-200 text-[#16273B] font-bold hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
          <button onClick={handleSubmit} disabled={isLoading}
            className="flex-1 py-4 rounded-xl bg-[#16273B] hover:bg-[#1a304a] text-white font-bold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
            {isLoading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Project'}
          </button>
        </div>
      </div>
    </div>
  );
}
