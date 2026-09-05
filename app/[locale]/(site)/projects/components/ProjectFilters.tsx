'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Filter,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
  UserRound,
  X,
} from 'lucide-react';
import { getDevelopers } from '@/lib/api/developers';
import { getFacilities, Facility } from '@/lib/api/facilities';
import { getLocations, Location } from '@/lib/api/locations';
import { getProjectTypes, ProjectType } from '@/lib/api/projectTypes';
import { useLanguage, type Language } from '@/lib/contexts/LanguageContext';

export interface ProjectFilterValues {
  searchTerm: string;
  locationId: string;
  developerId: string;
  projectTypeId: string;
  facilityId: string;
  minimumPrice: string;
  maximumPrice: string;
  priceCurrency: string;
  furnitureType: string;
  isFurniture: string;
  isFeature: string;
  deliveryDateFrom: string;
  deliveryDateTo: string;
  sortBy: string;
  sortDirection: string;
}

interface ProjectFiltersProps {
  values: ProjectFilterValues;
  onApply: (values: ProjectFilterValues) => void;
  onClear: () => void;
  isLoading?: boolean;
}

interface FilterOption {
  id: number;
  label: string;
}

export const EMPTY_PROJECT_FILTERS: ProjectFilterValues = {
  searchTerm: '',
  locationId: '',
  developerId: '',
  projectTypeId: '',
  facilityId: '',
  minimumPrice: '',
  maximumPrice: '',
  priceCurrency: '',
  furnitureType: '',
  isFurniture: '',
  isFeature: '',
  deliveryDateFrom: '',
  deliveryDateTo: '',
  sortBy: '',
  sortDirection: '',
};

const CURRENCIES = ['USD', 'EGP', 'EUR', 'GBP'];

const FINISHING_OPTIONS = [
  { value: '0', labelKey: 'projects.filters.needsFinishing' },
  { value: '1', labelKey: 'projects.filters.semiFinished' },
  { value: '2', labelKey: 'projects.filters.fullyFinished' },
];

const SORT_OPTIONS = [
  { value: 'Name', labelKey: 'projects.filters.sortName' },
  { value: 'MinimumPrice', labelKey: 'projects.filters.sortPrice' },
  { value: 'DeliveryDate', labelKey: 'projects.filters.sortDelivery' },
  { value: 'CreatedAt', labelKey: 'projects.filters.sortNewest' },
];

const getLocationLabel = (location: Location) => {
  return [
    location.mainLocation || location.city,
    location.subLocation || location.district,
  ].filter(Boolean).join(' - ') || `#${location.id}`;
};

const getLocalizedValue = (value: string | Record<string, string> | null | undefined, language: Language) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[language] || value.en || Object.values(value).find((entry) => typeof entry === 'string' && entry.trim() !== '') || '';
};

const getOptionName = (value: string | Record<string, string> | null | undefined, fallback: string, language: Language) => {
  return getLocalizedValue(value, language) || fallback;
};

export default function ProjectFilters({ values, onApply, onClear, isLoading = false }: ProjectFiltersProps) {
  const { t, language } = useLanguage();
  const [draft, setDraft] = useState<ProjectFilterValues>(values);
  const [locations, setLocations] = useState<FilterOption[]>([]);
  const [developers, setDevelopers] = useState<FilterOption[]>([]);
  const [projectTypes, setProjectTypes] = useState<FilterOption[]>([]);
  const [facilities, setFacilities] = useState<FilterOption[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setDraft(values);
  }, [values]);

  useEffect(() => {
    let isMounted = true;

    const loadOptions = async () => {
      try {
        const [locationsPage, developersPage, projectTypesPage, facilitiesList] = await Promise.all([
          getLocations({ pageNumber: 1, pageSize: 100 }),
          getDevelopers(1),
          getProjectTypes({ pageNumber: 1, pageSize: 100 }),
          getFacilities(),
        ]);

        if (!isMounted) return;

        setLocations((locationsPage.items ?? []).map((location) => ({ id: location.id, label: getLocationLabel(location) })));
        setDevelopers((developersPage.items ?? []).map((developer) => ({ id: developer.id, label: developer.name })));
        setProjectTypes((projectTypesPage.items ?? []).map((projectType: ProjectType) => ({
          id: projectType.id,
          label: getOptionName(projectType.name, `#${projectType.id}`, language),
        })));
        setFacilities((facilitiesList ?? []).map((facility: Facility) => ({
          id: facility.id,
          label: getOptionName(facility.name, `#${facility.id}`, language),
        })));
      } catch {
        if (!isMounted) return;
        setLocations([]);
        setDevelopers([]);
        setProjectTypes([]);
        setFacilities([]);
      }
    };

    loadOptions();

    return () => {
      isMounted = false;
    };
  }, [language]);

  const activeFilterCount = useMemo(() => {
    return Object.values(values).filter(Boolean).length;
  }, [values]);

  const updateDraft = (field: keyof ProjectFilterValues, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setError('');
  };

  const validateAndApply = () => {
    const min = draft.minimumPrice ? Number(draft.minimumPrice) : null;
    const max = draft.maximumPrice ? Number(draft.maximumPrice) : null;

    if ((min !== null && !Number.isFinite(min)) || (max !== null && !Number.isFinite(max))) {
      setError(t('projects.filters.invalidPrice'));
      return;
    }

    if (min !== null && max !== null && min > max) {
      setError(t('projects.filters.priceOrderError'));
      return;
    }

    if (draft.deliveryDateFrom && draft.deliveryDateTo && new Date(draft.deliveryDateFrom) > new Date(draft.deliveryDateTo)) {
      setError(t('projects.filters.dateOrderError'));
      return;
    }

    onApply(draft);
    setIsSidebarOpen(false);
  };

  const handleClear = () => {
    setDraft(EMPTY_PROJECT_FILTERS);
    setError('');
    onClear();
    setIsSidebarOpen(false);
  };

  const closeSidebar = () => {
    setDraft(values);
    setError('');
    setIsSidebarOpen(false);
  };

  const openSidebar = () => {
    setDraft((current) => ({ ...values, searchTerm: current.searchTerm }));
    setError('');
    setIsSidebarOpen(true);
  };

  const selectClass = 'absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0';
  const fieldClass = 'relative flex h-[56px] items-center justify-between border-b border-brand-divider bg-transparent text-brand-primary transition focus-within:border-brand-secondary';
  const textInputClass = 'h-[56px] w-full border-b border-brand-divider bg-transparent text-[16px] font-semibold text-brand-primary outline-none transition placeholder:text-brand-muted focus:border-brand-secondary';
  const sectionClass = 'space-y-4';
  const labelClass = 'text-[15px] font-bold leading-6 text-brand-primary';

  const renderSelect = (
    icon: React.ReactNode,
    label: string,
    value: string,
    onChange: (value: string) => void,
    options: { value: string; label: string }[],
  ) => (
    <div className={fieldClass}>
      <div className="flex min-w-0 items-center gap-3">
        <span className="shrink-0 text-brand-secondary">{icon}</span>
        <span className={`truncate text-[16px] font-semibold ${value ? 'text-brand-primary' : 'text-brand-muted'}`}>{label}</span>
      </div>
      <ChevronDown size={17} className="shrink-0 text-brand-muted-light" />
      <select value={value} onChange={(event) => onChange(event.target.value)} className={selectClass}>
        {options.map((option) => <option key={option.value || 'empty'} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  );

  const renderCheckbox = (
    checked: boolean,
    onChange: (checked: boolean) => void,
    label: string,
    icon: React.ReactNode,
  ) => (
    <label className="flex min-h-[60px] cursor-pointer items-center justify-between gap-4 rounded-2xl border border-brand-divider bg-white px-4 py-3 transition hover:border-brand-secondary/40">
      <span className="flex min-w-0 items-center gap-3 text-[16px] font-semibold text-brand-primary">
        <span className="shrink-0 text-brand-secondary">{icon}</span>
        <span className="truncate">{label}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 rounded border-brand-divider accent-brand-primary"
      />
    </label>
  );

  const finishingLabel = FINISHING_OPTIONS.find((option) => option.value === draft.furnitureType)?.labelKey;
  const sortLabel = SORT_OPTIONS.find((option) => option.value === draft.sortBy)?.labelKey;

  return (
    <>
      <div className="rounded-[24px] border border-brand-divider bg-white p-4 shadow-[0_18px_55px_rgba(7,44,62,0.08)] sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search size={19} className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-muted-light" />
            <input
              type="text"
              value={draft.searchTerm}
              onChange={(event) => updateDraft('searchTerm', event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') validateAndApply();
              }}
              className="h-[58px] w-full rounded-2xl border border-brand-divider bg-brand-primary-soft/30 pl-14 pr-4 text-[16px] font-semibold text-brand-primary outline-none transition placeholder:text-brand-muted focus:bg-white focus:ring-4 focus:ring-brand-primary/5"
              placeholder={t('projects.filters.searchPlaceholder')}
            />
          </div>
          <button
            type="button"
            onClick={validateAndApply}
            disabled={isLoading}
            className="inline-flex h-[58px] items-center justify-center gap-2 rounded-2xl bg-brand-primary px-6 text-[15px] font-bold text-white transition hover:bg-brand-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Search size={17} />
            {isLoading ? t('projects.filters.searching') : t('projects.filters.apply')}
          </button>
          <button
            type="button"
            onClick={openSidebar}
            className="inline-flex h-[58px] items-center justify-center gap-2 rounded-2xl border border-brand-divider bg-white px-5 text-[15px] font-bold text-brand-primary transition hover:bg-brand-primary-soft"
          >
            <Filter size={17} />
            {t('projects.filters.filters')}
            {activeFilterCount > 0 && <span className="rounded-full bg-brand-primary px-2.5 py-1 text-[12px] font-bold text-white">{activeFilterCount}</span>}
          </button>
        </div>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end font-poppins">
          <button
            type="button"
            aria-label={t('projects.filters.close')}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={closeSidebar}
          />
          <aside className="relative flex h-full w-full max-w-[500px] animate-in slide-in-from-right flex-col bg-brand-bg shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-brand-divider bg-white p-6 sm:p-8">
              <div>
                <h2 className="font-radley text-[30px] leading-tight text-brand-primary">{t('projects.filters.title')}</h2>
                {activeFilterCount > 0 && (
                  <p className="mt-1 text-[14px] font-semibold text-brand-muted">
                    {activeFilterCount} {t('projects.filters.active')}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={closeSidebar}
                className="grid h-11 w-11 place-items-center rounded-full bg-brand-bg text-brand-primary transition hover:bg-brand-divider"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-9 overflow-y-auto p-6 sm:p-8">
              <div className={sectionClass}>
                <label className={labelClass}>{t('projects.filters.searchKeywords')}</label>
                <input
                  type="text"
                  value={draft.searchTerm}
                  onChange={(event) => updateDraft('searchTerm', event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') validateAndApply();
                  }}
                  className={textInputClass}
                  placeholder={t('projects.filters.searchPlaceholder')}
                />
              </div>

              <div className={sectionClass}>
                <label className={labelClass}>{t('projects.filters.locationDeveloper')}</label>
                {renderSelect(
                  <MapPin size={18} />,
                  locations.find((location) => String(location.id) === draft.locationId)?.label || t('projects.filters.allLocations'),
                  draft.locationId,
                  (value) => updateDraft('locationId', value),
                  [{ value: '', label: t('projects.filters.allLocations') }, ...locations.map((location) => ({ value: String(location.id), label: location.label }))],
                )}
                {renderSelect(
                  <UserRound size={18} />,
                  developers.find((developer) => String(developer.id) === draft.developerId)?.label || t('projects.filters.allDevelopers'),
                  draft.developerId,
                  (value) => updateDraft('developerId', value),
                  [{ value: '', label: t('projects.filters.allDevelopers') }, ...developers.map((developer) => ({ value: String(developer.id), label: developer.label }))],
                )}
              </div>

              <div className={sectionClass}>
                <label className={labelClass}>{t('projects.filters.projectDetails')}</label>
                {renderSelect(
                  <Building2 size={18} />,
                  projectTypes.find((projectType) => String(projectType.id) === draft.projectTypeId)?.label || t('projects.filters.allProjectTypes'),
                  draft.projectTypeId,
                  (value) => updateDraft('projectTypeId', value),
                  [{ value: '', label: t('projects.filters.allProjectTypes') }, ...projectTypes.map((projectType) => ({ value: String(projectType.id), label: projectType.label }))],
                )}
                {renderSelect(
                  <Sparkles size={18} />,
                  facilities.find((facility) => String(facility.id) === draft.facilityId)?.label || t('projects.filters.allFacilities'),
                  draft.facilityId,
                  (value) => updateDraft('facilityId', value),
                  [{ value: '', label: t('projects.filters.allFacilities') }, ...facilities.map((facility) => ({ value: String(facility.id), label: facility.label }))],
                )}
              </div>

              <div className={sectionClass}>
                <label className={labelClass}>{t('projects.filters.priceRange')}</label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={draft.minimumPrice}
                    onChange={(event) => updateDraft('minimumPrice', event.target.value.replace(/[^0-9]/g, ''))}
                    className={textInputClass}
                    placeholder={t('projects.filters.minPrice')}
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={draft.maximumPrice}
                    onChange={(event) => updateDraft('maximumPrice', event.target.value.replace(/[^0-9]/g, ''))}
                    className={textInputClass}
                    placeholder={t('projects.filters.maxPrice')}
                  />
                </div>
                {renderSelect(
                  <CircleDollarSign size={18} />,
                  draft.priceCurrency || t('projects.filters.anyCurrency'),
                  draft.priceCurrency,
                  (value) => updateDraft('priceCurrency', value),
                  [{ value: '', label: t('projects.filters.anyCurrency') }, ...CURRENCIES.map((currency) => ({ value: currency, label: currency }))],
                )}
              </div>

              <div className={sectionClass}>
                <label className={labelClass}>{t('projects.filters.finishingAndFlags')}</label>
                {renderSelect(
                  <Tag size={18} />,
                  finishingLabel ? t(finishingLabel) : t('projects.filters.anyFinishing'),
                  draft.furnitureType,
                  (value) => updateDraft('furnitureType', value),
                  [{ value: '', label: t('projects.filters.anyFinishing') }, ...FINISHING_OPTIONS.map((option) => ({ value: option.value, label: t(option.labelKey) }))],
                )}
                {renderCheckbox(
                  draft.isFurniture === 'true',
                  (checked) => updateDraft('isFurniture', checked ? 'true' : ''),
                  t('projects.filters.furnitureIncluded'),
                  <SlidersHorizontal size={18} />,
                )}
                {renderCheckbox(
                  draft.isFeature === 'true',
                  (checked) => updateDraft('isFeature', checked ? 'true' : ''),
                  t('projects.filters.featuredOnly'),
                  <Sparkles size={18} />,
                )}
              </div>

              <div className={sectionClass}>
                <label className={labelClass}>{t('projects.filters.delivery')}</label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className={fieldClass}>
                    <CalendarDays size={18} className="shrink-0 text-brand-secondary" />
                    <input
                      type="date"
                      value={draft.deliveryDateFrom}
                      onChange={(event) => updateDraft('deliveryDateFrom', event.target.value)}
                      className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-brand-primary outline-none"
                      aria-label={t('projects.filters.deliveryFrom')}
                    />
                  </div>
                  <div className={fieldClass}>
                    <CalendarDays size={18} className="shrink-0 text-brand-secondary" />
                    <input
                      type="date"
                      value={draft.deliveryDateTo}
                      onChange={(event) => updateDraft('deliveryDateTo', event.target.value)}
                      className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-brand-primary outline-none"
                      aria-label={t('projects.filters.deliveryTo')}
                    />
                  </div>
                </div>
              </div>

              <div className={sectionClass}>
                <label className={labelClass}>{t('projects.filters.sorting')}</label>
                {renderSelect(
                  <SlidersHorizontal size={18} />,
                  sortLabel ? t(sortLabel) : t('projects.filters.sortBy'),
                  draft.sortBy,
                  (value) => updateDraft('sortBy', value),
                  [{ value: '', label: t('projects.filters.sortBy') }, ...SORT_OPTIONS.map((option) => ({ value: option.value, label: t(option.labelKey) }))],
                )}
                {renderSelect(
                  <SlidersHorizontal size={18} />,
                  draft.sortDirection === 'asc' ? t('projects.filters.ascending') : draft.sortDirection === 'desc' ? t('projects.filters.descending') : t('projects.filters.sortDirection'),
                  draft.sortDirection,
                  (value) => updateDraft('sortDirection', value),
                  [
                    { value: '', label: t('projects.filters.sortDirection') },
                    { value: 'asc', label: t('projects.filters.ascending') },
                    { value: 'desc', label: t('projects.filters.descending') },
                  ],
                )}
              </div>

              {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-[14px] font-semibold text-status-danger">{error}</p>}
            </div>

            <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-brand-divider bg-white p-6 sm:p-8">
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex h-12 items-center justify-center rounded-full border border-brand-divider bg-white px-5 text-[15px] font-bold text-brand-primary transition hover:bg-brand-primary-soft"
              >
                {t('projects.filters.clear')}
              </button>
              <button
                type="button"
                onClick={validateAndApply}
                disabled={isLoading}
                className="inline-flex h-12 items-center justify-center rounded-full bg-brand-primary px-5 text-[15px] font-bold text-white transition hover:bg-brand-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? t('projects.filters.searching') : t('projects.filters.apply')}
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
