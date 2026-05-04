'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { addUnitToProject, updateUnit, getUnitById, ApiUnit } from '@/lib/api/projects';
import { getProjects } from '@/lib/api/projects';
import { getFacilities, createFacility, Facility } from '@/lib/api/facilities';
import { getServices, createService, Service } from '@/lib/api/services';
import { Plus, X, Loader2 } from 'lucide-react';

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId?: number | null;       // pre-set when opened from a project context
  editData?: ApiUnit | null;
}

const EMPTY_FORM = {
  name: '',
  description: '',
  price: 0 as number | '',
  propertyType: 0 as number | '',
  noBathRoom: 0 as number | '',
  noBedRoom: 0 as number | '',
  floorNumber: 0 as number | '',
  area: 0 as number | '',
  noKithchen: 0 as number | '',
  floorName: '',
  view: 0 as number | '',
  isFeatured: false,
  paymentPlans: [] as { installmentMonthes: number | ''; installmentDownPayment: number | ''; paymentType: string }[],
  facilityIds: [] as number[],
  servicesIds: [] as number[],
};

export default function AddUnitModal({ isOpen, onClose, onSuccess, projectId, editData }: AddUnitModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(projectId ?? null);
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Quick-add state
  const [isAddingFacility, setIsAddingFacility] = useState(false);
  const [newFacilityName, setNewFacilityName] = useState({ en: '', de: '', pl: '' });
  const [isAddingService, setIsAddingService] = useState(false);
  const [newServiceName, setNewServiceName] = useState({ en: '', de: '', pl: '' });
  const [isSubmittingQuick, setIsSubmittingQuick] = useState(false);

  const isEditMode = !!editData;

  const fetchData = useCallback(async () => {
    try {
      const [facRes, serRes] = await Promise.all([getFacilities(), getServices()]);
      setFacilities(facRes);
      setServices(serRes);
    } catch (err) {
      console.error('[AddUnitModal] Failed to fetch facilities or services', err);
    }

    if (!isEditMode) {
      let page = 1;
      let all: { id: number; name: string }[] = [];
      try {
        while (true) {
          const res = await getProjects(page);
          all = [...all, ...res.items.map((p) => ({ id: p.id, name: p.name }))];
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
        // First populate with list data
        setForm({
          name: editData.name ?? '',
          description: editData.description ?? '',
          price: editData.price ?? 0,
          propertyType: getPropertyTypeValue(editData.propertyType),
          noBathRoom: editData.noBathRoom ?? 0,
          noBedRoom: editData.noBedRoom ?? 0,
          floorNumber: editData.floorNumber ?? 0,
          area: editData.area ?? 0,
          noKithchen: editData.noKitchen ?? 0,
          floorName: editData.floorName ?? '',
          view: editData.view ?? 0,
          isFeatured: editData.isFeatured ?? false,
          paymentPlans: [], // Will be filled by fetch
          facilityIds: [],
          servicesIds: [],
        });

        // Then fetch full details for payment plans, facilities, and services
        try {
          const detail = await getUnitById(editData.id);

          setForm(prev => ({
            ...prev,
            facilityIds: (detail.facilities || []).map((f: any) => f.id),
            servicesIds: (detail.services || []).map((s: any) => s.id),
            paymentPlans: (detail.paymentPlans || []).map(p => {
              const plan = p as { installmentMothes?: number; installmentMonthes?: number; installmentDownPayment?: number; paymentType?: string };
              return {
                installmentMonthes: plan.installmentMothes ?? plan.installmentMonthes ?? 0,
                installmentDownPayment: plan.installmentDownPayment ?? 0,
                paymentType: plan.paymentType ?? 'Installment'
              };
            })
          }));
        } catch (err) {
          console.error('[AddUnitModal] Failed to fetch unit detail', err);
        }
      };
      loadEditData();
    } else {
      setForm(EMPTY_FORM);
      setSelectedProjectId(projectId ?? null);
    }
    setError('');
  }, [isOpen, editData, projectId, isEditMode]);

  if (!isOpen) return null;

  const set = (field: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const val = e.target.type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : e.target.type === 'number'
          ? e.target.value === '' ? '' : Number(e.target.value)
          : e.target.value;
      setForm((prev) => ({ ...prev, [field]: val }));
    };

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('Unit name is required.'); return; }
    if (!isEditMode && !selectedProjectId) { setError('Please select a project.'); return; }
    if (!form.area || Number(form.area) <= 0) { setError('Area must be greater than 0.'); return; }
    
    // Validate and clean up payment plans
    const validatedPlans = form.paymentPlans.map(p => {
      const isCash = p.paymentType === 'Cash';
      return {
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
      if (isEditMode && editData) {
        await updateUnit({
          id: editData.id,
          name: { en: form.name, de: form.name, pl: form.name },
          description: { en: form.description, de: form.description, pl: form.description },
          price: Number(form.price),
          propertyType: Number(form.propertyType),
          noBathRoom: Number(form.noBathRoom),
          noBedRoom: Number(form.noBedRoom),
          noKitchen: Number(form.noKithchen),
          floorName: form.floorName,
          view: Number(form.view),
          isFeatured: form.isFeatured,
          paymentPlans: validatedPlans,
          facilityIds: form.facilityIds,
          servicesIds: form.servicesIds,
        });
      } else {
        await addUnitToProject({
          projectId: selectedProjectId!,
          units: [{
            name: { en: form.name, de: form.name, pl: form.name },
            description: { en: form.description, de: form.description, pl: form.description },
            price: Number(form.price),
            propertyType: Number(form.propertyType),
            noBathRoom: Number(form.noBathRoom),
            noBedRoom: Number(form.noBedRoom),
            floorNumber: Number(form.floorNumber),
            area: Number(form.area),
            noKithchen: Number(form.noKithchen),
            floorName: form.floorName,
            view: Number(form.view),
            paymentPlans: validatedPlans,
            isFeatured: form.isFeatured,
            facilityIds: form.facilityIds,
            servicesIds: form.servicesIds,
          }],
        });
      }
      onSuccess(); onClose();
    } catch (err: unknown) {
      console.error('[AddUnitModal]', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#16273B]/20 text-[#16273B] placeholder-gray-400 bg-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-inter" onClick={onClose}>
      <div className="bg-white rounded-[24px] w-full max-w-[720px] max-h-[92vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-[#16273B] rounded-t-[24px] px-8 py-5 flex items-center justify-between shrink-0">
          <h2 className="text-white text-[22px] font-bold">{isEditMode ? 'Edit Unit' : 'Add New Unit'}</h2>
          <button onClick={onClose} className="hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent outline-none">
            <Image src="/admin/units/addUnit/close-square.png" alt="Close" width={24} height={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto space-y-5 scrollbar-hide">

          {/* Project selector (Add mode only) */}
          {!isEditMode && (
            <div className="space-y-2">
              <label className="text-[#16273B] font-semibold text-[15px]">Project *</label>
              <select
                value={selectedProjectId ?? ''}
                onChange={(e) => setSelectedProjectId(e.target.value === '' ? null : Number(e.target.value))}
                className={inputCls}
              >
                <option value="">— Select a project —</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <label className="text-[#16273B] font-semibold text-[15px]">Unit Name *</label>
            <input type="text" value={form.name} onChange={set('name')} placeholder="Enter unit name" className={inputCls} />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[#16273B] font-semibold text-[15px]">Description</label>
            <textarea value={form.description} onChange={set('description')} placeholder="Enter description" rows={3}
              className={`${inputCls} resize-none`} />
          </div>

          {/* 2-col grid */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[#16273B] font-semibold text-[15px]">Price</label>
              <input type="number" value={form.price} onChange={set('price')} min={0} className={inputCls} />
            </div>
            <div className="space-y-2">
              <label className="text-[#16273B] font-semibold text-[15px]">Property Type</label>
              <select value={form.propertyType} onChange={set('propertyType')} className={inputCls}>
                <option value={0}>Apartment</option>
                <option value={1}>Villa</option>
                <option value={2}>Townhouse</option>
                <option value={3}>Studio</option>
                <option value={4}>Penthouse</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[#16273B] font-semibold text-[15px]">Bedrooms</label>
              <input type="number" value={form.noBedRoom} onChange={set('noBedRoom')} min={0} className={inputCls} />
            </div>
            <div className="space-y-2">
              <label className="text-[#16273B] font-semibold text-[15px]">Bathrooms</label>
              <input type="number" value={form.noBathRoom} onChange={set('noBathRoom')} min={0} className={inputCls} />
            </div>
            <div className="space-y-2">
              <label className="text-[#16273B] font-semibold text-[15px]">Kitchens</label>
              <input type="number" value={form.noKithchen} onChange={set('noKithchen')} min={0} className={inputCls} />
            </div>
            <div className="space-y-2">
              <label className="text-[#16273B] font-semibold text-[15px]">Floor Number</label>
              <input type="number" value={form.floorNumber} onChange={set('floorNumber')} className={inputCls} />
            </div>
            <div className="space-y-2">
              <label className="text-[#16273B] font-semibold text-[15px]">Floor Name</label>
              <input type="text" value={form.floorName} onChange={set('floorName')} placeholder="e.g. Ground Floor" className={inputCls} />
            </div>
            <div className="space-y-2">
              <label className="text-[#16273B] font-semibold text-[15px]">Area (m²)</label>
              <input type="number" value={form.area} onChange={set('area')} min={0} className={inputCls} />
            </div>
          </div>

          {/* Payment Plans */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <label className="text-[#16273B] font-semibold text-[15px]">Payment Plans</label>
              <button
                type="button"
                onClick={() => setForm(prev => ({
                  ...prev,
                  paymentPlans: [...prev.paymentPlans, { installmentMonthes: 1, installmentDownPayment: 0, paymentType: 'Installment' }]
                }))}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-[#16273B] px-3 py-1.5 rounded-lg font-medium transition-colors"
              >
                + Add Plan
              </button>
            </div>
            {form.paymentPlans.map((plan, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                <div className="flex-1 space-y-4">
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
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16273B]/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Down Payment</label>
                      <input
                        type="number"
                        min={0}
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
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16273B]/20"
                      />
                    </div>
                  </div>
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
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16273B]/20 bg-white"
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

          {/* Facilities and Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            {/* Facilities */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[#16273B] font-semibold text-[15px]">Facilities</label>
                <button 
                  type="button"
                  onClick={() => setIsAddingFacility(!isAddingFacility)}
                  className="text-[12px] font-bold text-[#16273B] hover:underline flex items-center gap-1"
                >
                  {isAddingFacility ? 'Cancel' : '+ Add New'}
                </button>
              </div>

              {isAddingFacility && (
                <div className="bg-gray-50 p-3 rounded-xl space-y-3 border border-gray-100 shadow-inner mb-2">
                  <div className="grid grid-cols-1 gap-2">
                    <input 
                      placeholder="EN Name" 
                      className="text-xs p-2 rounded border border-gray-200 outline-none focus:ring-1 focus:ring-[#16273B]/20"
                      value={newFacilityName.en}
                      onChange={e => setNewFacilityName({...newFacilityName, en: e.target.value})}
                    />
                    <input 
                      placeholder="DE Name" 
                      className="text-xs p-2 rounded border border-gray-200 outline-none focus:ring-1 focus:ring-[#16273B]/20"
                      value={newFacilityName.de}
                      onChange={e => setNewFacilityName({...newFacilityName, de: e.target.value})}
                    />
                    <input 
                      placeholder="PL Name" 
                      className="text-xs p-2 rounded border border-gray-200 outline-none focus:ring-1 focus:ring-[#16273B]/20"
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
                        await fetchData();
                      } catch (err) {
                        alert('Failed to add facility');
                      } finally {
                        setIsSubmittingQuick(false);
                      }
                    }}
                    className="w-full bg-[#16273B] text-white py-1.5 rounded-lg text-xs font-bold disabled:opacity-50"
                  >
                    {isSubmittingQuick ? 'Saving...' : 'Save Facility'}
                  </button>
                </div>
              )}

              <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2 scrollbar-thin">
                {facilities.map((fac) => {
                  let facName = fac.name;
                  if (typeof fac.name === 'object' && fac.name !== null) {
                    facName = (fac.name as any).en || (fac.name as any).de || (fac.name as any).pl || 'Unknown';
                  }
                  const isChecked = form.facilityIds.includes(fac.id);
                  return (
                    <label key={fac.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
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
                      <span className="text-[#16273B] text-[14px]">{facName}</span>
                    </label>
                  );
                })}
                {facilities.length === 0 && <p className="text-sm text-gray-500 italic">No facilities available.</p>}
              </div>
            </div>

            {/* Services */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[#16273B] font-semibold text-[15px]">Services</label>
                <button 
                  type="button"
                  onClick={() => setIsAddingService(!isAddingService)}
                  className="text-[12px] font-bold text-[#16273B] hover:underline flex items-center gap-1"
                >
                  {isAddingService ? 'Cancel' : '+ Add New'}
                </button>
              </div>

              {isAddingService && (
                <div className="bg-gray-50 p-3 rounded-xl space-y-3 border border-gray-100 shadow-inner mb-2">
                  <div className="grid grid-cols-1 gap-2">
                    <input 
                      placeholder="EN Name" 
                      className="text-xs p-2 rounded border border-gray-200 outline-none focus:ring-1 focus:ring-[#16273B]/20"
                      value={newServiceName.en}
                      onChange={e => setNewServiceName({...newServiceName, en: e.target.value})}
                    />
                    <input 
                      placeholder="DE Name" 
                      className="text-xs p-2 rounded border border-gray-200 outline-none focus:ring-1 focus:ring-[#16273B]/20"
                      value={newServiceName.de}
                      onChange={e => setNewServiceName({...newServiceName, de: e.target.value})}
                    />
                    <input 
                      placeholder="PL Name" 
                      className="text-xs p-2 rounded border border-gray-200 outline-none focus:ring-1 focus:ring-[#16273B]/20"
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
                        await createService({ name: newServiceName });
                        setNewServiceName({ en: '', de: '', pl: '' });
                        setIsAddingService(false);
                        await fetchData();
                      } catch (err) {
                        alert('Failed to add service');
                      } finally {
                        setIsSubmittingQuick(false);
                      }
                    }}
                    className="w-full bg-[#16273B] text-white py-1.5 rounded-lg text-xs font-bold disabled:opacity-50"
                  >
                    {isSubmittingQuick ? 'Saving...' : 'Save Service'}
                  </button>
                </div>
              )}

              <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2 scrollbar-thin">
                {services.map((ser) => {
                  let serName = ser.name;
                  if (typeof ser.name === 'object' && ser.name !== null) {
                    serName = (ser.name as any).en || (ser.name as any).de || (ser.name as any).pl || 'Unknown';
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
                        className="w-4 h-4 rounded accent-[#16273B] cursor-pointer" 
                      />
                      <span className="text-[#16273B] text-[14px]">{serName}</span>
                    </label>
                  );
                })}
                {services.length === 0 && <p className="text-sm text-gray-500 italic">No services available.</p>}
              </div>
            </div>
          </div>

          {/* Featured toggle */}
          <label className="flex items-center gap-3 cursor-pointer pt-4 border-t border-gray-100">
            <input type="checkbox" checked={form.isFeatured}
              onChange={(e) => setForm((prev) => ({ ...prev, isFeatured: e.target.checked }))}
              className="w-5 h-5 rounded accent-[#16273B] cursor-pointer" />
            <span className="text-[#16273B] font-semibold text-[15px]">Featured Unit</span>
          </label>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Footer */}
        <div className="p-8 pt-0 border-t border-gray-100 flex gap-4 shrink-0">
          <button onClick={onClose} className="flex-1 py-4 rounded-xl border border-gray-200 text-[#16273B] font-bold hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
          <button onClick={handleSubmit} disabled={isLoading}
            className="flex-1 py-4 rounded-xl bg-[#16273B] hover:bg-[#1a304a] text-white font-bold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
            {isLoading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Unit'}
          </button>
        </div>
      </div>
    </div>
  );
}
