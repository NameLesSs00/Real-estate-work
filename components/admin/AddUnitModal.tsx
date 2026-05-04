'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { addUnitToProject, updateUnit, getUnitById, ApiUnit, getProjects, LocalizedString } from '@/lib/api/projects';
import { getServices, createService, Service } from '@/lib/api/services';

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
  view: 0,
  isFeatured: false,
  currencyCode: 'EGP',
  paymentPlans: [] as { installmentMonthes: number | ''; installmentDownPayment: number | ''; paymentType: string }[],
  servicesIds: [] as number[],
};

export default function AddUnitModal({ isOpen, onClose, onSuccess, projectId, editData }: AddUnitModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(projectId ?? null);
  const [projects, setProjects] = useState<{ id: number; name: string; locationName?: string }[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
        setForm({
          ...EMPTY_FORM,
          name: typeof editData.name === 'string' ? { en: editData.name, de: editData.name, pl: editData.name } : editData.name,
          description: typeof editData.description === 'string' ? { en: editData.description, de: editData.description, pl: editData.description } : editData.description,
          price: editData.price,
          propertyType: getPropertyTypeValue(editData.propertyType),
          noBathRoom: editData.noBathRoom,
          noBedRoom: editData.noBedRoom,
          noKithchen: editData.noKithchen,
          floorNumber: editData.floorNumber,
          area: editData.area,
          floorName: editData.floorName,
          view: editData.view,
          isFeatured: editData.isFeatured,
          currencyCode: editData.currencyCode || 'EGP',
        });

        try {
          const detail = await getUnitById(editData.id);

          setForm(prev => ({
            ...prev,
            servicesIds: (detail.services || []).map((s: Service) => s.id),
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
    if (!isEditMode && !selectedProjectId) { setError('Please select a project.'); return; }
    if (!form.area || Number(form.area) <= 0) { setError('Area must be greater than 0.'); return; }
    
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
      const unitPayload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        currencyCode: form.currencyCode,
        propertyType: Number(form.propertyType),
        noBathRoom: Number(form.noBathRoom),
        noBedRoom: Number(form.noBedRoom),
        noKithchen: Number(form.noKithchen),
        floorNumber: Number(form.floorNumber),
        area: Number(form.area),
        floorName: form.floorName,
        view: Number(form.view),
        isFeatured: form.isFeatured,
        paymentPlans: validatedPlans,
        servicesIds: form.servicesIds,
      };

      if (isEditMode && editData) {
        await updateUnit({ id: editData.id, ...unitPayload });
      } else {
        await addUnitToProject({
          projectId: selectedProjectId!,
          units: [unitPayload],
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-inter">
      <div className="bg-white rounded-[32px] w-full max-w-[900px] max-h-[94vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>

        <div className="bg-[#16273B] rounded-t-[32px] px-8 py-6 flex items-center justify-between shrink-0">
          <h2 className="text-white text-[24px] font-bold tracking-tight">{isEditMode ? 'Edit Unit Details' : 'Register New Unit'}</h2>
          <button onClick={onClose} className="hover:rotate-90 transition-transform duration-300 cursor-pointer border-none bg-transparent outline-none">
            <Image src="/admin/units/addUnit/close-square.png" alt="Close" width={28} height={28} />
          </button>
        </div>

        <div className="p-10 overflow-y-auto space-y-10 scrollbar-hide">

          {!isEditMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/50 p-6 rounded-[28px] border border-gray-100">
              <div className="space-y-3">
                <label className="text-[#16273B] font-bold text-[16px] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#16273B]"></span>
                  Target Project *
                </label>
                <select
                  value={selectedProjectId ?? ''}
                  onChange={(e) => setSelectedProjectId(e.target.value === '' ? null : Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-[#16273B]/5 text-[#16273B] bg-white cursor-pointer shadow-sm transition-all hover:border-[#16273B]/30"
                >
                  <option value="">— Select a project —</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[#16273B] font-bold text-[16px] flex items-center gap-2">
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
                    <label className="text-[#16273B] font-bold text-[15px]">Unit Name (EN) *</label>
                    <input type="text" value={form.name.en || ''} onChange={set('name', 'en')} placeholder="e.g. Luxury 3BR Apartment" 
                      className="w-full border border-gray-100 bg-gray-50/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-[#16273B]/5 text-[#16273B] placeholder-gray-400 font-medium transition-all focus:bg-white focus:border-[#16273B]/20" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[#16273B] font-bold text-[15px]">Description (EN)</label>
                    <textarea value={form.description.en || ''} onChange={set('description', 'en')} placeholder="Describe the unit in English..." rows={4} 
                      className="w-full border border-gray-100 bg-gray-50/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-[#16273B]/5 text-[#16273B] placeholder-gray-400 resize-none font-medium transition-all focus:bg-white focus:border-[#16273B]/20" />
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
                    <label className="text-[#16273B] font-bold text-[15px]">Einheitsname (DE)</label>
                    <input type="text" value={form.name.de || ''} onChange={set('name', 'de')} placeholder="Name auf Deutsch" 
                      className="w-full border border-gray-100 bg-gray-50/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-[#16273B]/5 text-[#16273B] placeholder-gray-400 font-medium transition-all focus:bg-white focus:border-[#16273B]/20" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[#16273B] font-bold text-[15px]">Beschreibung (DE)</label>
                    <textarea value={form.description.de || ''} onChange={set('description', 'de')} placeholder="Beschreibung auf Deutsch..." rows={4} 
                      className="w-full border border-gray-100 bg-gray-50/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-[#16273B]/5 text-[#16273B] placeholder-gray-400 resize-none font-medium transition-all focus:bg-white focus:border-[#16273B]/20" />
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
                    <label className="text-[#16273B] font-bold text-[15px]">Nazwa Jednostki (PL)</label>
                    <input type="text" value={form.name.pl || ''} onChange={set('name', 'pl')} placeholder="Nazwa po polsku" 
                      className="w-full border border-gray-100 bg-gray-50/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-[#16273B]/5 text-[#16273B] placeholder-gray-400 font-medium transition-all focus:bg-white focus:border-[#16273B]/20" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[#16273B] font-bold text-[15px]">Opis (PL)</label>
                    <textarea value={form.description.pl || ''} onChange={set('description', 'pl')} placeholder="Opis po polsku..." rows={4} 
                      className="w-full border border-gray-100 bg-gray-50/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-[#16273B]/5 text-[#16273B] placeholder-gray-400 resize-none font-medium transition-all focus:bg-white focus:border-[#16273B]/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#16273B] ml-1">Price</label>
              <div className="flex gap-2">
                <input type="number" value={form.price}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value ? Number(e.target.value) : '' }))}
                  placeholder="e.g. 5000000"
                  className="flex-1 bg-[#F8F5F0] border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#16273B]/10 transition-all font-medium text-[#16273B]" 
                  required />
                <select 
                  value={form.currencyCode}
                  onChange={(e) => setForm((prev) => ({ ...prev, currencyCode: e.target.value }))}
                  className="w-[100px] bg-[#F8F5F0] border-none rounded-2xl px-3 py-4 outline-none focus:ring-2 focus:ring-[#16273B]/10 transition-all font-bold text-[#16273B] appearance-none text-center"
                >
                  <option value="EGP">EGP</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
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

          {/* Services */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
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
                      } catch {
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
                        className="w-4 h-4 rounded accent-[#16273B] cursor-pointer" 
                      />
                      <span className="text-[#16273B] text-[14px]">{serName}</span>
                    </label>
                  );
                })}
                {services.length === 0 && <p className="text-sm text-gray-500 italic">No services available.</p>}
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
        <div className="p-10 pt-0 border-t border-gray-100 flex gap-6 shrink-0 bg-gray-50/30 rounded-b-[32px]">
          <button onClick={onClose} 
            className="flex-1 py-5 rounded-2xl border border-gray-200 text-[#16273B] font-bold hover:bg-white hover:border-[#16273B]/20 transition-all cursor-pointer shadow-sm active:scale-[0.98]">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={isLoading}
            className="flex-[2] py-5 rounded-2xl bg-[#16273B] hover:bg-[#1a304a] text-white font-bold transition-all cursor-pointer shadow-lg shadow-[#16273B]/20 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]">
            {isLoading ? 'Processing...' : isEditMode ? 'Update Unit Details' : 'Register Unit'}
          </button>
        </div>
      </div>
    </div>
  );
}
