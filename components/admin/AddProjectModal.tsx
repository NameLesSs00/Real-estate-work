'use client';

import React, { useState, useEffect } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import Image from 'next/image';
import { createProject, updateProject, getProjectById, uploadProjectImages, Project, LocalizedString, addProjectFacility, deleteProjectFacility } from '@/lib/api/projects';
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
  useBodyScrollLock(isOpen);
  useEscapeKey(onClose, isOpen);
  const [form, setForm] = useState(EMPTY_FORM);
  const [initialFacilityIds, setInitialFacilityIds] = useState<number[]>([]);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
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

  // Populate form when editing (Triple GET flow)
  useEffect(() => {
    if (editData && isOpen) {
      const fetchFullData = async () => {
        setIsLoading(true);
        try {
          // Fetch the project 3 times with different language headers
          const [enData, deData, plData] = await Promise.all([
            getProjectById(editData.id, 'en'),
            getProjectById(editData.id, 'de'),
            getProjectById(editData.id, 'pl')
          ]);

          console.log('[AddProjectModal] Triple GET success:', { 
            en: enData.name, 
            de: deData.name, 
            pl: plData.name 
          });

          // Map facilities robustly (handle lowercase, uppercase, and objects)
          const currentFacilityIds = enData.facilityIds || 
            (enData as any).Facilities?.map((f: any) => f.id) || 
            (enData as any).facilities?.map((f: any) => typeof f === 'object' ? f.id : null).filter(Boolean) || 
            [];

          setInitialFacilityIds(currentFacilityIds);
          
          setForm({
            name: {
              en: enData.name,
              de: deData.name,
              pl: plData.name
            },
            description: {
              en: enData.description,
              de: deData.description,
              pl: plData.description
            },
            developerId: enData.developerId,
            locationId: enData.locationId,
            facilityIds: currentFacilityIds
          });
        } catch (err) {
          console.error('[AddProjectModal] Failed to fetch localized project data:', err);
          setError('Failed to load full project data for editing.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchFullData();
    } else {
      setForm(EMPTY_FORM);
      setInitialFacilityIds([]);
      setIsLoading(false);
    }
    setHeroFile(null);
    setHeroPreview(null);
    setGalleryFiles([]);
    setGalleryPreviews([]);
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

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setHeroFile(file);
    setHeroPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setGalleryFiles(prev => [...prev, ...files]);
    setGalleryPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!form.name.en.trim()) { setError('Project name (English) is required.'); return; }
    if (!form.locationId) { setError('Location is required.'); return; }
    setIsLoading(true); setError('');
    try {
      let projectId: number;
      if (isEditMode && editData) {
        console.log('[AddProjectModal] Updating project:', {
          id: editData.id,
          name: form.name,
          facilityIds: form.facilityIds,
          initial: initialFacilityIds
        });

        const res = await updateProject(editData.id, {
          id: editData.id,
          name: form.name,
          description: form.description,
          developerId: form.developerId || 0,
          locationId: form.locationId || 0,
          facilityIds: form.facilityIds,
          // Try sending uppercase Facilities if the backend expects it
          Facilities: form.facilityIds.map(id => ({ id })) as any
        });
        projectId = typeof res === 'number' ? res : res.id;

        // Sync facilities (Deletions only via individual endpoint)
        const toDelete = initialFacilityIds.filter(id => !form.facilityIds.includes(id));
        console.log('[AddProjectModal] Syncing deletions:', toDelete);

        for (const id of toDelete) {
          await deleteProjectFacility(projectId, id).catch(e => {
            console.error('Failed to delete facility', id, e);
          });
        }
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
      // Upload hero first (position 0), then gallery images
      const allFiles = [...(heroFile ? [heroFile] : []), ...galleryFiles];
      if (allFiles.length > 0) await uploadProjectImages(projectId, allFiles);
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
      <div className="bg-white rounded-[32px] w-full max-w-[1100px] max-h-[92vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-[#16273B] rounded-t-[24px] px-8 py-5 flex items-center justify-between shrink-0">
          <h2 className="text-white text-[22px] font-bold">{isEditMode ? 'Edit Project' : 'Add New Project'}</h2>
          <button onClick={onClose} className="hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent outline-none">
            <Image src="/admin/units/addUnit/close-square.png" alt="Close" width={24} height={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-10 overflow-y-auto space-y-10 scrollbar-hide relative min-h-[400px]">
          {isLoading && !isEditMode === false && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-30 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-[#16273B] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#16273B] font-bold text-sm animate-pulse">Fetching multilingual data...</p>
            </div>
          )}
          
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
                  Location *
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

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin">
              {facilities.map((fac) => {
                let facName = fac.name;
                if (typeof fac.name === 'object' && fac.name !== null) {
                  const nameObj = fac.name as { en?: string; de?: string; pl?: string };
                  facName = nameObj.en || nameObj.de || nameObj.pl || 'Unknown';
                }
                const isChecked = form.facilityIds.includes(fac.id);
                return (
                  <label 
                    key={fac.id} 
                    className={`group flex items-center gap-3 cursor-pointer p-4 rounded-[18px] transition-all border-2 ${
                      isChecked 
                        ? 'bg-[#16273B] border-[#16273B] shadow-md shadow-[#16273B]/10' 
                        : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      isChecked ? 'bg-white border-white' : 'bg-transparent border-gray-300'
                    }`}>
                      {isChecked && (
                        <svg className="w-3.5 h-3.5 text-[#16273B] fill-current" viewBox="0 0 20 20">
                          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                        </svg>
                      )}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden"
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
                    />
                    <span className={`text-[14px] font-bold transition-colors ${
                      isChecked ? 'text-white' : 'text-[#16273B]'
                    }`}>
                      {facName as string}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Image Upload — Hero + Gallery */}
          <div className="space-y-6">
            <div>
              <label className="text-[#16273B] font-bold text-[15px] flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Hero / Cover Image
              </label>
              <p className="text-[12px] text-gray-400 mb-3">This single image appears as the main cover photo.</p>

              {heroPreview ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-amber-400">
                  <Image src={heroPreview} alt="Hero preview" fill className="object-cover" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-black tracking-widest uppercase bg-amber-400 text-white shadow-md">⭐ Hero</div>
                  <button
                    type="button"
                    onClick={() => { setHeroFile(null); setHeroPreview(null); }}
                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 shadow cursor-pointer text-lg font-bold"
                  >×</button>
                </div>
              ) : (
                <label htmlFor="proj-hero-upload" className="border-2 border-dashed border-amber-200 bg-amber-50/30 hover:bg-amber-50/60 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors">
                  <span className="text-2xl">🖼️</span>
                  <p className="text-gray-600 font-semibold text-sm">Click to upload Hero image</p>
                  <p className="text-gray-400 text-xs">PNG, JPG, WEBP — single file</p>
                </label>
              )}
              <input type="file" id="proj-hero-upload" className="hidden" accept="image/*" onChange={handleHeroChange} />
            </div>

            <div>
              <label className="text-[#16273B] font-bold text-[15px] flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#16273B]" />
                Gallery Images
              </label>
              <p className="text-[12px] text-gray-400 mb-3">Additional images shown in the project gallery. You can add multiple.</p>

              {galleryPreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {galleryPreviews.map((src, i) => (
                    <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group">
                      <Image src={src} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-white/90 rounded-md flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow cursor-pointer text-sm font-bold"
                      >×</button>
                      <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-black/50 text-white">{i + 1}</div>
                    </div>
                  ))}
                </div>
              )}

              <label htmlFor="proj-gallery-upload" className="border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                <Image src="/admin/units/addUnit/upload.png" alt="Upload" width={28} height={28} className="opacity-50" />
                <p className="text-gray-600 font-semibold text-sm">{galleryPreviews.length > 0 ? '+ Add more gallery images' : 'Click to upload gallery images'}</p>
                <p className="text-gray-400 text-xs">PNG, JPG, WEBP — multiple files allowed</p>
              </label>
              <input type="file" id="proj-gallery-upload" className="hidden" accept="image/*" multiple onChange={handleGalleryChange} />
            </div>
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
