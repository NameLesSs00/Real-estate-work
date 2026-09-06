'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Check, ChevronDown, ImagePlus, Loader2, Plus, Trash2, X } from 'lucide-react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { getServices, type Service } from '@/lib/api/services';
import { getFacilityServiceIcon } from '@/lib/icons/facilityServiceIcons';
import {
  addUnitOutsideImages,
  createUnitOutside,
  getUnitOutsideById,
  UNIT_OUTSIDE_CURRENCIES,
  UNIT_OUTSIDE_PROPERTY_TYPES,
  type UnitOutside,
  type UnitOutsideImage,
  type UnitOutsidePrice,
  updateUnitOutside,
  deleteUnitOutsideImage,
} from '@/lib/api/unitOutsides';
import { API_DOMAIN } from '@/lib/api/config';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: UnitOutside | null;
}

type Lang = 'en' | 'de' | 'it';

interface PlanDraft {
  id?: number;
  commissionRate: number | '';
  installmentMothes: number | '';
  installmentDownPayment: number | '';
  paymentType: string;
}

interface FormState {
  name: Record<Lang, string>;
  description: Record<Lang, string>;
  prices: UnitOutsidePrice[];
  area: number | '';
  noBedRoom: number | '';
  noBathRoom: number | '';
  noKitchen: number | '';
  noFloor: number | '';
  country: string;
  city: string;
  street: string;
  propertyType: string;
  floorNumber: number | '';
  floorName: string;
  view: string;
  type: string;
  isFeatured: boolean;
  serviceIds: number[];
  paymentPlans: PlanDraft[];
}

const makePrices = (prices: UnitOutsidePrice[] = []): UnitOutsidePrice[] =>
  UNIT_OUTSIDE_CURRENCIES.map((currency) => {
    const existing = prices.find((price) => price.currency?.toUpperCase() === currency);
    return {
      id: existing?.id,
      currency,
      price: existing?.price ?? 0,
    };
  });

const EMPTY: FormState = {
  name: { en: '', de: '', it: '' },
  description: { en: '', de: '', it: '' },
  prices: makePrices(),
  area: '',
  noBedRoom: '',
  noBathRoom: '',
  noKitchen: '',
  noFloor: '',
  country: '',
  city: '',
  street: '',
  propertyType: 'Apartment',
  floorNumber: '',
  floorName: '',
  view: '',
  type: 'Buy',
  isFeatured: false,
  serviceIds: [],
  paymentPlans: [],
};

const LANG_TABS = [
  { key: 'en', label: 'English' },
  { key: 'de', label: 'German' },
  { key: 'it', label: 'Italian' },
] as const;

const LISTING_TYPES = ['Buy', 'Rent'] as const;

const inputCls =
  'w-full rounded-xl border border-brand-divider bg-white px-4 py-3 text-[14px] font-semibold text-brand-primary outline-none transition focus:border-brand-secondary focus:ring-4 focus:ring-brand-primary/5 placeholder:text-brand-muted-light';

const labelCls = 'text-[13px] font-bold text-brand-primary';

const getLocalizedValue = (value: string | Record<string, string> | null | undefined, lang: Lang) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value.en || value.de || value.it || '';
};

function resolveImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_DOMAIN}${url.startsWith('/') ? '' : '/'}${url}`;
}

export default function AddUnitOutsideModal({ isOpen, onClose, onSuccess, editData }: Props) {
  useBodyScrollLock(isOpen);
  useEscapeKey(onClose, isOpen);

  const { getLocalized } = useLanguage();
  const isEdit = Boolean(editData);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [services, setServices] = useState<Service[]>([]);
  const [existingImages, setExistingImages] = useState<UnitOutsideImage[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [langTab, setLangTab] = useState<Lang>('en');

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    getServices()
      .then((items) => {
        if (mounted) setServices(items);
      })
      .catch(() => {
        if (mounted) setServices([]);
      });

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setForm(EMPTY);
      setExistingImages([]);
      setImageFiles([]);
      setImagePreviews([]);
      setError('');
      setLangTab('en');
      return;
    }

    if (!isEdit || !editData) {
      setForm({ ...EMPTY, prices: makePrices() });
      setExistingImages([]);
      return;
    }

    let mounted = true;
    setIsLoading(true);
    setError('');

    Promise.all([
      getUnitOutsideById(editData.id, 'en'),
      getUnitOutsideById(editData.id, 'de'),
      getUnitOutsideById(editData.id, 'it'),
    ])
      .then(([enData, deData, itData]) => {
        if (!mounted) return;
        setForm({
          name: {
            en: getLocalizedValue(enData.name, 'en'),
            de: getLocalizedValue(deData.name, 'de'),
            it: getLocalizedValue(itData.name, 'it'),
          },
          description: {
            en: getLocalizedValue(enData.description, 'en'),
            de: getLocalizedValue(deData.description, 'de'),
            it: getLocalizedValue(itData.description, 'it'),
          },
          prices: makePrices(enData.prices),
          area: enData.area ?? '',
          noBedRoom: enData.noBedRoom ?? '',
          noBathRoom: enData.noBathRoom ?? '',
          noKitchen: enData.noKitchen ?? '',
          noFloor: enData.noFloor ?? '',
          country: enData.country ?? '',
          city: enData.city ?? '',
          street: enData.street ?? '',
          propertyType: enData.propertyType || 'Apartment',
          floorNumber: enData.floorNumber ?? '',
          floorName: enData.floorName ?? '',
          view: enData.view ?? '',
          type: enData.type || 'Buy',
          isFeatured: enData.isFeatured ?? false,
          serviceIds: enData.serviceIds ?? [],
          paymentPlans: (enData.paymentPlans ?? []).map((plan) => {
            const isCashPlan = plan.paymentType === 'Cash';

            return {
              id: plan.id,
              commissionRate: isCashPlan ? 0 : plan.commissionRate ?? 0,
              installmentMothes: isCashPlan ? 0 : plan.installmentMothes ?? 0,
              installmentDownPayment: isCashPlan ? 0 : plan.installmentDownPayment ?? 0,
              paymentType: plan.paymentType ?? 'Installment',
            };
          }),
        });
        setExistingImages(enData.images ?? []);
      })
      .catch(() => setError('Failed to load unit data.'))
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isOpen, isEdit, editData]);

  const selectedServices = useMemo(() => {
    return services.filter((service) => form.serviceIds.includes(service.id));
  }, [form.serviceIds, services]);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError('');
  };

  const updateLangField = (field: 'name' | 'description', lang: Lang, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: { ...current[field], [lang]: value },
    }));
    setError('');
  };

  const updatePrice = (currency: string, value: string) => {
    const numericValue = Number(value) || 0;
    setForm((current) => ({
      ...current,
      prices: current.prices.map((price) => price.currency === currency ? { ...price, price: numericValue } : price),
    }));
    setError('');
  };

  const updatePlan = (index: number, key: keyof PlanDraft, value: string | number) => {
    setForm((current) => ({
      ...current,
      paymentPlans: current.paymentPlans.map((plan, planIndex) => {
        if (planIndex !== index) return plan;

        if (key === 'paymentType') {
          if (value === 'Cash') {
            return {
              ...plan,
              paymentType: 'Cash',
              commissionRate: 0,
              installmentMothes: 0,
              installmentDownPayment: 0,
            };
          }

          return {
            ...plan,
            paymentType: String(value),
            commissionRate: plan.commissionRate ?? 0,
            installmentMothes: plan.installmentMothes ?? 1,
            installmentDownPayment: plan.installmentDownPayment ?? 0,
          };
        }

        return { ...plan, [key]: value };
      }),
    }));
    setError('');
  };

  const toggleService = (serviceId: number) => {
    setForm((current) => ({
      ...current,
      serviceIds: current.serviceIds.includes(serviceId)
        ? current.serviceIds.filter((id) => id !== serviceId)
        : [...current.serviceIds, serviceId],
    }));
    setError('');
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setImageFiles((current) => [...current, ...files]);
    setImagePreviews((current) => [...current, ...files.map((file) => URL.createObjectURL(file))]);
  };

  const removeImage = (index: number) => {
    setImageFiles((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setImagePreviews((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const removeExistingImage = async (imageId: number) => {
    if (!editData) return;

    setDeletingImageId(imageId);
    setError('');
    try {
      await deleteUnitOutsideImage(editData.id, imageId);
      setExistingImages((current) => current.filter((image) => image.id !== imageId));
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete image.');
    } finally {
      setDeletingImageId(null);
    }
  };

  const validate = () => {
    if (!form.name.en.trim()) return 'English name is required.';
    if (!form.description.en.trim()) return 'English description is required.';
    if (!form.country.trim()) return 'Country is required.';
    if (!form.city.trim()) return 'City is required.';
    if (!form.street.trim()) return 'Street is required.';
    if (!form.area || Number(form.area) <= 0) return 'Area must be greater than 0.';
    if (form.noBedRoom === '') return 'Number of bedrooms is required.';
    if (form.noBathRoom === '') return 'Number of bathrooms is required.';
    if (form.noKitchen === '') return 'Number of kitchens is required.';
    if (form.noFloor === '') return 'Number of floors is required.';
    if (form.floorNumber === '') return 'Floor number is required.';
    if (!form.view.trim()) return 'View is required.';
    if (!LISTING_TYPES.includes(form.type as typeof LISTING_TYPES[number])) return 'Listing type is required.';
    if (form.prices.some((price) => !price.currency || Number(price.price) <= 0)) return 'Please enter prices for USD, EGP, EUR, and GBP.';
    if (form.paymentPlans.some((plan) => plan.paymentType === 'Installment' && Number(plan.installmentMothes) <= 0)) {
      return 'Installment plans must have months greater than 0.';
    }
    return '';
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const paymentPlan = form.paymentPlans.map((plan) => {
      const isCash = plan.paymentType === 'Cash';
      return {
        commissionRate: isCash ? 0 : Number(plan.commissionRate) || 0,
        installmentMothes: isCash ? 0 : Number(plan.installmentMothes) || 0,
        installmentDownPayment: isCash ? 0 : Number(plan.installmentDownPayment) || 0,
        paymentType: plan.paymentType,
      };
    });

    const payload = {
      name: {
        en: form.name.en.trim(),
        de: form.name.de.trim() || form.name.en.trim(),
        it: form.name.it.trim() || form.name.en.trim(),
      },
      description: {
        en: form.description.en.trim(),
        de: form.description.de.trim() || form.description.en.trim(),
        it: form.description.it.trim() || form.description.en.trim(),
      },
      price: 0,
      currencyCode: 'EGP',
      area: Number(form.area) || 0,
      noBathRoom: Number(form.noBathRoom) || 0,
      noBedRoom: Number(form.noBedRoom) || 0,
      noKitchen: Number(form.noKitchen) || 0,
      country: form.country.trim(),
      city: form.city.trim(),
      street: form.street.trim(),
      propertyType: form.propertyType,
      floorNumber: Number(form.floorNumber) || 0,
      view: form.view.trim(),
      type: form.type,
      floorName: form.floorName.trim(),
      isFeatured: form.isFeatured,
      isSoldOutside: false,
      noFloor: Number(form.noFloor) || 0,
      prices: form.prices.map((price) => ({ id: price.id, currency: price.currency, price: Number(price.price) || 0 })),
      paymentPlan,
      serviceIds: form.serviceIds,
    };

    setIsLoading(true);
    setError('');
    try {
      if (isEdit && editData) {
        await updateUnitOutside(editData.id, { ...payload, id: editData.id });
        if (imageFiles.length > 0) {
          await addUnitOutsideImages(editData.id, imageFiles);
        }
      } else {
        const newId = await createUnitOutside(payload);
        if (imageFiles.length > 0 && newId) {
          await addUnitOutsideImages(Number(newId), imageFiles);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-inter backdrop-blur-sm">
      <div className="flex max-h-[94vh] w-full max-w-[1120px] flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between bg-brand-primary px-6 py-5 sm:px-8">
          <div>
            <h2 className="text-[22px] font-bold text-white">{isEdit ? 'Edit Resale Unit' : 'Add Resale Unit'}</h2>
            <p className="mt-1 text-[13px] font-semibold text-white/60">Use multi-currency prices from the new resale endpoint.</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-admin-bg p-5 sm:p-8">
          {isLoading && isEdit ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-brand-primary" size={38} />
            </div>
          ) : (
            <div className="space-y-7">
              <section className="rounded-[22px] border border-brand-divider bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex flex-wrap gap-2">
                  {LANG_TABS.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setLangTab(tab.key)}
                      className={`rounded-xl px-4 py-2 text-[13px] font-bold transition ${
                        langTab === tab.key ? 'bg-brand-primary text-white' : 'bg-brand-primary-soft text-brand-muted hover:text-brand-primary'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className={labelCls}>Unit Name ({langTab.toUpperCase()}) {langTab === 'en' && '*'}</label>
                    <input
                      type="text"
                      value={form.name[langTab]}
                      onChange={(event) => updateLangField('name', langTab, event.target.value)}
                      className={inputCls}
                      placeholder={`Name in ${LANG_TABS.find((tab) => tab.key === langTab)?.label}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Description ({langTab.toUpperCase()}) {langTab === 'en' && '*'}</label>
                    <textarea
                      rows={4}
                      value={form.description[langTab]}
                      onChange={(event) => updateLangField('description', langTab, event.target.value)}
                      className={`${inputCls} resize-none`}
                      placeholder="Description..."
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-[22px] border border-brand-divider bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <h3 className="text-[17px] font-black text-brand-primary">Pricing</h3>
                  <span className="rounded-full bg-brand-primary-soft px-3 py-1 text-[12px] font-bold text-brand-muted">
                    Required in 4 currencies
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {form.prices.map((price) => (
                    <div key={price.currency} className="rounded-2xl border border-brand-divider bg-brand-bg p-4">
                      <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.12em] text-brand-primary">
                        {price.currency}
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={price.price || ''}
                        onChange={(event) => updatePrice(price.currency, event.target.value)}
                        className={inputCls}
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[22px] border border-brand-divider bg-white p-5 shadow-sm sm:p-6">
                <h3 className="mb-5 text-[17px] font-black text-brand-primary">Location and Details</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className={labelCls}>Country *</label>
                    <input value={form.country} onChange={(event) => updateField('country', event.target.value)} className={inputCls} placeholder="Egypt" />
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>City *</label>
                    <input value={form.city} onChange={(event) => updateField('city', event.target.value)} className={inputCls} placeholder="Hurghada" />
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Street *</label>
                    <input value={form.street} onChange={(event) => updateField('street', event.target.value)} className={inputCls} placeholder="Street" />
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Property Type *</label>
                    <div className="relative">
                      <select value={form.propertyType} onChange={(event) => updateField('propertyType', event.target.value)} className={`${inputCls} appearance-none pr-10`}>
                        {UNIT_OUTSIDE_PROPERTY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>Listing Type *</label>
                    <div className="relative">
                      <select value={form.type} onChange={(event) => updateField('type', event.target.value)} className={`${inputCls} appearance-none pr-10`}>
                        {LISTING_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
                    </div>
                  </div>
                  {[
                    ['area', 'Area (m2) *'],
                    ['noBedRoom', 'Bedrooms *'],
                    ['noBathRoom', 'Bathrooms *'],
                    ['noKitchen', 'Kitchens *'],
                    ['noFloor', 'Building Floors *'],
                    ['floorNumber', 'Unit Floor *'],
                  ].map(([field, label]) => (
                    <div key={field} className="space-y-2">
                      <label className={labelCls}>{label}</label>
                      <input
                        type="number"
                        min={0}
                        value={form[field as keyof FormState] as number | ''}
                        onChange={(event) => updateField(field as keyof FormState, (event.target.value ? Number(event.target.value) : '') as never)}
                        className={inputCls}
                      />
                    </div>
                  ))}
                  <div className="space-y-2">
                    <label className={labelCls}>Floor Name</label>
                    <input value={form.floorName} onChange={(event) => updateField('floorName', event.target.value)} className={inputCls} placeholder="Ground" />
                  </div>
                  <div className="space-y-2">
                    <label className={labelCls}>View *</label>
                    <input value={form.view} onChange={(event) => updateField('view', event.target.value)} className={inputCls} placeholder="Sea View" />
                  </div>
                  <label className="flex min-h-[48px] cursor-pointer items-center justify-between gap-4 self-end rounded-xl border border-brand-divider bg-brand-bg px-4 py-3">
                    <span className="text-[14px] font-bold text-brand-primary">Featured Unit</span>
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(event) => updateField('isFeatured', event.target.checked)}
                      className="h-5 w-5 accent-brand-primary"
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-[22px] border border-brand-divider bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-[17px] font-black text-brand-primary">Services</h3>
                    <p className="mt-1 text-[13px] font-semibold text-brand-muted">Optional. Select any services included with this resale unit.</p>
                  </div>
                  {selectedServices.length > 0 && (
                    <span className="rounded-full bg-status-success-bg px-3 py-1 text-[12px] font-bold text-status-success">
                      {selectedServices.length} selected
                    </span>
                  )}
                </div>
                {services.length === 0 ? (
                  <p className="rounded-xl bg-brand-bg px-4 py-3 text-[14px] font-semibold text-brand-muted">No services available.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => {
                      const checked = form.serviceIds.includes(service.id);
                      const ServiceIcon = getFacilityServiceIcon(service.icon);
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => toggleService(service.id)}
                          className={`flex min-h-[52px] items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition ${
                            checked ? 'border-brand-primary bg-brand-primary text-white' : 'border-brand-divider bg-white text-brand-primary hover:border-brand-secondary'
                          }`}
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <span
                              className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                                checked ? 'bg-white/15 text-white' : 'bg-brand-secondary/10 text-brand-secondary'
                              }`}
                            >
                              <ServiceIcon size={18} />
                            </span>
                            <span className="line-clamp-1 text-[14px] font-bold">{getLocalized(service.name)}</span>
                          </span>
                          {checked && <Check size={17} className="shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="rounded-[22px] border border-brand-divider bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-[17px] font-black text-brand-primary">Payment Plans</h3>
                    <p className="mt-1 text-[13px] font-semibold text-brand-muted">Optional. It is okay to leave this empty.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField('paymentPlans', [
                      ...form.paymentPlans,
                      { commissionRate: 0, installmentMothes: 1, installmentDownPayment: 0, paymentType: 'Installment' },
                    ])}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-[13px] font-bold text-white"
                  >
                    <Plus size={16} />
                    Add Plan
                  </button>
                </div>

                {form.paymentPlans.length === 0 ? (
                  <p className="rounded-xl bg-brand-bg px-4 py-3 text-[14px] font-semibold text-brand-muted">No payment plans added.</p>
                ) : (
                  <div className="space-y-4">
                    {form.paymentPlans.map((plan, index) => {
                      const isCash = plan.paymentType === 'Cash';
                      const disabledInputClass = isCash ? 'cursor-not-allowed bg-gray-100 text-brand-muted-light' : '';

                      return (
                        <div key={index} className="rounded-2xl border border-brand-divider bg-brand-bg p-4 sm:p-5">
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[14px] font-black text-brand-primary">Plan {index + 1}</p>
                              <p className="mt-0.5 text-[12px] font-semibold text-brand-muted">
                                {isCash ? 'Cash plan keeps the other fields at 0.' : 'Installment plan needs months; commission and down payment can be zero.'}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => updateField('paymentPlans', form.paymentPlans.filter((_, planIndex) => planIndex !== index))}
                              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100"
                              aria-label={`Remove plan ${index + 1}`}
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <div className="space-y-2">
                              <label className={labelCls}>Payment Type</label>
                              <div className="relative">
                                <select
                                  value={plan.paymentType}
                                  onChange={(event) => updatePlan(index, 'paymentType', event.target.value)}
                                  className={`${inputCls} appearance-none pr-10`}
                                >
                                  <option value="Installment">Installment</option>
                                  <option value="Cash">Cash</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className={labelCls}>Commission Rate (%)</label>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                disabled={isCash}
                                value={isCash ? 0 : plan.commissionRate ?? ''}
                                onChange={(event) => updatePlan(index, 'commissionRate', event.target.value ? Number(event.target.value) : 0)}
                                className={`${inputCls} ${disabledInputClass}`}
                                placeholder="0"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className={labelCls}>Installment Months</label>
                              <input
                                type="number"
                                min={0}
                                disabled={isCash}
                                value={isCash ? 0 : plan.installmentMothes ?? ''}
                                onChange={(event) => updatePlan(index, 'installmentMothes', event.target.value ? Number(event.target.value) : 0)}
                                className={`${inputCls} ${disabledInputClass}`}
                                placeholder="12"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className={labelCls}>Down Payment (%)</label>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                disabled={isCash}
                                value={isCash ? 0 : plan.installmentDownPayment ?? ''}
                                onChange={(event) => updatePlan(index, 'installmentDownPayment', event.target.value ? Number(event.target.value) : 0)}
                                className={`${inputCls} ${disabledInputClass}`}
                                placeholder="0"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="rounded-[22px] border border-brand-divider bg-white p-5 shadow-sm sm:p-6">
                <h3 className="mb-4 text-[17px] font-black text-brand-primary">Images</h3>
                {isEdit && (
                  <div className="mb-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-[13px] font-bold text-brand-primary">Current Images</p>
                      {existingImages.length > 0 && (
                        <span className="text-[12px] font-semibold text-brand-muted">{existingImages.length} uploaded</span>
                      )}
                    </div>
                    {existingImages.length === 0 ? (
                      <p className="rounded-xl bg-brand-bg px-4 py-3 text-[13px] font-semibold text-brand-muted">No images uploaded yet.</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                        {existingImages.map((image, index) => (
                          <div key={image.id} className="group relative aspect-square overflow-hidden rounded-xl border border-brand-divider bg-brand-bg">
                            <Image
                              src={resolveImageUrl(image.imageUrl)}
                              alt={`Unit image ${index + 1}`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            {image.isPrimary && (
                              <span className="absolute left-2 top-2 rounded-lg bg-brand-secondary px-2 py-1 text-[10px] font-black uppercase text-white">
                                Primary
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => removeExistingImage(image.id)}
                              disabled={deletingImageId === image.id || isLoading}
                              className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-red-600 text-white opacity-100 shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:opacity-0 sm:group-hover:opacity-100"
                              aria-label={`Delete image ${index + 1}`}
                            >
                              {deletingImageId === image.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-brand-divider bg-brand-bg px-5 py-8 text-center transition hover:border-brand-secondary">
                  <ImagePlus className="text-brand-secondary" size={30} />
                  <span className="text-[14px] font-bold text-brand-primary">{isEdit ? 'Add more images' : 'Upload images'}</span>
                  <span className="text-[12px] font-semibold text-brand-muted">You can select multiple files.</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                </label>
                {imagePreviews.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {imagePreviews.map((src, index) => (
                      <div key={src} className="relative h-20 w-20 overflow-hidden rounded-xl border border-brand-divider">
                        <Image src={src} alt="" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-red-600 text-white"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[14px] font-semibold text-red-600">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-brand-divider bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-8">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-2xl border border-brand-divider px-8 py-3.5 text-[15px] font-bold text-brand-primary transition hover:bg-brand-bg disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-9 py-3.5 text-[15px] font-bold text-white transition hover:bg-brand-primary-hover disabled:opacity-60"
          >
            {isLoading && <Loader2 size={17} className="animate-spin" />}
            {isEdit ? 'Save Changes' : 'Create Unit'}
          </button>
        </div>
      </div>
    </div>
  );
}
