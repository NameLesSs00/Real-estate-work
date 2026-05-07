'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import {
  createUnitOutside,
  updateUnitOutside,
  addUnitOutsideImages,
  getUnitOutsideById,
  UnitOutside,
} from '@/lib/api/unitOutsides';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: UnitOutside | null;
}

const EMPTY = {
  name: { en: '', de: '', pl: '' },
  description: { en: '', de: '', pl: '' },
  price: '' as number | '',
  currencyCode: 'USD',
  area: '' as number | '',
  noBedRoom: '' as number | '',
  noBathRoom: '' as number | '',
  noKitchen: '' as number | '',
  country: '',
  city: '',
  street: '',
  propertyType: 'Apartment',
  floorNumber: '' as number | '',
  floorName: '',
  view: '',
  type: 'Buy',
  isFeatured: false,
  paymentPlans: [] as {
    id?: number;
    commissionRate: number | '';
    installmentMothes: number | '';
    installmentDownPayment: number | '';
    paymentType: string;
  }[],
};

const inputCls =
  'w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#16273B]/20 text-[#16273B] placeholder-gray-400 bg-white text-[14px]';

export default function AddUnitOutsideModal({ isOpen, onClose, onSuccess, editData }: Props) {
  useBodyScrollLock(isOpen);
  useEscapeKey(onClose, isOpen);

  const isEdit = !!editData;
  const [form, setForm] = useState(EMPTY);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [langTab, setLangTab] = useState<'en' | 'de' | 'pl'>('en');

  // Reset / populate on open
  useEffect(() => {
    if (!isOpen) {
      setForm(EMPTY);
      setImageFiles([]);
      setImagePreviews([]);
      setError('');
      setLangTab('en');
      return;
    }
    if (isEdit && editData) {
      (async () => {
        setIsLoading(true);
        try {
          const [enData, deData, plData] = await Promise.all([
            getUnitOutsideById(editData.id, 'en'),
            getUnitOutsideById(editData.id, 'de'),
            getUnitOutsideById(editData.id, 'pl')
          ]);

          setForm({
            name: { 
              en: enData.name ?? '', 
              de: deData.name ?? '', 
              pl: plData.name ?? '' 
            },
            description: { 
              en: enData.description ?? '', 
              de: deData.description ?? '', 
              pl: plData.description ?? '' 
            },
            price: enData.price ?? '',
            currencyCode: enData.currencyCode || 'USD',
            area: enData.area ?? '',
            noBedRoom: enData.noBedRoom ?? '',
            noBathRoom: enData.noBathRoom ?? '',
            noKitchen: enData.noKitchen ?? '',
            country: enData.country ?? '',
            city: enData.city ?? '',
            street: enData.street ?? '',
            propertyType: (() => {
              const pt = enData.propertyType ?? '';
              const reverseMapping: Record<number | string, string> = {
                0: 'Apartment',
                1: 'Villa',
                2: 'Townhouse',
                3: 'Studio',
                4: 'Penthouse'
              };
              return reverseMapping[pt] || pt.toString();
            })(),
            floorNumber: enData.floorNumber ?? '',
            floorName: enData.floorName ?? '',
            view: (() => {
              const v = enData.view ?? '';
              const reverseMapping: Record<number | string, string> = {
                0: 'Sea',
                1: 'Mountain',
                2: 'Garden',
                3: 'Pool',
                4: 'SeaAndPool'
              };
              return reverseMapping[v] || v.toString();
            })(),
            type: enData.type ?? 'Buy',
            isFeatured: enData.isFeatured ?? false,
            paymentPlans: (enData.paymentPlans ?? []).map((p) => ({
              id: p.id,
              commissionRate: p.commissionRate ?? 0,
              installmentMothes: p.installmentMothes ?? 0,
              installmentDownPayment: p.installmentDownPayment ?? 0,
              paymentType: p.paymentType ?? 'Installment',
            })),
          });
        } catch {
          setError('Failed to load unit data.');
        } finally {
          setIsLoading(false);
        }
      })();
    } else {
      setForm(EMPTY);
    }
  }, [isOpen, isEdit, editData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (i: number) => {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== i));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const setField = (field: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const val =
        e.target.type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : e.target.type === 'number'
          ? e.target.value === ''
            ? ''
            : Number(e.target.value)
          : e.target.value;
      setForm((prev) => ({ ...prev, [field]: val }));
    };

  const setLangField =
    (field: 'name' | 'description', lang: 'en' | 'de' | 'pl') =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: { ...(prev[field] as Record<string, string>), [lang]: e.target.value },
      }));
    };

  const updatePlan = (i: number, key: string, val: string | number) =>
    setForm((prev) => ({
      ...prev,
      paymentPlans: prev.paymentPlans.map((p, idx) => (idx === i ? { ...p, [key]: val } : p)),
    }));

  const handleSubmit = async () => {
    if (!form.name.en.trim()) { setError('English name is required.'); return; }
    if (!form.city.trim()) { setError('City is required.'); return; }
    if (!form.country.trim()) { setError('Country is required.'); return; }
    if (Number(form.area) <= 0) { setError('Area must be greater than 0.'); return; }
    if (!form.view) { setError('Please select a view.'); return; }

    const VIEW_MAPPING: Record<string, number> = {
      'Sea': 0,
      'Mountain': 1,
      'Garden': 2,
      'Pool': 3,
      'SeaAndPool': 4
    };

    const PROPERTY_TYPE_MAPPING: Record<string, number> = {
      'Apartment': 0,
      'Villa': 1,
      'Townhouse': 2,
      'Studio': 3,
      'Penthouse': 4
    };

    const validatedPlans = form.paymentPlans.map((p) => {
      const isCash = p.paymentType === 'Cash';
      return {
        Id: p.id,
        id: p.id,
        CommissionRate: Number(p.commissionRate) || 0,
        commissionRate: Number(p.commissionRate) || 0,
        InstallmentMothes: isCash ? 0 : (Number(p.installmentMothes) || 0),
        installmentMothes: isCash ? 0 : (Number(p.installmentMothes) || 0),
        InstallmentDownPayment: isCash ? 0 : (Number(p.installmentDownPayment) || 0),
        installmentDownPayment: isCash ? 0 : (Number(p.installmentDownPayment) || 0),
        PaymentType: p.paymentType,
        paymentType: p.paymentType,
      };
    });

    if (validatedPlans.some(p => p.PaymentType === 'Installment' && p.InstallmentMothes <= 0)) {
      setError('Installment plans must have months greater than 0.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const viewValue = VIEW_MAPPING[form.view] ?? 0;
      const propTypeValue = PROPERTY_TYPE_MAPPING[form.propertyType] ?? 0;
      const fd = new FormData();
      
      // Basic Info
      if (isEdit && editData) {
        fd.append('Id', String(editData.id));
      }
      
      // Localized Name
      fd.append('Name.En', form.name.en);
      fd.append('Name.De', form.name.de || form.name.en);
      fd.append('Name.Pl', form.name.pl || form.name.en);
      
      // Localized Description
      fd.append('Description.En', form.description.en);
      fd.append('Description.De', form.description.de || form.description.en);
      fd.append('Description.Pl', form.description.pl || form.description.en);
      
      // Numbers & Strings
      fd.append('Price', String(Number(form.price) || 0));
      fd.append('CurrencyCode', form.currencyCode);
      fd.append('Area', String(Number(form.area) || 0));
      fd.append('NoBathRoom', String(Number(form.noBathRoom) || 0));
      fd.append('NoBedRoom', String(Number(form.noBedRoom) || 0));
      fd.append('NoKitchen', String(Number(form.noKitchen) || 0));
      fd.append('NoKithchen', String(Number(form.noKitchen) || 0));
      fd.append('Country', form.country);
      fd.append('City', form.city);
      fd.append('Street', form.street);
      fd.append('PropertyType', String(propTypeValue));
      fd.append('FloorNumber', String(Number(form.floorNumber) || 0));
      fd.append('FloorName', form.floorName);
      fd.append('View', String(viewValue));
      fd.append('Type', form.type);
      fd.append('Status', 'Resale');
      fd.append('IsFeatured', String(form.isFeatured));
      
      // Payment Plans
      form.paymentPlans.forEach((p, i) => {
        const isCash = p.paymentType === 'Cash';
        if (p.id) fd.append(`PaymentPlan[${i}].id`, String(p.id));
        fd.append(`PaymentPlan[${i}].commissionRate`, String(Number(p.commissionRate) || 0));
        fd.append(`PaymentPlan[${i}].installmentMothes`, String(isCash ? 0 : (Number(p.installmentMothes) || 0)));
        fd.append(`PaymentPlan[${i}].installmentDownPayment`, String(isCash ? 0 : (Number(p.installmentDownPayment) || 0)));
        fd.append(`PaymentPlan[${i}].paymentType`, p.paymentType);
      });

      // Images
      imageFiles.forEach((f) => fd.append('Images', f));

      if (isEdit) {
        await updateUnitOutside(fd);
      } else {
        const newId = await createUnitOutside({
          name: form.name,
          description: form.description,
          price: Number(form.price) || 0,
          currencyCode: form.currencyCode,
          area: Number(form.area) || 0,
          noBathRoom: Number(form.noBathRoom) || 0,
          noBedRoom: Number(form.noBedRoom) || 0,
          noKitchen: Number(form.noKitchen) || 0,
          country: form.country,
          city: form.city,
          street: form.street,
          propertyType: propTypeValue,
          floorNumber: Number(form.floorNumber) || 0,
          view: viewValue,
          type: form.type,
          status: 'Resale',
          floorName: form.floorName,
          isFeatured: form.isFeatured,
          paymentPlans: form.paymentPlans.map(p => ({
            commissionRate: Number(p.commissionRate) || 0,
            installmentMothes: p.paymentType === 'Cash' ? 0 : (Number(p.installmentMothes) || 0),
            installmentDownPayment: p.paymentType === 'Cash' ? 0 : (Number(p.installmentDownPayment) || 0),
            paymentType: p.paymentType
          })),
        });
        if (imageFiles.length > 0 && newId) {
          await addUnitOutsideImages(Number(newId), imageFiles).catch(() => {});
        }
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const LANG_TABS = [
    { key: 'en', label: 'English', color: 'bg-blue-50 text-blue-600' },
    { key: 'de', label: 'German', color: 'bg-amber-50 text-amber-600' },
    { key: 'pl', label: 'Polish', color: 'bg-red-50 text-red-600' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-inter">
      <div
        className="bg-white rounded-[32px] w-full max-w-[1100px] max-h-[94vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#16273B] rounded-t-[32px] px-8 py-6 flex items-center justify-between shrink-0">
          <h2 className="text-white text-[22px] font-bold">
            {isEdit ? 'Edit Resale Unit' : 'Add Resale Unit'}
          </h2>
          <button onClick={onClose} className="hover:rotate-90 transition-transform duration-300 cursor-pointer border-none bg-transparent outline-none">
            <Image src="/admin/units/addUnit/close-square.png" alt="Close" width={28} height={28} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide">
          {isLoading && isEdit ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#16273B] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* ── Language Tabs ── */}
              <div className="space-y-4">
                <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl w-fit">
                  {LANG_TABS.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setLangTab(t.key)}
                      className={`px-5 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                        langTab === t.key ? `${t.color} shadow-sm` : 'text-gray-500 hover:text-[#16273B]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm space-y-5">
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#16273B]">
                      Unit Name ({langTab.toUpperCase()}) {langTab === 'en' && '*'}
                    </label>
                    <input
                      type="text"
                      value={form.name[langTab]}
                      onChange={setLangField('name', langTab)}
                      placeholder={`Name in ${LANG_TABS.find((t) => t.key === langTab)?.label}`}
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#16273B]">
                      Description ({langTab.toUpperCase()})
                    </label>
                    <textarea
                      rows={3}
                      value={form.description[langTab]}
                      onChange={setLangField('description', langTab)}
                      placeholder="Description..."
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                </div>
              </div>

              {/* ── Location ── */}
              <div className="space-y-3">
                <h3 className="text-[15px] font-bold text-[#16273B] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16273B]" /> Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-[#16273B]">Country *</label>
                    <input type="text" value={form.country} onChange={setField('country')} placeholder="e.g. Egypt" className={inputCls} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-[#16273B]">City *</label>
                    <input type="text" value={form.city} onChange={setField('city')} placeholder="e.g. Cairo" className={inputCls} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-[#16273B]">Street</label>
                    <input type="text" value={form.street} onChange={setField('street')} placeholder="e.g. 10 Nile St" className={inputCls} />
                  </div>
                </div>
              </div>

              {/* ── Price & Currency ── */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="text-[13px] font-semibold text-[#16273B]">Price</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm((p) => ({ ...p, price: e.target.value ? Number(e.target.value) : '' }))}
                      placeholder="0"
                      className={`flex-1 ${inputCls}`}
                    />
                    <select
                      value={form.currencyCode}
                      onChange={(e) => setForm((p) => ({ ...p, currencyCode: e.target.value }))}
                      className="w-24 border border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#16273B]/20 text-[#16273B] bg-white font-bold text-[13px]"
                    >
                      {['USD', 'EUR', 'EGP'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-[#16273B]">Area (m²) *</label>
                  <input type="number" value={form.area} onChange={(e) => setForm((p) => ({ ...p, area: e.target.value ? Number(e.target.value) : '' }))} min={0} className={inputCls} />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-[#16273B]">Property Type</label>
                  <select value={form.propertyType} onChange={setField('propertyType')} className={inputCls}>
                    {[
                      { label: 'Apartment', value: 'Apartment' },
                      { label: 'Villa', value: 'Villa' },
                      { label: 'Townhouse', value: 'Townhouse' },
                      { label: 'Studio', value: 'Studio' },
                      { label: 'Penthouse', value: 'Penthouse' },
                    ].map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ── Details Grid ── */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Bedrooms', field: 'noBedRoom' },
                  { label: 'Bathrooms', field: 'noBathRoom' },
                  { label: 'Kitchens', field: 'noKitchen' },
                  { label: 'Floor Number', field: 'floorNumber' },
                ] .map(({ label, field }) => (
                  <div key={field} className="space-y-2">
                    <label className="text-[13px] font-semibold text-[#16273B]">{label}</label>
                    <input
                      type="number"
                      min={0}
                      value={form[field as keyof typeof form] as number | ''}
                      onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value ? Number(e.target.value) : '' }))}
                      className={inputCls}
                    />
                  </div>
                ))}
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-[#16273B]">Floor Name</label>
                  <input type="text" value={form.floorName} onChange={setField('floorName')} placeholder="e.g. Ground" className={inputCls} />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-[#16273B]">View</label>
                  <select value={form.view} onChange={setField('view')} className={inputCls}>
                    <option value="">Select View</option>
                    {['Sea', 'Mountain', 'Garden', 'Pool', 'SeaAndPool'].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-[#16273B]">Listing Type</label>
                  <select value={form.type} onChange={setField('type')} className={inputCls}>
                    <option value="Buy">Buy</option>
                    <option value="Rent">Rent</option>
                  </select>
                </div>
                <div className="space-y-2 flex flex-col justify-end">
                  <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))}
                      className="w-4 h-4 accent-[#16273B] cursor-pointer"
                    />
                    <span className="text-[13px] font-semibold text-[#16273B]">Featured</span>
                  </label>
                </div>
              </div>

              {/* ── Payment Plans ── */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-[15px] font-bold text-[#16273B]">Payment Plans</h3>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        paymentPlans: [
                          ...p.paymentPlans,
                          { commissionRate: 0, installmentMothes: 0, installmentDownPayment: 0, paymentType: 'Installment' },
                        ],
                      }))
                    }
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-[#16273B] px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    + Add Plan
                  </button>
                </div>
                {form.paymentPlans.map((plan, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 border border-gray-200 rounded-2xl bg-gray-50/50">
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-semibold text-gray-600">Type</label>
                        <select
                          value={plan.paymentType}
                          onChange={(e) => updatePlan(i, 'paymentType', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16273B]/20 bg-white"
                        >
                          <option value="Installment">Installment</option>
                          <option value="Cash">Cash</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-semibold text-gray-600">Commission %</label>
                        <input
                          type="number" min={0} max={100}
                          value={plan.commissionRate}
                          onChange={(e) => updatePlan(i, 'commissionRate', e.target.value ? Number(e.target.value) : 0)}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16273B]/20"
                        />
                      </div>
                      {plan.paymentType === 'Installment' ? (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-[12px] font-semibold text-gray-600">Months</label>
                            <input
                              type="number" min={0}
                              value={plan.installmentMothes}
                              onChange={(e) => updatePlan(i, 'installmentMothes', e.target.value ? Number(e.target.value) : 0)}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16273B]/20"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[12px] font-semibold text-gray-600">Down Payment %</label>
                            <input
                              type="number" min={0} max={100}
                              value={plan.installmentDownPayment}
                              onChange={(e) => updatePlan(i, 'installmentDownPayment', e.target.value ? Number(e.target.value) : 0)}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16273B]/20"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="space-y-1.5 col-span-2 flex flex-col justify-center">
                           <label className="text-[12px] font-semibold text-gray-600">Cash Amount</label>
                           <p className="text-[14px] font-bold text-[#16273B]">{form.currencyCode} {form.price.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, paymentPlans: p.paymentPlans.filter((_, idx) => idx !== i) }))}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors mt-5 cursor-pointer"
                    >✕</button>
                  </div>
                ))}
              </div>

              {/* ── Image Upload (create only) ── */}
              {!isEdit && (
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <h3 className="text-[15px] font-bold text-[#16273B]">Images</h3>
                  <label className="border-2 border-dashed border-gray-200 hover:border-[#16273B]/30 bg-gray-50/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors">
                    <span className="text-2xl">🖼️</span>
                    <p className="text-gray-600 font-semibold text-sm">Click to upload images</p>
                    <p className="text-gray-400 text-xs">You can upload multiple files</p>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                  </label>
                  {imagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {imagePreviews.map((src, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-200 group">
                          <Image src={src} alt="" fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                          >×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 shrink-0 flex justify-end gap-3 bg-white rounded-b-[32px]">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-8 py-3.5 rounded-2xl border border-gray-200 text-[15px] font-semibold text-[#64748B] hover:bg-gray-50 transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-10 py-3.5 rounded-2xl bg-[#16273B] text-white text-[15px] font-semibold hover:bg-[#1e324d] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isEdit ? 'Saving…' : 'Creating…'}
              </>
            ) : isEdit ? (
              'Save Changes'
            ) : (
              'Create Unit'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
