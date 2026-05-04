'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createProject, updateProject, uploadProjectImages, Project, LocalizedString } from '@/lib/api/projects';
import { getDevelopers } from '@/lib/api/developers';
import { getLocations } from '@/lib/api/locations';
import { getFacilities, createFacility, Facility } from '@/lib/api/facilities';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: Project | null;
}

interface DropdownOption { id: number; label: string; }

const EMPTY_FORM = { 
  name: { en: '', de: '', pl: '' }, 
  description: { en: '', de: '', pl: '' }, 
  developerId: null as number | null, 
  locationId: null as number | null,
  facilityIds: [] as number[]
};

export default function AddProjectModal({ isOpen, onClose, onSuccess, editData }: AddProjectModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [developers, setDevelopers] = useState<DropdownOption[]>([]);
  const [locations, setLocations] = useState<DropdownOption[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Quick-add facility state
  const [isAddingFacility, setIsAddingFacility] = useState(false);
  const [newFacilityName, setNewFacilityName] = useState({ en: '', de: '', pl: '' });
  const [isSubmittingQuick, setIsSubmittingQuick] = useState(false);

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

    const fetchAllFacilities = async () => {
      try {
        const res = await getFacilities();
        setFacilities(res);
      } catch (err) {
        console.error('[AddProjectModal] Failed to fetch facilities', err);
      }
    };

    fetchAllDevelopers();
    fetchAllLocations();
    fetchAllFacilities();
  }, [isOpen]);

  const refreshFacilities = async () => {
    try {
      const res = await getFacilities();
      setFacilities(res);
    } catch (err) {
      console.error('[AddProjectModal] Failed to refresh facilities', err);
    }
  };

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      setForm({
        name: typeof editData.name === 'string' ? { en: editData.name, de: editData.name, pl: editData.name } : editData.name,
        description: typeof editData.description === 'string' ? { en: editData.description, de: editData.description, pl: editData.description } : editData.description,
        developerId: editData.developerId,
        locationId: editData.locationId,
        facilityIds: (editData as Project & { facilityIds?: number[] }).facilityIds || []
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setImageFiles([]);
    setImagePreviews([]);
    setError('');
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof typeof EMPTY_FORM, lang?: keyof LocalizedString) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const val = e.target.value;
      if (field === 'developerId' || field === 'locationId') {
        setForm((prev) => ({ ...prev, [field]: val === '' ? null : Number(val) }));
      } else if (lang) {
        setForm((prev) => ({
          ...prev,
          [field]: { ...((prev[field] as Record<string, string>) || {}), [lang]: val }
        }));
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
    if (!form.name.en.trim()) { setError('Project name (English) is required.'); return; }
    setIsLoading(true); setError('');
    try {
      let projectId: number;
      if (isEditMode && editData) {
        const res = await updateProject(editData.id, {
          id: editData.id,
          name: form.name,
          description: form.description,
          developerId: form.developerId,
          locationId: form.locationId,
          facilityIds: form.facilityIds,
        });
        projectId = typeof res === 'number' ? res : res.id;
      } else {
        const res = await createProject({
          name: form.name,
          description: form.description,
          developerId: form.developerId,
          locationId: form.locationId,
          facilityIds: form.facilityIds,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-inter">
      <div className="bg-white rounded-[32px] w-full max-w-[900px] max-h-[92vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-[#16273B] rounded-t-[24px] px-8 py-5 flex items-center justify-between shrink-0">
          <h2 className="text-white text-[22px] font-bold">{isEditMode ? 'Edit Project' : 'Add New Project'}</h2>
          <button onClick={onClose} className="hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent outline-none">
            <Image src="/admin/units/addUnit/close-square.png" alt="Close" width={24} height={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-10 overflow-y-auto space-y-10 scrollbar-hide">
          
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/50 p-6 rounded-[28px] border border-gray-100">
            <div className="space-y-3">
              <label className="text-[#16273B] font-bold text-[16px] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#16273B]"></span>
                Developer
              </label>
              <select value={form.developerId ?? ''} onChange={handleChange('developerId')}
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-[#16273B]/5 text-[#16273B] bg-white cursor-pointer shadow-sm transition-all hover:border-[#16273B]/30">
                <option value="">— None —</option>
                {developers.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
              </select>
            </div>
            {!isEditMode && (
              <div className="space-y-3">
                <label className="text-[#16273B] font-bold text-[16px] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#16273B]"></span>
                  Location
                </label>
                <select value={form.locationId ?? ''} onChange={handleChange('locationId')}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-[#16273B]/5 text-[#16273B] bg-white cursor-pointer shadow-sm transition-all hover:border-[#16273B]/30">
                  <option value="">— None —</option>
                  {locations.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
                </select>
              </div>
            )}
          </div>

          {/* Language Specific Content */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-100"></div>
              <span className="text-gray-400 font-bold text-xs tracking-widest uppercase">Content Localization</span>
              <div className="h-px flex-1 bg-gray-100"></div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {/* English Section */}
              <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm space-y-6 transition-all hover:shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider">English</span>
                  <div className="h-px flex-1 bg-blue-50"></div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[#16273B] font-bold text-[15px]">Project Name *</label>
                    <input type="text" value={form.name.en || ''} onChange={handleChange('name', 'en')} placeholder="e.g. Skyline Residence"
                      className="w-full border border-gray-100 bg-gray-50/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-[#16273B]/5 text-[#16273B] placeholder-gray-400 font-medium transition-all focus:bg-white focus:border-[#16273B]/20" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[#16273B] font-bold text-[15px]">Detailed Description</label>
                    <textarea value={form.description.en || ''} onChange={handleChange('description', 'en')} placeholder="Describe the project in English..." rows={5}
                      className="w-full border border-gray-100 bg-gray-50/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-[#16273B]/5 text-[#16273B] placeholder-gray-400 resize-none font-medium transition-all focus:bg-white focus:border-[#16273B]/20" />
                  </div>
                </div>
              </div>

              {/* German Section */}
              <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm space-y-6 transition-all hover:shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-wider">German</span>
                  <div className="h-px flex-1 bg-amber-50"></div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[#16273B] font-bold text-[15px]">Projektname</label>
                    <input type="text" value={form.name.de || ''} onChange={handleChange('name', 'de')} placeholder="Name auf Deutsch"
                      className="w-full border border-gray-100 bg-gray-50/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-[#16273B]/5 text-[#16273B] placeholder-gray-400 font-medium transition-all focus:bg-white focus:border-[#16273B]/20" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[#16273B] font-bold text-[15px]">Ausführliche Beschreibung</label>
                    <textarea value={form.description.de || ''} onChange={handleChange('description', 'de')} placeholder="Beschreibung auf Deutsch..." rows={5}
                      className="w-full border border-gray-100 bg-gray-50/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-[#16273B]/5 text-[#16273B] placeholder-gray-400 resize-none font-medium transition-all focus:bg-white focus:border-[#16273B]/20" />
                  </div>
                </div>
              </div>

              {/* Polish Section */}
              <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm space-y-6 transition-all hover:shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-wider">Polish</span>
                  <div className="h-px flex-1 bg-red-50"></div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[#16273B] font-bold text-[15px]">Nazwa Projektu</label>
                    <input type="text" value={form.name.pl || ''} onChange={handleChange('name', 'pl')} placeholder="Nazwa po polsku"
                      className="w-full border border-gray-100 bg-gray-50/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-[#16273B]/5 text-[#16273B] placeholder-gray-400 font-medium transition-all focus:bg-white focus:border-[#16273B]/20" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[#16273B] font-bold text-[15px]">Szczegółowy Opis</label>
                    <textarea value={form.description.pl || ''} onChange={handleChange('description', 'pl')} placeholder="Opis po polsku..." rows={5}
                      className="w-full border border-gray-100 bg-gray-50/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-[#16273B]/5 text-[#16273B] placeholder-gray-400 resize-none font-medium transition-all focus:bg-white focus:border-[#16273B]/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Facilities Section */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <label className="text-[#16273B] font-semibold text-[15px]">Project Facilities</label>
              <button 
                type="button"
                onClick={() => setIsAddingFacility(!isAddingFacility)}
                className="text-[13px] font-bold text-[#16273B] hover:underline"
              >
                {isAddingFacility ? 'Cancel' : '+ Add New Facility'}
              </button>
            </div>

            {isAddingFacility && (
              <div className="bg-gray-50 p-4 rounded-2xl space-y-3 border border-gray-100 shadow-inner">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input 
                    placeholder="EN Name" 
                    className="text-sm p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#16273B]/10"
                    value={newFacilityName.en}
                    onChange={e => setNewFacilityName({...newFacilityName, en: e.target.value})}
                  />
                  <input 
                    placeholder="DE Name" 
                    className="text-sm p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#16273B]/10"
                    value={newFacilityName.de}
                    onChange={e => setNewFacilityName({...newFacilityName, de: e.target.value})}
                  />
                  <input 
                    placeholder="PL Name" 
                    className="text-sm p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#16273B]/10"
                    value={newFacilityName.pl}
                    onChange={e => setNewFacilityName({...newFacilityName, pl: e.target.value})}
                  />
                </div>
                <button 
                  type="button"
                  disabled={isSubmittingQuick || !newFacilityName.en}
                  onClick={async () => {
                    setIsSubmittingQuick(true);
                    try {
                      await createFacility(newFacilityName);
                      setNewFacilityName({ en: '', de: '', pl: '' });
                      setIsAddingFacility(false);
                      await refreshFacilities();
                    } catch {
                      alert('Failed to add facility');
                    } finally {
                      setIsSubmittingQuick(false);
                    }
                  }}
                  className="bg-[#16273B] text-white px-6 py-2 rounded-xl text-sm font-bold disabled:opacity-50"
                >
                  {isSubmittingQuick ? 'Saving...' : 'Save & Refresh'}
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin">
              {facilities.map((fac) => {
                let facName = fac.name;
                if (typeof fac.name === 'object' && fac.name !== null) {
                  const nameObj = fac.name as { en?: string; de?: string; pl?: string };
                  facName = nameObj.en || nameObj.de || nameObj.pl || 'Unknown';
                }
                const isChecked = form.facilityIds.includes(fac.id);
                return (
                  <label key={fac.id} className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all border ${isChecked ? 'bg-[#16273B]/5 border-[#16273B]/20' : 'bg-white border-gray-100 hover:border-gray-200'}`}>
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setForm(prev => ({
                          ...prev,
                          facilityIds: checked 
                            ? [...prev.facilityIds, fac.id]
                            : prev.facilityIds.filter(id => id !== fac.id)
                        }));
                      }}
                      className="w-4 h-4 rounded accent-[#16273B] cursor-pointer" 
                    />
                    <span className="text-[#16273B] text-[13px] font-medium line-clamp-1">{facName as string}</span>
                  </label>
                );
              })}
            </div>
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
        <div className="p-10 pt-0 border-t border-gray-100 flex gap-6 shrink-0 bg-gray-50/30 rounded-b-[32px]">
          <button onClick={onClose} 
            className="flex-1 py-5 rounded-2xl border border-gray-200 text-[#16273B] font-bold hover:bg-white hover:border-[#16273B]/20 transition-all cursor-pointer shadow-sm active:scale-[0.98]">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={isLoading}
            className="flex-[2] py-5 rounded-2xl bg-[#16273B] hover:bg-[#1a304a] text-white font-bold transition-all cursor-pointer shadow-lg shadow-[#16273B]/20 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]">
            {isLoading ? 'Processing...' : isEditMode ? 'Save Project Changes' : 'Create New Project'}
          </button>
        </div>
      </div>
    </div>
  );
}
