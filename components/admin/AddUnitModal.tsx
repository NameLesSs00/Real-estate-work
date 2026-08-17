'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { addUnitToProject, updateUnit, getUnitById, ApiUnit, getProjects, LocalizedString, uploadUnitImages, PaymentPlan, UnitPayload, UpdateUnitPayload } from '@/lib/api/projects';
import { getServices, createService, Service } from '@/lib/api/services';
import { getPaymentPlansByUnit, createPaymentPlan, updatePaymentPlan, deletePaymentPlan } from '@/lib/api/paymentPlans';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useEscapeKey } from '@/hooks/useEscapeKey';

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId?: number | null;       // pre-set when opened from a project context
  editData?: ApiUnit | null;
}

const EMPTY_FORM = { 
  name: { en: '', de: '', pl: '' }, 
  description: { en: '', de: '', pl: '' }, 
  price: '' as number | '',
  propertyType: 0,
  noBathRoom: '',
  noBedRoom: '',
  noKithchen: '',
  floorNumber: '',
  area: '',
  floorName: '',
  view: '',
  isFeatured: false,
  currencyCode: 'EGP',
  type: 'Buy' as 'Buy' | 'Rent',
  status: 0 as 0 | 1, // 0=Primary, 1=Resale
  paymentPlans: [] as { id?: number; installmentMonthes: number | ''; installmentDownPayment: number | ''; paymentType: string }[],
  servicesIds: [] as number[],
};

export default function AddUnitModal({ isOpen, onClose, onSuccess, projectId, editData }: AddUnitModalProps) {
  useBodyScrollLock(isOpen);
  useEscapeKey(onClose, isOpen);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(projectId ?? null);
  const [projects, setProjects] = useState<{ id: number; name: string; locationName?: string }[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const [isAddingService, setIsAddingService] = useState(false);
  const [newServiceName, setNewServiceName] = useState({ en: '', de: '', pl: '' });
  const [isSubmittingQuick, setIsSubmittingQuick] = useState(false);

  const isEditMode = !!editData;

  const fetchData = useCallback(async () => {
    try {
      const serRes = await getServices();
      setServices(serRes);
    } catch (err) {
      console.error('[AddUnitModal] Failed to fetch services', err);
    }

    if (!isEditMode) {
      let page = 1;
      let all: { id: number; name: string; locationName?: string }[] = [];
      try {
        while (true) {
          const res = await getProjects(page);
          all = [...all, ...res.items.map((p) => ({ id: p.id, name: p.name, locationName: p.locationName }))];
          if (!res.hasNextPage) break;
          page++;
        }
        setProjects(all);
      } catch (err) {
        console.error('[AddUnitModal] Failed to fetch projects', err);
      }
    }
  }, [isEditMode]);

  // Load projects, facilities, and services
  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen, fetchData]);

  // Map common property types if backend returns string
  const getPropertyTypeValue = (val: string | number): number => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const lower = val.toString().toLowerCase();
    if (lower.includes('apartment')) return 0;
    if (lower.includes('villa')) return 1;
    if (lower.includes('townhouse')) return 2;
    if (lower.includes('studio')) return 3;
    if (lower.includes('penthouse')) return 4;
    return parseInt(val, 10) || 0;
  };

  // Initialize or populate form when modal opens or editData changes
  useEffect(() => {
    if (!isOpen) {
      setForm(EMPTY_FORM);
      setError('');
      return;
    }

    if (isEditMode && editData) {
      const loadEditData = async () => {
        setIsLoading(true);
        try {
          // Fetch the unit 3 times with different language headers
          const [enData, deData, plData] = await Promise.all([
            getUnitById(editData.id, 'en'),
            getUnitById(editData.id, 'de'),
            getUnitById(editData.id, 'pl')
          ]);

          const [detail, extraPlans] = await Promise.all([
            getUnitById(editData.id),
            getPaymentPlansByUnit(editData.id).catch(() => [])
          ]);

          setForm({
            ...EMPTY_FORM,
            name: {
              en: (enData.Name || enData.name || '') as string,
              de: (deData.Name || deData.name || '') as string,
              pl: (plData.Name || plData.name || '') as string
            },
            description: {
              en: (enData.Description || enData.description || '') as string,
              de: (deData.Description || deData.description || '') as string,
              pl: (plData.Description || plData.description || '') as string
            },
            price: enData.Price || (enData.price as number) || 0,
            propertyType: getPropertyTypeValue(enData.PropertyType || (enData.propertyType as string) || ''),
            noBathRoom: (enData.NoBathRoom || enData.noBathRoom)?.toString() || '',
            noBedRoom: (enData.NoBedRoom || enData.noBedRoom)?.toString() || '',
            noKithchen: (enData.NoKitchen ?? enData.noKitchen)?.toString() || '',
            floorNumber: (enData.FloorNumber || enData.floorNumber)?.toString() || '',
            area: (enData.Area || enData.area)?.toString() || '',
            floorName: enData.FloorName || (enData.floorName as string) || '',
            view: (enData.View ?? enData.view ?? '').toString(),
            isFeatured: enData.IsFeatured ?? enData.isFeatured ?? false,
            currencyCode: enData.CurrencyCode || (enData.currencyCode as string) || 'EGP',
            type: (enData.Type || enData.type || 'Buy') as 'Buy' | 'Rent',
            status: ((enData.Status || enData.status) === 'resale' ? 1 : 0) as 0 | 1,
            servicesIds: (detail.Services || detail.services || []).map((s: { id?: number; Id?: number } | number) => typeof s === 'number' ? s : (s.id ?? s.Id)).filter((id: number | undefined) => id !== undefined),
            paymentPlans: (() => {
              const allPlans = [
                ...(detail.PaymentPlans || detail.paymentPlans || []),
                ...extraPlans
              ];
              // Use a Map to deduplicate by ID
              const uniquePlans = new Map();
              allPlans.forEach(p => {
                const id = p.id ?? p.paymentPlanId;
                if (id) {
                  uniquePlans.set(id, p);
                } else {
                  // For plans without IDs (rare in edit mode), use a composite key or just add them
                  uniquePlans.set(`temp-${p.installmentMonths}-${p.installmentDownPayment}`, p);
                }
              });
              return Array.from(uniquePlans.values());
            })().map(p => {
              const plan = p as PaymentPlan;
              return {
                id: plan.id ?? plan.paymentPlanId,
                installmentMonthes: plan.installmentMonths ?? plan.installmentMonthes ?? plan.installmentMothes ?? plan.InstallmentMonthes ?? plan.InstallmentMothes ?? 0,
                installmentDownPayment: plan.installmentDownPayment ?? plan.InstallmentDownPayment ?? 0,
                paymentType: plan.paymentType ?? plan.PaymentType ?? 'Installment'
              };
            })
          });
        } catch (err) {
          console.error('[AddUnitModal] Failed to fetch localized unit data:', err);
          setError('Failed to load full unit data for editing.');
        } finally {
          setIsLoading(false);
        }
      };
      loadEditData();
    } else {
      setForm(EMPTY_FORM);
      setSelectedProjectId(projectId ?? null);
    }
    setHeroFile(null);
    setHeroPreview(null);
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setError('');
  }, [isOpen, editData, projectId, isEditMode]);

  if (!isOpen) return null;

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

  const set = (field: keyof typeof EMPTY_FORM, lang?: keyof LocalizedString) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const val = e.target.type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : e.target.type === 'number'
          ? e.target.value === '' ? '' : Number(e.target.value)
          : e.target.value;
      
      if (lang) {
        setForm((prev) => ({
          ...prev,
          [field]: { ...((prev[field] as Record<string, string>) || {}), [lang]: val }
        }));
      } else {
        setForm((prev) => ({ ...prev, [field]: val }));
      }
    };

  const handleSubmit = async () => {
    if (!form.name.en.trim()) { setError('Unit name (English) is required.'); return; }
    if (!form.description.en.trim()) { setError('Unit description (English) is required.'); return; }
    if (!isEditMode && !selectedProjectId) { setError('Please select a project.'); return; }
    if (!form.price || Number(form.price) <= 0) { setError('Price must be greater than 0.'); return; }
    if (!form.area || Number(form.area) <= 0) { setError('Area must be greater than 0.'); return; }
    if (form.noBedRoom === '') { setError('Number of bedrooms is required.'); return; }
    if (form.noBathRoom === '') { setError('Number of bathrooms is required.'); return; }
    if (form.noKithchen === '') { setError('Number of kitchens is required.'); return; }
    if (form.floorNumber === '') { setError('Floor number is required.'); return; }
    if (!form.view.trim()) { setError('View is required.'); return; }

    // Remove VIEW_MAPPING as view is now a custom string input
    
    const validatedPlans = form.paymentPlans.map(p => {
      const isCash = p.paymentType === 'Cash';
      return {
        id: p.id,
        installmentMonthes: isCash ? 0 : Number(p.installmentMonthes),
        installmentDownPayment: isCash ? 0 : Number(p.installmentDownPayment),
        paymentType: p.paymentType
      };
    });

    if (validatedPlans.some(p => p.paymentType === 'Installment' && p.installmentMonthes <= 0)) {
      setError('Installment plans must have months greater than 0.');
      return;
    }
    
    setIsLoading(true); setError('');
    try {
      const viewValue = form.view.toString();
      const unitPayload: UnitPayload = {
        name: form.name,
        description: form.description,
        price: Number(form.price) || 0,
        currencyCode: form.currencyCode || 'EGP',
        propertyType: Number(form.propertyType),
        noBathRoom: Number(form.noBathRoom) || 0,
        noBedRoom: Number(form.noBedRoom) || 0,
        noKithchen: Number(form.noKithchen) || 0,
        noKitchen: Number(form.noKithchen) || 0,
        floorNumber: Number(form.floorNumber) || 0,
        area: Number(form.area) || 0,
        floorName: form.floorName || '',
        view: viewValue,
        isFeatured: !!form.isFeatured,
        paymentPlans: validatedPlans.map(p => ({
          ...p,
          installmentMonthes: Number(p.installmentMonthes),
          installmentMonths: Number(p.installmentMonthes),
          installmentMothes: Number(p.installmentMonthes),
        })),
        servicesIds: form.servicesIds.map(id => Number(id)),
        type: form.type === 'Buy' ? 'Buy' : 'Rent',
        status: 'Primary',
        isActive: true,
      };

      console.log('[AddUnitModal] Creating unit with payload:', JSON.stringify(unitPayload, null, 2));

      if (isEditMode && editData) {
        // Prepare UpdateUnitPayload strictly
        const updatePayload: UpdateUnitPayload = {
          id: Number(editData.id),
          name: form.name,
          description: form.description,
          price: Number(form.price) || 0,
          propertyType: Number(form.propertyType),
          noBathRoom: Number(form.noBathRoom) || 0,
          noBedRoom: Number(form.noBedRoom) || 0,
          noKitchen: Number(form.noKithchen) || 0,
          noKithchen: Number(form.noKithchen) || 0,
          area: Number(form.area) || 0,
          status: 'Primary',
          type: unitPayload.type,
          floorNumber: Number(form.floorNumber) || 0,
          view: viewValue,
          floorName: form.floorName || '',
          servicesIds: form.servicesIds,
          isFeatured: !!form.isFeatured,
          currencyCode: form.currencyCode || 'EGP',
          isActive: true,
        };

        console.log('[AddUnitModal] Updating unit with payload:', JSON.stringify(updatePayload, null, 2));
        await updateUnit(updatePayload);
        
        // Handle payment plans individually because UpdateUnit doesn't save them
        try {
          const currentPlans = await getPaymentPlansByUnit(editData.id).catch(() => []);
          const currentPlanIds = currentPlans.map(p => p.id).filter(Boolean);
          
          const newPlans = validatedPlans.filter(p => !p.id);
          const updatedPlans = validatedPlans.filter(p => p.id);
          const updatedPlanIds = updatedPlans.map(p => p.id);
          const deletedPlanIds = currentPlanIds.filter(id => !updatedPlanIds.includes(id));
          
          // Delete removed plans
          for (const id of deletedPlanIds) {
            await deletePaymentPlan(id).catch(e => console.error('Failed to delete plan', e));
          }
          
          // Add new plans
          for (const p of newPlans) {
            await createPaymentPlan({
              unitId: editData.id,
              paymentType: p.paymentType,
              installmentDownPayment: p.installmentDownPayment,
              installmentYears: Math.ceil(p.installmentMonthes / 12),
              installmentMonths: p.installmentMonthes
            }).catch(e => console.error('Failed to create plan', e));
          }
          
          // Update existing plans
          for (const p of updatedPlans) {
            await updatePaymentPlan({
              paymentPlanId: p.id!,
              paymentType: p.paymentType,
              status: 1, // Assume Active
              installmentDownPayment: p.installmentDownPayment,
              installmentYears: Math.ceil(p.installmentMonthes / 12),
              // @ts-expect-error - installmentMonths is used by some backend versions
              installmentMonths: p.installmentMonthes
            }).catch(e => console.error('Failed to update plan', e));
          }
        } catch (planErr) {
          console.error('[AddUnitModal] Plan sync error:', planErr);
        }

      } else {
        const newUnitId = await addUnitToProject({
          projectId: selectedProjectId!,
          units: [unitPayload],
        });
        
        let targetUnitId = newUnitId;
        // If the API returns the Project ID instead of the Unit ID, fetch to find the actual Unit ID
        if (newUnitId === selectedProjectId) {
           try {
             const { getUnits } = await import('@/lib/api/projects');
             const unitsRes = await getUnits(1, selectedProjectId ?? undefined);
             if (unitsRes.items && unitsRes.items.length > 0) {
               // Find the unit we just created by matching the exact English name we sent
               const addedUnit = unitsRes.items.find(u => u.name === form.name.en);
               if (addedUnit) {
                 targetUnitId = addedUnit.id;
               } else {
                 // Fallback to highest ID assuming it's the newest
                 targetUnitId = Math.max(...unitsRes.items.map(u => u.id));
               }
             }
           } catch (e) {
             console.warn('[AddUnitModal] Failed to fetch actual unit ID for image upload', e);
           }
        }

        // Upload hero first (position 0), then gallery images
        const allFiles = [...(heroFile ? [heroFile] : []), ...galleryFiles];
        if (allFiles.length > 0 && targetUnitId) {
          try {
            await uploadUnitImages(targetUnitId, allFiles);
          } catch (imgErr) {
            console.warn('[AddUnitModal] Image upload failed, unit was still created:', imgErr);
          }
        }
      }
      onSuccess(); onClose();
    } catch (err: unknown) {
      console.error('[AddUnitModal]', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#000000]/20 text-[#000000] placeholder-gray-400 bg-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-inter">
      <div className="bg-white rounded-[32px] w-full max-w-[1200px] max-h-[94vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>

        <div className="bg-[#000000] rounded-t-[32px] px-8 py-6 flex items-center justify-between shrink-0">
          <h2 className="text-white text-[24px] font-bold tracking-tight">{isEditMode ? 'Edit Unit Details' : 'Register New Unit'}</h2>
          <button onClick={onClose} className="hover:rotate-90 transition-transform duration-300 cursor-pointer border-none bg-transparent outline-none">
            <Image src="/admin/units/addUnit/close-square.png" alt="Close" width={28} height={28} />
          </button>
        </div>

        <div className="p-10 overflow-y-auto space-y-10 scrollbar-hide">

          {!isEditMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/50 p-6 rounded-[28px] border border-gray-100">
              <div className="space-y-3">
                <label className="text-[#000000] font-bold text-[16px] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#000000]"></span>
                  Target Project *
                </label>
                <select
                  value={selectedProjectId ?? ''}
                  onChange={(e) => setSelectedProjectId(e.target.value === '' ? null : Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-[#000000]/5 text-[#000000] bg-white cursor-pointer shadow-sm transition-all hover:border-[#000000]/30"
                >
                  <option value="">— Select a project —</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[#000000] font-bold text-[16px] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                  Location
                </label>
                <input 
                  type="text" 
                  readOnly 
                  value={projects.find(p => p.id === selectedProjectId)?.locationName || ''} 
                  placeholder="Derived from project..." 
                  className="w-full border border-gray-200 bg-gray-100/50 rounded-2xl px-5 py-4 text-gray-500 cursor-not-allowed shadow-inner" 
                />
              </div>
            </div>
          )}

          {/* Language Sections */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-100"></div>
              <span className="text-gray-400 font-bold text-xs tracking-widest uppercase">Unit Localization</span>
              <div className="h-px flex-1 bg-gray-100"></div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {/* English */}
              <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm space-y-6 transition-all hover:shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider">English</span>
                  <div className="h-px flex-1 bg-blue-50"></div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[#000000] font-bold text-[15px]">Unit Name (EN) *</label>
                    <input type="text" value={form.name.en || ''} onChange={set('name', 'en')} placeholder="e.g. Luxury 3BR Apartment" 
                      className="w-full border border-gray-100 bg-gray-50/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-[#000000]/5 text-[#000000] placeholder-gray-400 font-medium transition-all focus:bg-white focus:border-[#000000]/20" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[#000000] font-bold text-[15px]">Description (EN) *</label>
                    <textarea value={form.description.en || ''} onChange={set('description', 'en')} placeholder="Describe the unit in English..." rows={4} 
                      className="w-full border border-gray-100 bg-gray-50/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-[#000000]/5 text-[#000000] placeholder-gray-400 resize-none font-medium transition-all focus:bg-white focus:border-[#000000]/20" />
                  </div>
                </div>
              </div>

              {/* German */}
              <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm space-y-6 transition-all hover:shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-wider">German</span>
                  <div className="h-px flex-1 bg-amber-50"></div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[#000000] font-bold text-[15px]">Einheitsname (DE)</label>
                    <input type="text" value={form.name.de || ''} onChange={set('name', 'de')} placeholder="Name auf Deutsch" 
                      className="w-full border border-gray-100 bg-gray-50/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-[#000000]/5 text-[#000000] placeholder-gray-400 font-medium transition-all focus:bg-white focus:border-[#000000]/20" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[#000000] font-bold text-[15px]">Beschreibung (DE)</label>
                    <textarea value={form.description.de || ''} onChange={set('description', 'de')} placeholder="Beschreibung auf Deutsch..." rows={4} 
                      className="w-full border border-gray-100 bg-gray-50/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-[#000000]/5 text-[#000000] placeholder-gray-400 resize-none font-medium transition-all focus:bg-white focus:border-[#000000]/20" />
                  </div>
                </div>
              </div>

              {/* Polish */}
              <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm space-y-6 transition-all hover:shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-wider">Polish</span>
                  <div className="h-px flex-1 bg-red-50"></div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[#000000] font-bold text-[15px]">Nazwa Jednostki (PL)</label>
                    <input type="text" value={form.name.pl || ''} onChange={set('name', 'pl')} placeholder="Nazwa po polsku" 
                      className="w-full border border-gray-100 bg-gray-50/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-[#000000]/5 text-[#000000] placeholder-gray-400 font-medium transition-all focus:bg-white focus:border-[#000000]/20" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[#000000] font-bold text-[15px]">Opis (PL)</label>
                    <textarea value={form.description.pl || ''} onChange={set('description', 'pl')} placeholder="Opis po polsku..." rows={4} 
                      className="w-full border border-gray-100 bg-gray-50/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-[#000000]/5 text-[#000000] placeholder-gray-400 resize-none font-medium transition-all focus:bg-white focus:border-[#000000]/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#000000] ml-1">Price *</label>
              <div className="flex gap-2">
                <input type="number" value={form.price}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value ? Number(e.target.value) : '' }))}
                  placeholder="e.g. 5000000"
                  className="flex-1 bg-[#F8F5F0] border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#000000]/10 transition-all font-medium text-[#000000]" 
                  required />
                <select 
                  value={form.currencyCode}
                  onChange={(e) => setForm((prev) => ({ ...prev, currencyCode: e.target.value }))}
                  className="w-[100px] bg-[#F8F5F0] border-none rounded-2xl px-3 py-4 outline-none focus:ring-2 focus:ring-[#000000]/10 transition-all font-bold text-[#000000] appearance-none text-center"
                >
                  <option value="EGP">EGP</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[#000000] font-semibold text-[15px]">Property Type *</label>
              <select value={form.propertyType} onChange={set('propertyType')} className={inputCls}>
                <option value={0}>Apartment</option>
                <option value={1}>Villa</option>
                <option value={2}>Townhouse</option>
                <option value={3}>Studio</option>
                <option value={4}>Penthouse</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[#000000] font-semibold text-[15px]">Listing Type *</label>
              <select value={form.type} onChange={set('type')} className={inputCls}>
                <option value="Buy">Buy</option>
                <option value="Rent">Rent</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[#000000] font-semibold text-[15px]">Bedrooms *</label>
              <input type="number" value={form.noBedRoom} onChange={set('noBedRoom')} min={0} className={inputCls} />
            </div>
            <div className="space-y-2">
              <label className="text-[#000000] font-semibold text-[15px]">Bathrooms *</label>
              <input type="number" value={form.noBathRoom} onChange={set('noBathRoom')} min={0} className={inputCls} />
            </div>
            <div className="space-y-2">
              <label className="text-[#000000] font-semibold text-[15px]">Kitchens *</label>
              <input type="number" value={form.noKithchen} onChange={set('noKithchen')} min={0} className={inputCls} />
            </div>
            <div className="space-y-2">
              <label className="text-[#000000] font-semibold text-[15px]">Floor Number *</label>
              <input type="number" value={form.floorNumber} onChange={set('floorNumber')} className={inputCls} />
            </div>
            <div className="space-y-2">
              <label className="text-[#000000] font-semibold text-[15px]">Floor Name</label>
              <input type="text" value={form.floorName} onChange={set('floorName')} placeholder="e.g. Ground Floor" className={inputCls} />
            </div>
            <div className="space-y-2">
              <label className="text-[#000000] font-semibold text-[15px]">Area (m²) *</label>
              <input type="number" value={form.area} onChange={set('area')} min={0} className={inputCls} />
            </div>
            <div className="space-y-2">
              <label className="text-[#000000] font-semibold text-[15px]">View *</label>
              <input 
                type="text" 
                value={form.view} 
                onChange={set('view')} 
                placeholder="e.g. Sea View, Garden View" 
                className={inputCls} 
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <label className="text-[#000000] font-semibold text-[15px]">Payment Plans</label>
              <button
                type="button"
                onClick={() => setForm(prev => ({
                  ...prev,
                  paymentPlans: [...prev.paymentPlans, { installmentMonthes: 1, installmentDownPayment: 0, paymentType: 'Installment' }]
                }))}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-[#000000] px-3 py-1.5 rounded-lg font-medium transition-colors"
              >
                + Add Plan
              </button>
            </div>
            {form.paymentPlans.map((plan, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                <div className="flex-1 space-y-4">
                  {plan.paymentType === 'Installment' ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Installment Months</label>
                        <input
                          type="number"
                          min={0}
                          value={plan.installmentMonthes}
                          onChange={(e) => {
                            const val = e.target.value === '' ? '' : Number(e.target.value);
                            setForm(prev => ({
                              ...prev,
                              paymentPlans: prev.paymentPlans.map((p, i) => 
                                i === index ? { ...p, installmentMonthes: val } : p
                              )
                            }));
                          }}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#000000]/20"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Down Payment (%)</label>
                        <div className="relative">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={plan.installmentDownPayment}
                            onChange={(e) => {
                              const val = e.target.value === '' ? '' : Number(e.target.value);
                              setForm(prev => ({
                                ...prev,
                                paymentPlans: prev.paymentPlans.map((p, i) => 
                                  i === index ? { ...p, installmentDownPayment: val } : p
                                )
                              }));
                            }}
                            className="w-full border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#000000]/20"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Cash Amount</span>
                      <span className="text-lg font-bold text-[#000000]">{form.currencyCode} {form.price.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Payment Type</label>
                    <select
                      value={plan.paymentType}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm(prev => ({
                          ...prev,
                          paymentPlans: prev.paymentPlans.map((p, i) => 
                            i === index ? { ...p, paymentType: val } : p
                          )
                        }));
                      }}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#000000]/20 bg-white"
                    >
                      <option value="Installment">Installment</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({
                    ...prev,
                    paymentPlans: prev.paymentPlans.filter((_, i) => i !== index)
                  }))}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors mt-6"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Services */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <label className="text-[#000000] font-semibold text-[15px]">Services</label>
              <button 
                type="button"
                onClick={() => setIsAddingService(!isAddingService)}
                className="text-[12px] font-bold text-[#000000] hover:underline flex items-center gap-1"
              >
                {isAddingService ? 'Cancel' : '+ Add New'}
              </button>
            </div>

              {isAddingService && (
                <div className="bg-gray-50 p-3 rounded-xl space-y-3 border border-gray-100 shadow-inner mb-2">
                  <div className="grid grid-cols-1 gap-2">
                    <input 
                      placeholder="EN Name" 
                      className="text-xs p-2 rounded border border-gray-200 outline-none focus:ring-1 focus:ring-[#000000]/20"
                      value={newServiceName.en}
                      onChange={e => setNewServiceName({...newServiceName, en: e.target.value})}
                    />
                    <input 
                      placeholder="DE Name" 
                      className="text-xs p-2 rounded border border-gray-200 outline-none focus:ring-1 focus:ring-[#000000]/20"
                      value={newServiceName.de}
                      onChange={e => setNewServiceName({...newServiceName, de: e.target.value})}
                    />
                    <input 
                      placeholder="PL Name" 
                      className="text-xs p-2 rounded border border-gray-200 outline-none focus:ring-1 focus:ring-[#000000]/20"
                      value={newServiceName.pl}
                      onChange={e => setNewServiceName({...newServiceName, pl: e.target.value})}
                    />
                  </div>
                  <button 
                    type="button"
                    disabled={isSubmittingQuick || !newServiceName.en}
                    onClick={async () => {
                      setIsSubmittingQuick(true);
                      try {
                        const newId = await createService({ name: newServiceName });
                        setNewServiceName({ en: '', de: '', pl: '' });
                        setIsAddingService(false);
                        await fetchData();
                        
                        // Automatically select the newly created service
                        if (typeof newId === 'number') {
                          setForm(prev => ({
                            ...prev,
                            servicesIds: [...prev.servicesIds, newId]
                          }));
                        }
                      } catch {
                        alert('Failed to add service');
                      } finally {
                        setIsSubmittingQuick(false);
                      }
                    }}
                    className="w-full bg-[#000000] text-white py-1.5 rounded-lg text-xs font-bold disabled:opacity-50"
                  >
                    {isSubmittingQuick ? 'Saving...' : 'Save Service'}
                  </button>
                </div>
              )}

              <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2 scrollbar-thin">
                {services.map((ser) => {
                    let serName = ser.name;
                    if (typeof ser.name === 'object' && ser.name !== null) {
                      const nameObj = ser.name as { en?: string; de?: string; pl?: string };
                      serName = nameObj.en || nameObj.de || nameObj.pl || 'Unknown';
                    }
                    const isChecked = form.servicesIds.includes(ser.id);
                    return (
                      <label key={ser.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setForm(prev => ({
                              ...prev,
                              servicesIds: checked 
                                ? [...prev.servicesIds, ser.id]
                                : prev.servicesIds.filter(id => id !== ser.id)
                            }));
                          }}
                          className="w-4 h-4 rounded accent-[#000000] cursor-pointer" 
                        />
                        <span className="text-[#000000] text-[14px]">{serName as string}</span>
                      </label>
                    );
                  })
                }
                {services.length === 0 && <p className="text-sm text-gray-500 italic">No services available.</p>}
              </div>
            </div>
               {/* Image Upload — Hero + Gallery (Side by Side) */}
          {!isEditMode && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hero / Cover Image */}
                <div>
                  <label className="text-[#000000] font-bold text-[15px] flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Hero / Cover Image
                  </label>
                  <p className="text-[12px] text-gray-400 mb-3">Main cover photo for the unit.</p>

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
                    <label htmlFor="unit-hero-upload" className="border-2 border-dashed border-amber-200 bg-amber-50/30 hover:bg-amber-50/60 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors h-[140px]">
                      <span className="text-2xl">🖼️</span>
                      <p className="text-gray-600 font-semibold text-sm">Upload Hero</p>
                    </label>
                  )}
                  <input type="file" id="unit-hero-upload" className="hidden" accept="image/*" onChange={handleHeroChange} />
                </div>

                {/* Gallery Images */}
                <div>
                  <label className="text-[#000000] font-bold text-[15px] flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#000000]" />
                    Gallery Images
                  </label>
                  <p className="text-[12px] text-gray-400 mb-3">Additional images for the unit gallery.</p>

                  <label htmlFor="unit-gallery-upload" className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-gray-50/50 hover:bg-gray-100/50 transition-colors h-[140px]">
                    <Image src="/admin/units/addUnit/upload.png" alt="Upload" width={28} height={28} className="opacity-50" />
                    <p className="text-gray-600 font-semibold text-sm">Upload Gallery</p>
                    <input type="file" id="unit-gallery-upload" className="hidden" accept="image/*" multiple onChange={handleGalleryChange} />
                  </label>
                </div>
              </div>

              {/* Gallery Previews (Full Width below) */}
              {galleryPreviews.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2">
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
            </div>
          )}

          {/* Featured toggle */}
          <label className="flex items-center gap-3 cursor-pointer pt-4 border-t border-gray-100">
            <input type="checkbox" checked={form.isFeatured}
              onChange={(e) => setForm((prev) => ({ ...prev, isFeatured: e.target.checked }))}
              className="w-5 h-5 rounded accent-[#000000] cursor-pointer" />
            <span className="text-[#000000] font-semibold text-[15px]">Featured Unit</span>
          </label>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Footer */}
        <div className="p-10 pt-0 border-t border-gray-100 flex gap-6 shrink-0 bg-gray-50/30 rounded-b-[32px]">
          <button onClick={onClose} 
            className="flex-1 py-5 rounded-2xl border border-gray-200 text-[#000000] font-bold hover:bg-white hover:border-[#000000]/20 transition-all cursor-pointer shadow-sm active:scale-[0.98]">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={isLoading}
            className="flex-[2] py-5 rounded-2xl bg-[#000000] hover:bg-[#1a304a] text-white font-bold transition-all cursor-pointer shadow-lg shadow-[#000000]/20 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]">
            {isLoading ? 'Processing...' : isEditMode ? 'Update Unit Details' : 'Register Unit'}
          </button>
        </div>
      </div>
    </div>
  );
}
