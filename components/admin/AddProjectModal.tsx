'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  Building2,
  Calendar,
  Check,
  CircleDollarSign,
  GalleryHorizontal,
  ImageIcon,
  Languages,
  Loader2,
  MapPin,
  Plus,
  Search,
  Sofa,
  Star,
  Tag,
  Upload,
  X,
} from 'lucide-react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import {
  createProject,
  updateProject,
  getProjectById,
  uploadProjectImages,
  Project,
  LocalizedString,
  FurnitureType,
  ProjectPrice,
  CreateProjectPayload,
} from '@/lib/api/projects';
import { getDevelopers } from '@/lib/api/developers';
import { getLocations } from '@/lib/api/locations';
import { getFacilities, createFacility, Facility } from '@/lib/api/facilities';
import { getProjectTypes, ProjectType } from '@/lib/api/projectTypes';
import { getProjectTypeIcon } from '@/lib/icons/projectTypeIcons';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: Project | null;
}

interface DropdownOption {
  id: number;
  label: string;
}

interface ProjectPriceForm {
  currency: string;
  minimumPrice: string;
  maximumPrice: string;
}

type LanguageKey = 'en' | 'de' | 'it';
type SectionErrors = Partial<Record<'basic' | 'types' | 'details' | 'prices' | 'translations', string>>;

type ProjectApiVariants = Project & {
  DeliveryDate?: string;
  IsFurniture?: boolean;
  FurnitureType?: string | FurnitureType;
  IsFeature?: boolean;
  Prices?: ProjectPrice[];
  ProjectTypes?: ProjectType[];
  ProjectTypeIds?: number[];
  Facilities?: ({ id?: number; Id?: number; name?: string; Name?: string } | string | number)[];
};

const REQUIRED_PRICE_CURRENCIES = ['USD', 'EGP', 'EUR', 'GBP'];

const FINISHING_STATUS_OPTIONS: { label: string; value: FurnitureType }[] = [
  { label: 'Needs Finishing', value: 0 },
  { label: 'Semi Finished', value: 1 },
  { label: 'Fully Finished', value: 2 },
];

const LANGUAGE_TABS: { key: LanguageKey; label: string; required?: boolean }[] = [
  { key: 'en', label: 'English', required: true },
  { key: 'de', label: 'German' },
  { key: 'it', label: 'Italian' },
];

const createEmptyPrices = (): ProjectPriceForm[] => REQUIRED_PRICE_CURRENCIES.map((currency) => ({
  currency,
  minimumPrice: '',
  maximumPrice: '',
}));

const createEmptyForm = () => ({
  name: { en: '', de: '', it: '' },
  description: { en: '', de: '', it: '' },
  developerId: null as number | null,
  locationId: null as number | null,
  deliveryDate: '',
  isFurniture: false,
  furnitureType: 0 as FurnitureType,
  isFeature: false,
  projectTypeIds: [] as number[],
  facilityIds: [] as number[],
  prices: createEmptyPrices(),
});

const formatDateTimeLocal = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 16);
};

const asText = (value?: string | LocalizedString | null, lang: LanguageKey = 'en') => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value.en || value.de || value.it || '';
};

const getFurnitureTypeValue = (value?: string | number | null): FurnitureType => {
  if (value === 1 || value === '1') return 1;
  if (value === 2 || value === '2') return 2;

  const normalized = String(value ?? '').toLowerCase();
  if (normalized.includes('semi')) return 1;
  if (normalized.includes('fully') || normalized.includes('full')) return 2;

  return 0;
};

const hydratePrices = (prices?: ProjectPrice[] | null): ProjectPriceForm[] => {
  return REQUIRED_PRICE_CURRENCIES.map((currency) => {
    const matchedPrice = prices?.find((price) => price.currency?.toUpperCase() === currency);

    return {
      currency,
      minimumPrice: matchedPrice?.minimumPrice !== undefined ? String(matchedPrice.minimumPrice) : '',
      maximumPrice: matchedPrice?.maximumPrice !== undefined ? String(matchedPrice.maximumPrice) : '',
    };
  });
};

const getProjectTypeIds = (project: Project): number[] => {
  const apiProject = project as ProjectApiVariants;
  if (project.projectTypeIds?.length) return project.projectTypeIds;
  if (apiProject.ProjectTypeIds?.length) return apiProject.ProjectTypeIds;

  const projectTypes = project.projectTypes || apiProject.ProjectTypes || [];
  return projectTypes.map((type) => type.id).filter((id): id is number => Number.isFinite(id));
};

const getFacilityName = (facility: Facility) => asText(facility.name);
const getProjectTypeName = (projectType: ProjectType) => asText(projectType.name);

const getPriceError = (price: ProjectPriceForm) => {
  const min = Number(price.minimumPrice);
  const max = Number(price.maximumPrice);

  if (price.minimumPrice === '' || price.maximumPrice === '') return 'Required';
  if (!Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max < 0) return 'Invalid';
  if (max < min) return 'Max is lower';
  return '';
};

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-primary-soft text-brand-primary">
        {icon}
      </span>
      <div>
        <h3 className="text-[17px] font-bold text-brand-primary">{title}</h3>
        {subtitle && <p className="mt-0.5 text-[13px] font-medium text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function AddProjectModal({ isOpen, onClose, onSuccess, editData }: AddProjectModalProps) {
  useBodyScrollLock(isOpen);
  useEscapeKey(onClose, isOpen);

  const [form, setForm] = useState(createEmptyForm);
  const [developers, setDevelopers] = useState<DropdownOption[]>([]);
  const [locations, setLocations] = useState<DropdownOption[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [projectFacilityLabels, setProjectFacilityLabels] = useState<string[]>([]);
  const [activeLanguage, setActiveLanguage] = useState<LanguageKey>('en');
  const [projectTypeSearch, setProjectTypeSearch] = useState('');
  const [facilitySearch, setFacilitySearch] = useState('');
  const [isProjectTypesLoading, setIsProjectTypesLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [sectionErrors, setSectionErrors] = useState<SectionErrors>({});

  const [isAddingFacility, setIsAddingFacility] = useState(false);
  const [newFacilityName, setNewFacilityName] = useState({ en: '', de: '', it: '' });
  const [isSubmittingQuick, setIsSubmittingQuick] = useState(false);

  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const isEditMode = Boolean(editData);

  const selectedProjectTypes = useMemo(
    () => projectTypes.filter((type) => form.projectTypeIds.includes(type.id)),
    [form.projectTypeIds, projectTypes]
  );

  const filteredProjectTypes = useMemo(() => {
    const query = projectTypeSearch.trim().toLowerCase();
    if (!query) return projectTypes;
    return projectTypes.filter((type) => getProjectTypeName(type).toLowerCase().includes(query));
  }, [projectTypeSearch, projectTypes]);

  const filteredFacilities = useMemo(() => {
    const query = facilitySearch.trim().toLowerCase();
    if (!query) return facilities;
    return facilities.filter((facility) => getFacilityName(facility).toLowerCase().includes(query));
  }, [facilities, facilitySearch]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchAllDevelopers = async () => {
      let page = 1;
      let all: DropdownOption[] = [];
      try {
        while (page <= 3) {
          const res = await getDevelopers(page);
          if (!res?.items?.length) break;
          all = [...all, ...res.items.map((item) => ({ id: item.id, label: item.name }))];
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
        while (page <= 3) {
          const res = await getLocations(page);
          if (!res?.items?.length) break;
          all = [
            ...all,
            ...res.items.map((item) => ({
              id: item.id,
              label: [
                item.mainLocation || item.city,
                item.subLocation || item.district,
                item.street,
                item.country,
              ].filter(Boolean).join(' - '),
            })),
          ];
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
        setFacilities(await getFacilities());
      } catch (err) {
        console.error('[AddProjectModal] Failed to fetch facilities', err);
      }
    };

    const fetchAllProjectTypes = async () => {
      let page = 1;
      let all: ProjectType[] = [];
      setIsProjectTypesLoading(true);
      try {
        while (page <= 5) {
          const res = await getProjectTypes({ pageNumber: page, pageSize: 50 });
          all = [...all, ...res.items];
          if (!res.hasNextPage) break;
          page++;
        }
        setProjectTypes(all);
      } catch (err) {
        console.error('[AddProjectModal] Failed to fetch project types', err);
      } finally {
        setIsProjectTypesLoading(false);
      }
    };

    fetchAllDevelopers();
    fetchAllLocations();
    fetchAllFacilities();
    fetchAllProjectTypes();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    setHeroFile(null);
    setHeroPreview(null);
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setProjectTypeSearch('');
    setFacilitySearch('');
    setActiveLanguage('en');
    setSectionErrors({});
    setError('');

    if (!editData) {
      setForm(createEmptyForm());
      setProjectFacilityLabels([]);
      setIsEditLoading(false);
      return;
    }

    const fetchFullData = async () => {
      setIsEditLoading(true);
      try {
        const [enData, deData, itData] = await Promise.all([
          getProjectById(editData.id, 'en'),
          getProjectById(editData.id, 'de'),
          getProjectById(editData.id, 'it'),
        ]);
        const apiProject = enData as ProjectApiVariants;
        const rawFacilities = apiProject.facilities || apiProject.Facilities || [];
        const currentFacilityIds = enData.facilityIds ||
          rawFacilities.map((facility) => {
            if (typeof facility === 'number') return facility;
            if (typeof facility === 'object' && facility !== null) return facility.id ?? facility.Id ?? null;
            return null;
          }).filter((id): id is number => id !== null);

        setProjectFacilityLabels(rawFacilities.map((facility) => {
          if (typeof facility === 'string') return facility;
          if (typeof facility === 'number') return `Facility #${facility}`;
          return facility.name || facility.Name || `Facility #${facility.id ?? facility.Id ?? ''}`;
        }));

        setForm({
          name: {
            en: asText(enData.name, 'en'),
            de: asText(deData.name, 'de'),
            it: asText(itData.name, 'it'),
          },
          description: {
            en: asText(enData.description, 'en'),
            de: asText(deData.description, 'de'),
            it: asText(itData.description, 'it'),
          },
          developerId: enData.developerId,
          locationId: enData.locationId,
          deliveryDate: formatDateTimeLocal(enData.deliveryDate ?? apiProject.DeliveryDate),
          isFurniture: Boolean(enData.isFurniture ?? apiProject.IsFurniture),
          furnitureType: getFurnitureTypeValue(enData.furnitureType ?? apiProject.FurnitureType),
          isFeature: Boolean(enData.isFeature ?? apiProject.IsFeature),
          projectTypeIds: getProjectTypeIds(enData),
          facilityIds: currentFacilityIds,
          prices: hydratePrices(enData.prices ?? apiProject.Prices),
        });
      } catch (err) {
        console.error('[AddProjectModal] Failed to fetch localized project data:', err);
        setError('Failed to load full project data for editing.');
      } finally {
        setIsEditLoading(false);
      }
    };

    fetchFullData();
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const clearSectionError = (key: keyof SectionErrors) => {
    setSectionErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const renderSectionError = (key: keyof SectionErrors) => (
    sectionErrors[key] ? <p className="text-[13px] font-semibold text-red-500">{sectionErrors[key]}</p> : null
  );

  const updateLocalizedField = (field: 'name' | 'description', lang: LanguageKey, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
    clearSectionError(field === 'name' && lang === 'en' ? 'basic' : 'translations');
  };

  const updatePrice = (index: number, field: 'minimumPrice' | 'maximumPrice', value: string) => {
    setForm((prev) => ({
      ...prev,
      prices: prev.prices.map((price, priceIndex) => (
        priceIndex === index ? { ...price, [field]: value } : price
      )),
    }));
    clearSectionError('prices');
  };

  const toggleProjectType = (id: number, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      projectTypeIds: checked
        ? [...prev.projectTypeIds, id]
        : prev.projectTypeIds.filter((typeId) => typeId !== id),
    }));
    clearSectionError('types');
  };

  const toggleFacility = (id: number, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      facilityIds: checked
        ? [...prev.facilityIds, id]
        : prev.facilityIds.filter((facilityId) => facilityId !== id),
    }));
  };

  const handleHeroChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setHeroFile(file);
    setHeroPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleGalleryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setGalleryFiles((prev) => [...prev, ...files]);
    setGalleryPreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, imageIndex) => imageIndex !== index));
    setGalleryPreviews((prev) => prev.filter((_, imageIndex) => imageIndex !== index));
  };

  const saveQuickFacility = async () => {
    if (!newFacilityName.en.trim()) return;
    setIsSubmittingQuick(true);
    setError('');
    try {
      const englishName = newFacilityName.en.trim();
      await createFacility({
        name: {
          en: englishName,
          de: newFacilityName.de.trim() || englishName,
          it: newFacilityName.it.trim() || englishName,
        },
        icon: null,
      });
      setNewFacilityName({ en: '', de: '', it: '' });
      setIsAddingFacility(false);
      setFacilities(await getFacilities());
    } catch (err) {
      console.error('[AddProjectModal] Failed to add facility:', err);
      setError('Failed to add facility.');
    } finally {
      setIsSubmittingQuick(false);
    }
  };

  const validateForm = () => {
    const nextErrors: SectionErrors = {};
    const prices = form.prices.map((price) => ({
      currency: price.currency,
      minimumPrice: Number(price.minimumPrice),
      maximumPrice: Number(price.maximumPrice),
    }));

    if (!form.name.en.trim()) nextErrors.basic = 'English project name is required.';
    if (!form.locationId) nextErrors.basic = nextErrors.basic || 'Location is required.';
    if (form.projectTypeIds.length === 0) nextErrors.types = 'Select at least one project type.';
    if (!form.deliveryDate) nextErrors.details = 'Delivery date is required.';

    const hasInvalidPrice = form.prices.some((price) => Boolean(getPriceError(price)));
    if (prices.length !== REQUIRED_PRICE_CURRENCIES.length || hasInvalidPrice) {
      nextErrors.prices = 'Enter valid minimum and maximum prices for every currency.';
    }

    setSectionErrors(nextErrors);
    return { isValid: Object.keys(nextErrors).length === 0, prices };
  };

  const handleSubmit = async () => {
    const { isValid, prices } = validateForm();
    if (!isValid) {
      setError('Please fix the highlighted sections.');
      return;
    }

    const englishName = form.name.en.trim();
    const englishDescription = form.description.en.trim();
    const projectPayload: CreateProjectPayload = {
      name: {
        en: englishName,
        de: form.name.de.trim() || englishName,
        it: form.name.it.trim() || englishName,
      },
      description: {
        en: englishDescription,
        de: form.description.de.trim() || englishDescription,
        it: form.description.it.trim() || englishDescription,
      },
      developerId: form.developerId || null,
      locationId: form.locationId || null,
      deliveryDate: new Date(form.deliveryDate).toISOString(),
      isFurniture: form.isFurniture,
      furnitureType: form.furnitureType,
      isFeature: form.isFeature,
      projectTypeIds: form.projectTypeIds,
      facilityIds: form.facilityIds,
      prices,
    };

    setIsSaving(true);
    setError('');
    try {
      const result = isEditMode && editData
        ? await updateProject(editData.id, { id: editData.id, ...projectPayload })
        : await createProject(projectPayload);
      const projectId = typeof result === 'number' ? result : result.id;
      const allFiles = [...(heroFile ? [heroFile] : []), ...galleryFiles];
      if (allFiles.length > 0) await uploadProjectImages(projectId, allFiles);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('[AddProjectModal]', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-inter backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-[1120px] flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex shrink-0 items-center justify-between bg-brand-primary px-7 py-5">
          <div>
            <h2 className="text-[22px] font-bold text-white">{isEditMode ? 'Edit Project' : 'Add Project'}</h2>
            <p className="mt-1 text-[13px] font-medium text-white/60">{isEditMode ? 'Update project data' : 'Create a new project listing'}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
            <X size={22} />
          </button>
        </div>

        <div className="relative flex-1 overflow-y-auto bg-admin-bg px-6 py-6">
          {isEditLoading && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-sm">
              <Loader2 size={32} className="animate-spin text-brand-primary" />
              <p className="text-[14px] font-bold text-brand-primary">Loading project data...</p>
            </div>
          )}

          <div className="mx-auto grid max-w-[1040px] grid-cols-1 gap-5">
            <section className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
              <SectionHeader icon={<Building2 size={19} />} title="Basic Info" subtitle="Name, developer, and location" />
              <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-brand-primary">Project Name *</label>
                  <input
                    type="text"
                    value={form.name.en}
                    onChange={(event) => updateLocalizedField('name', 'en', event.target.value)}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-[14px] font-semibold text-brand-primary outline-none transition focus:ring-4 focus:ring-brand-primary/5 ${
                      sectionErrors.basic && !form.name.en.trim() ? 'border-red-200' : 'border-gray-200 focus:border-brand-primary/30'
                    }`}
                    placeholder="Skyline Residence"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-brand-primary">
                    <MapPin size={15} />
                    Location *
                  </label>
                  <select
                    value={form.locationId ?? ''}
                    onChange={(event) => {
                      setForm((prev) => ({ ...prev, locationId: event.target.value ? Number(event.target.value) : null }));
                      clearSectionError('basic');
                    }}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-[14px] font-semibold text-brand-primary outline-none transition focus:ring-4 focus:ring-brand-primary/5 ${
                      sectionErrors.basic && !form.locationId ? 'border-red-200' : 'border-gray-200 focus:border-brand-primary/30'
                    }`}
                  >
                    <option value="">None</option>
                    {locations.map((location) => <option key={location.id} value={location.id}>{location.label}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-brand-primary">Developer</label>
                  <select
                    value={form.developerId ?? ''}
                    onChange={(event) => setForm((prev) => ({ ...prev, developerId: event.target.value ? Number(event.target.value) : null }))}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14px] font-semibold text-brand-primary outline-none transition focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/5"
                  >
                    <option value="">None</option>
                    {developers.map((developer) => <option key={developer.id} value={developer.id}>{developer.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-3">{renderSectionError('basic')}</div>
            </section>

            <section className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <SectionHeader icon={<Tag size={18} />} title="Project Types" subtitle={`${form.projectTypeIds.length} selected`} />
                <div className="relative w-full md:w-[300px]">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={projectTypeSearch}
                    onChange={(event) => setProjectTypeSearch(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-9 py-2.5 text-[13px] font-semibold text-brand-primary outline-none focus:border-brand-primary/30 focus:bg-white"
                    placeholder="Search types"
                  />
                </div>
              </div>

              <div className="mt-4">
                {isProjectTypesLoading ? (
                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-[14px] font-semibold text-gray-400">
                    <Loader2 size={18} className="animate-spin" />
                    Loading project types...
                  </div>
                ) : projectTypes.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-[14px] font-semibold text-gray-400">
                    No project types available.
                  </div>
                ) : (
                  <div className="grid max-h-[220px] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredProjectTypes.map((projectType) => {
                      const isChecked = form.projectTypeIds.includes(projectType.id);
                      const ProjectTypeIcon = getProjectTypeIcon(projectType.icon);

                      return (
                        <button
                          key={projectType.id}
                          type="button"
                          onClick={() => toggleProjectType(projectType.id, !isChecked)}
                          className={`flex min-h-[54px] items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                            isChecked
                              ? 'border-brand-primary bg-brand-primary text-white shadow-sm'
                              : 'border-gray-200 bg-gray-50 text-brand-primary hover:bg-white'
                          }`}
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-primary">
                            <ProjectTypeIcon size={18} />
                          </span>
                          <span className="min-w-0 flex-1 truncate text-[13px] font-bold">{getProjectTypeName(projectType)}</span>
                          {isChecked && <Check size={16} className="shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {selectedProjectTypes.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedProjectTypes.map((type) => (
                    <span key={type.id} className="rounded-full bg-brand-primary-soft px-3 py-1 text-[12px] font-bold text-brand-primary">
                      {getProjectTypeName(type)}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-3">{renderSectionError('types')}</div>
            </section>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
              <section className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <SectionHeader icon={<CircleDollarSign size={19} />} title="Pricing" subtitle="All currency ranges are required" />
                  <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-bold text-emerald-700">
                    {REQUIRED_PRICE_CURRENCIES.length} currencies
                  </span>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-gray-100">
                  <div className="hidden grid-cols-[96px_1fr_1fr_96px] gap-4 bg-gray-50 px-4 py-3 text-[11px] font-black uppercase text-gray-400 md:grid">
                    <span>Currency</span>
                    <span>Minimum Price</span>
                    <span>Maximum Price</span>
                    <span className="text-right">Status</span>
                  </div>
                  {form.prices.map((price, index) => {
                    const priceError = getPriceError(price);
                    const showPriceError = Boolean(sectionErrors.prices && priceError);

                    return (
                      <div
                        key={price.currency}
                        className="grid grid-cols-1 gap-3 border-t border-gray-100 bg-white px-4 py-4 first:border-t-0 md:grid-cols-[96px_1fr_1fr_96px] md:items-center md:gap-4"
                      >
                        <div className="flex items-center justify-between gap-3 md:block">
                          <span className="inline-flex h-10 min-w-16 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 px-4 text-[13px] font-black text-brand-primary">
                            {price.currency}
                          </span>
                          {showPriceError && <span className="text-[12px] font-bold text-red-500 md:hidden">{priceError}</span>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase text-gray-400 md:hidden">Minimum Price</label>
                          <input
                            type="number"
                            min={0}
                            value={price.minimumPrice}
                            onChange={(event) => updatePrice(index, 'minimumPrice', event.target.value)}
                            className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-[14px] font-semibold text-brand-primary outline-none transition focus:bg-white focus:ring-4 focus:ring-brand-primary/5 ${
                              showPriceError ? 'border-red-200' : 'border-gray-200 focus:border-brand-primary/30'
                            }`}
                            placeholder="0"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase text-gray-400 md:hidden">Maximum Price</label>
                          <input
                            type="number"
                            min={0}
                            value={price.maximumPrice}
                            onChange={(event) => updatePrice(index, 'maximumPrice', event.target.value)}
                            className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-[14px] font-semibold text-brand-primary outline-none transition focus:bg-white focus:ring-4 focus:ring-brand-primary/5 ${
                              showPriceError ? 'border-red-200' : 'border-gray-200 focus:border-brand-primary/30'
                            }`}
                            placeholder="0"
                          />
                        </div>

                        <div className="hidden justify-end md:flex">
                          {showPriceError ? (
                            <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold text-red-500">{priceError}</span>
                          ) : (
                            <span className="rounded-full bg-gray-50 px-3 py-1 text-[11px] font-bold text-gray-400">Required</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3">{renderSectionError('prices')}</div>
              </section>

              <section className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
                <SectionHeader icon={<Calendar size={18} />} title="Details" subtitle="Delivery, finishing status, and listing flags" />
                <div className="mt-5 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-brand-primary">Delivery Date *</label>
                    <input
                      type="datetime-local"
                      value={form.deliveryDate}
                      onChange={(event) => {
                        setForm((prev) => ({ ...prev, deliveryDate: event.target.value }));
                        clearSectionError('details');
                      }}
                      className={`w-full rounded-xl border bg-white px-4 py-3 text-[14px] font-semibold text-brand-primary outline-none focus:ring-4 focus:ring-brand-primary/5 ${
                        sectionErrors.details ? 'border-red-200' : 'border-gray-200 focus:border-brand-primary/30'
                      }`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-brand-primary">Finishing Status</label>
                    <div className="grid grid-cols-3 gap-2 rounded-xl bg-gray-50 p-1.5">
                      {FINISHING_STATUS_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, furnitureType: option.value }))}
                          className={`rounded-lg px-3 py-2.5 text-[13px] font-bold transition ${
                            form.furnitureType === option.value ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-primary hover:bg-white'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, isFurniture: !prev.isFurniture }))}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-[14px] font-bold transition ${
                      form.isFurniture ? 'border-brand-primary bg-brand-primary text-white' : 'border-gray-200 bg-gray-50 text-brand-primary'
                    }`}
                  >
                    <span className="flex items-center gap-2"><Sofa size={17} /> Furniture Included</span>
                    <span className={`h-5 w-10 rounded-full p-0.5 ${form.isFurniture ? 'bg-white/30' : 'bg-gray-200'}`}>
                      <span className={`block h-4 w-4 rounded-full bg-white shadow transition-transform ${form.isFurniture ? 'translate-x-5' : ''}`} />
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, isFeature: !prev.isFeature }))}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-[14px] font-bold transition ${
                      form.isFeature ? 'border-amber-400 bg-amber-400 text-white' : 'border-gray-200 bg-gray-50 text-brand-primary'
                    }`}
                  >
                    <span className="flex items-center gap-2"><Star size={17} /> Featured Project</span>
                    {form.isFeature && <Check size={17} />}
                  </button>

                  {renderSectionError('details')}
                </div>
              </section>
            </div>

            <section className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <SectionHeader icon={<Check size={18} />} title="Facilities" subtitle={`${form.facilityIds.length} selected`} />
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative w-full sm:w-[260px]">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={facilitySearch}
                      onChange={(event) => setFacilitySearch(event.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-9 py-2.5 text-[13px] font-semibold text-brand-primary outline-none focus:border-brand-primary/30 focus:bg-white"
                      placeholder="Search facilities"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingFacility((current) => !current)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] font-bold text-brand-primary transition hover:bg-gray-50"
                  >
                    {isAddingFacility ? <X size={15} /> : <Plus size={15} />}
                    {isAddingFacility ? 'Cancel' : 'Add Facility'}
                  </button>
                </div>
              </div>

              {isAddingFacility && (
                <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
                    {LANGUAGE_TABS.map((language) => (
                      <input
                        key={language.key}
                        type="text"
                        placeholder={`${language.label} name`}
                        value={newFacilityName[language.key]}
                        onChange={(event) => setNewFacilityName((prev) => ({ ...prev, [language.key]: event.target.value }))}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] font-semibold text-brand-primary outline-none focus:border-brand-primary/30"
                      />
                    ))}
                    <button
                      type="button"
                      disabled={isSubmittingQuick || !newFacilityName.en.trim()}
                      onClick={saveQuickFacility}
                      className="rounded-xl bg-brand-primary px-5 py-3 text-[13px] font-bold text-white transition hover:bg-brand-primary-hover disabled:opacity-50"
                    >
                      {isSubmittingQuick ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4">
                {facilities.length > 0 ? (
                  <div className="grid max-h-[210px] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredFacilities.map((facility) => {
                      const isChecked = form.facilityIds.includes(facility.id);

                      return (
                        <button
                          key={facility.id}
                          type="button"
                          onClick={() => toggleFacility(facility.id, !isChecked)}
                          className={`flex min-h-[46px] items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                            isChecked
                              ? 'border-brand-primary bg-brand-primary text-white'
                              : 'border-gray-200 bg-gray-50 text-brand-primary hover:bg-white'
                          }`}
                        >
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${isChecked ? 'border-white bg-white text-brand-primary' : 'border-gray-300'}`}>
                            {isChecked && <Check size={13} />}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-[13px] font-bold">{getFacilityName(facility)}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : projectFacilityLabels.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {projectFacilityLabels.map((label, index) => (
                      <span key={`${label}-${index}`} className="rounded-full bg-gray-100 px-3 py-1.5 text-[12px] font-bold text-brand-primary">{label}</span>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-[14px] font-semibold text-gray-400">
                    No facilities available.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
              <SectionHeader icon={<Languages size={18} />} title="Translations" subtitle="German and Italian fallback to English when empty" />
              <div className="mt-5 flex flex-wrap gap-2 border-b border-gray-100 pb-3">
                {LANGUAGE_TABS.map((language) => (
                  <button
                    key={language.key}
                    type="button"
                    onClick={() => setActiveLanguage(language.key)}
                    className={`rounded-xl px-4 py-2.5 text-[13px] font-bold transition ${
                      activeLanguage === language.key ? 'bg-brand-primary text-white' : 'bg-gray-50 text-brand-primary hover:bg-gray-100'
                    }`}
                  >
                    {language.label}{language.required ? ' *' : ''}
                  </button>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[340px_1fr]">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-brand-primary">Project Name</label>
                  <input
                    type="text"
                    value={form.name[activeLanguage]}
                    onChange={(event) => updateLocalizedField('name', activeLanguage, event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14px] font-semibold text-brand-primary outline-none transition focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/5"
                    placeholder={activeLanguage === 'en' ? 'Project name' : 'Optional translation'}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-brand-primary">Description</label>
                  <textarea
                    value={form.description[activeLanguage]}
                    onChange={(event) => updateLocalizedField('description', activeLanguage, event.target.value)}
                    rows={4}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14px] font-semibold text-brand-primary outline-none transition focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/5"
                    placeholder={activeLanguage === 'en' ? 'Project description' : 'Optional translation'}
                  />
                </div>
              </div>
              <div className="mt-3">{renderSectionError('translations')}</div>
            </section>

            <section className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
              <SectionHeader icon={<ImageIcon size={18} />} title="Images" subtitle="Hero image plus optional gallery" />
              <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[360px_1fr]">
                <div className="space-y-3">
                  <label className="text-[13px] font-bold text-brand-primary">Hero Image</label>
                  {heroPreview ? (
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                      <Image src={heroPreview} alt="Hero preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setHeroFile(null);
                          setHeroPreview(null);
                        }}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-red-500 shadow"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="proj-hero-upload" className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-center transition hover:bg-white">
                      <Upload size={26} className="text-gray-400" />
                      <span className="text-[13px] font-bold text-brand-primary">Upload hero image</span>
                    </label>
                  )}
                  <input type="file" id="proj-hero-upload" className="hidden" accept="image/*" onChange={handleHeroChange} />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-brand-primary">
                    <GalleryHorizontal size={15} />
                    Gallery Images
                  </label>
                  {galleryPreviews.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
                      {galleryPreviews.map((src, index) => (
                        <div key={`${src}-${index}`} className="group relative aspect-video overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                          <Image src={src} alt={`Gallery ${index + 1}`} fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-red-500 opacity-0 shadow transition-opacity group-hover:opacity-100"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label htmlFor="proj-gallery-upload" className="flex min-h-[92px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-center transition hover:bg-white">
                    <Upload size={24} className="text-gray-400" />
                    <span className="text-[13px] font-bold text-brand-primary">{galleryPreviews.length ? 'Add more images' : 'Upload gallery images'}</span>
                  </label>
                  <input type="file" id="proj-gallery-upload" className="hidden" accept="image/*" multiple onChange={handleGalleryChange} />
                </div>
              </div>
            </section>

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[14px] font-semibold text-red-600">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-gray-100 bg-white px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-7 py-3 text-[14px] font-bold text-brand-primary transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving || isEditLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-8 py-3 text-[14px] font-bold text-white shadow-lg shadow-brand-primary/15 transition hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving && <Loader2 size={17} className="animate-spin" />}
            {isSaving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
}
