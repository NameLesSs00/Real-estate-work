'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { addUnitToProject, updateUnit, ApiUnit } from '@/lib/api/projects';
import { getProjects } from '@/lib/api/projects';

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
};

export default function AddUnitModal({ isOpen, onClose, onSuccess, projectId, editData }: AddUnitModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(projectId ?? null);
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = !!editData;

  // Load projects for the dropdown (only in Add mode)
  useEffect(() => {
    if (!isOpen || isEditMode) return;
    const fetchAll = async () => {
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
    };
    fetchAll();
  }, [isOpen, isEditMode]);

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

  // Populate form when editing
  useEffect(() => {
    if (editData) {
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
        paymentPlans: [],
      });
    } else {
      setForm(EMPTY_FORM);
      setSelectedProjectId(projectId ?? null);
    }
    setError('');
  }, [editData, isOpen, projectId]);

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
    setIsLoading(true); setError('');
    try {
      if (isEditMode && editData) {
        await updateUnit({
          id: editData.id,
          name: form.name,
          description: form.description,
          price: Number(form.price),
          propertyType: Number(form.propertyType),
          noBathRoom: Number(form.noBathRoom),
          noBedRoom: Number(form.noBedRoom),
          noKitchen: Number(form.noKithchen),
          floorName: form.floorName,
          isFeatured: form.isFeatured,
        });
      } else {
        await addUnitToProject({
          projectId: selectedProjectId!,
          units: [{
            name: form.name,
            description: form.description,
            price: Number(form.price),
            propertyType: Number(form.propertyType),
            noBathRoom: Number(form.noBathRoom),
            noBedRoom: Number(form.noBedRoom),
            floorNumber: Number(form.floorNumber),
            area: Number(form.area),
            noKithchen: Number(form.noKithchen),
            floorName: form.floorName,
            view: Number(form.view),
            paymentPlans: form.paymentPlans.map(p => ({
              installmentMonthes: Number(p.installmentMonthes),
              installmentDownPayment: Number(p.installmentDownPayment),
              paymentType: p.paymentType
            })),
            isFeatured: form.isFeatured,
            facilityIds: [],
            servicesIds: [],
          }],
        });
      }
      onSuccess(); onClose();
    } catch (err: any) {
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
                  paymentPlans: [...prev.paymentPlans, { installmentMonthes: 0, installmentDownPayment: 0, paymentType: '' }]
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
                          setForm(prev => {
                            const newPlans = [...prev.paymentPlans];
                            newPlans[index].installmentMonthes = val;
                            return { ...prev, paymentPlans: newPlans };
                          });
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
                          setForm(prev => {
                            const newPlans = [...prev.paymentPlans];
                            newPlans[index].installmentDownPayment = val;
                            return { ...prev, paymentPlans: newPlans };
                          });
                        }}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16273B]/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Payment Type</label>
                    <input
                      type="text"
                      placeholder="e.g. Monthly, Quarterly"
                      value={plan.paymentType}
                      onChange={(e) => {
                        setForm(prev => {
                          const newPlans = [...prev.paymentPlans];
                          newPlans[index].paymentType = e.target.value;
                          return { ...prev, paymentPlans: newPlans };
                        });
                      }}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16273B]/20"
                    />
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
