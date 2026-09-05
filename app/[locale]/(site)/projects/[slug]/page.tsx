'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Home,
  Landmark,
  Loader2,
  MapPin,
  Percent,
  Ruler,
  Sofa,
  Sparkles,
  Tag,
  WalletCards,
} from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import {
  getProjectById,
  resolveProjectImageUrl,
  Project,
  type ApiUnit,
  type FurnitureType,
  type ProjectPrice,
} from '@/lib/api/projects';
import { getProjectPaymentPlans, type ProjectPaymentPlan } from '@/lib/api/projectPaymentPlans';
import { getFacilities, Facility } from '@/lib/api/facilities';
import { useLanguage, type Language } from '@/lib/contexts/LanguageContext';
import ImageGallery from '@/components/ImageGallery';
import { BRAND_LOGOS } from '@/lib/brand';
import { getFacilityServiceIcon } from '@/lib/icons/facilityServiceIcons';

const DEFAULT_IMAGE = '/assists/defaultImage.png';
const DEFAULT_DEVELOPER_LOGO = BRAND_LOGOS.markColor;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, duration: 0.5 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' as const },
  },
};

const getLocalizedValue = (value: string | Record<string, string> | null | undefined, language: Language) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[language] || value.en || Object.values(value).find((entry) => typeof entry === 'string' && entry.trim() !== '') || '';
};

const formatDate = (value: string | undefined, language: Language, fallback: string) => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return new Intl.DateTimeFormat(language, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const formatNumber = (value: number | undefined | null) => {
  if (value === null || value === undefined || !Number.isFinite(value)) return '';
  return value.toLocaleString();
};

const formatPrice = (value: number | undefined | null, currency: string) => {
  const numberValue = value ?? 0;
  if (!Number.isFinite(numberValue) || numberValue <= 0) return '';
  return `${currency} ${numberValue.toLocaleString()}`;
};

const getFinishingStatusKey = (value: string | FurnitureType | undefined) => {
  const normalized = String(value ?? '').toLowerCase();
  if (normalized === '0' || normalized.includes('none') || normalized.includes('need')) return 'projectDetails.needsFinishing';
  if (normalized === '1' || normalized.includes('semi')) return 'projectDetails.semiFinished';
  if (normalized === '2' || normalized.includes('full')) return 'projectDetails.fullyFinished';
  return 'projectDetails.notSpecified';
};

const getPlanStatus = (status: string | number) => {
  return String(status).toLowerCase() === 'sold' || status === 1 ? 'Sold' : 'Approved';
};

const getPlanMonths = (plan: ProjectPaymentPlan) => {
  return plan.installmentMonths || (plan.installmentYears ? plan.installmentYears * 12 : 0);
};

const getProjectPriceRange = (price: ProjectPrice, t: (key: string) => string) => {
  const min = formatPrice(price.minimumPrice, price.currency);
  const max = formatPrice(price.maximumPrice, price.currency);

  if (min && max) return `${t('projectDetails.from')} ${min} ${t('projectDetails.to')} ${max}`;
  if (min) return `${t('projectDetails.from')} ${min}`;
  if (max) return `${t('projectDetails.to')} ${max}`;
  return t('projectDetails.priceOnRequest');
};

type FacilityDisplayItem = {
  key: string;
  name: string;
  icon?: string | null;
};

const getFacilityItems = (
  project: Project,
  allFacilities: Facility[],
  language: Language,
  fallbackLabel: string,
): FacilityDisplayItem[] => {
  const facilityIds = new Set<number>();
  const textFacilities: FacilityDisplayItem[] = [];
  const rawFacilities = (project.facilities ?? []) as unknown[];

  (project.facilityIds ?? []).forEach((id) => {
    if (Number.isFinite(Number(id))) facilityIds.add(Number(id));
  });

  rawFacilities.forEach((item, index) => {
    if (typeof item === 'number' || (typeof item === 'string' && item.trim() !== '' && Number.isFinite(Number(item)))) {
      facilityIds.add(Number(item));
      return;
    }

    if (typeof item === 'string' && item.trim()) {
      textFacilities.push({ key: `facility-text-${index}`, name: item, icon: null });
      return;
    }

    if (typeof item === 'object' && item !== null) {
      const facility = item as Partial<Facility> & { Name?: string | Record<string, string>; Icon?: string | null };
      const name = getLocalizedValue(facility.name ?? facility.Name, language);
      if (name) {
        textFacilities.push({
          key: `facility-object-${facility.id ?? index}`,
          name,
          icon: facility.icon ?? facility.Icon ?? null,
        });
      }
    }
  });

  const idFacilities = [...facilityIds].map((id) => {
    const facility = allFacilities.find((item) => item.id === id);
    const name = getLocalizedValue(facility?.name, language) || `${fallbackLabel} ${id}`;
    return {
      key: `facility-${id}`,
      name,
      icon: facility?.icon ?? null,
    };
  });

  return [...idFacilities, ...textFacilities];
};

export default function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { t, getLocalized, language } = useLanguage();
  const { slug } = use(params);
  const projectId = Number(slug.split('-')[0]);

  const [project, setProject] = useState<Project | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [paymentPlans, setPaymentPlans] = useState<ProjectPaymentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (Number.isNaN(projectId)) {
      setError(t('projectDetails.notFound'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [projectData, facilityData, paymentPlansPage] = await Promise.all([
        getProjectById(projectId, language),
        getFacilities(),
        getProjectPaymentPlans(projectId, { pageNumber: 1, pageSize: 50 }),
      ]);
      setProject(projectData);
      setFacilities(facilityData);
      setPaymentPlans(paymentPlansPage.items);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('projects.error'));
    } finally {
      setLoading(false);
    }
  }, [language, projectId, t]);

  useEffect(() => {
    load();
  }, [load]);

  const localizedName = getLocalized(project?.name);
  const localizedDesc = getLocalized(project?.description);
  const images = (project?.imageUrls ?? [])
    .map((url) => resolveProjectImageUrl(url) ?? DEFAULT_IMAGE)
    .filter(Boolean);

  if (images.length === 0) images.push(DEFAULT_IMAGE);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-bg px-5 pt-32 font-poppins">
        <div className="flex flex-col items-center gap-4 rounded-[24px] border border-brand-divider bg-white px-12 py-10 text-brand-muted shadow-sm">
          <Loader2 size={38} className="animate-spin text-brand-primary" />
          <p className="text-[15px] font-semibold">{t('projectDetails.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !project || !localizedName) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-brand-bg px-5 pt-32 text-center font-poppins">
        <p className="text-[16px] font-semibold text-status-danger">{error ?? t('projectDetails.notFound')}</p>
        <Link
          href={`/${language}/projects`}
          className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-7 py-3 text-[14px] font-bold text-white transition-all hover:bg-brand-primary"
        >
          <ArrowLeft size={17} />
          {t('projectDetails.backToProjects')}
        </Link>
      </div>
    );
  }

  const developerLogo = resolveProjectImageUrl(project.logoImage) || DEFAULT_DEVELOPER_LOGO;
  const projectTypes = project.projectTypes ?? [];
  const facilityItems = getFacilityItems(project, facilities, language, t('projectDetails.facilities'));
  const units = project.units ?? [];
  const prices = project.prices ?? [];
  const finishingStatus = t(getFinishingStatusKey(project.furnitureType));
  const mainPrice = prices.find((price) => price.minimumPrice > 0 || price.maximumPrice > 0);

  const overviewItems = [
    {
      label: t('projectDetails.deliveryDate'),
      value: formatDate(project.deliveryDate, language, t('projectDetails.notSpecified')),
      icon: CalendarDays,
    },
    {
      label: t('projectDetails.finishingStatus'),
      value: finishingStatus,
      icon: Tag,
    },
    {
      label: t('projectDetails.furnitureIncluded'),
      value: project.isFurniture ? t('projectDetails.yes') : t('projectDetails.no'),
      icon: Sofa,
    },
    {
      label: t('projects.location'),
      value: project.locationName || t('projects.noLocation'),
      icon: MapPin,
    },
  ];

  return (
    <div className="min-h-screen bg-brand-primary-soft pt-32 font-poppins text-brand-primary">
      <section className="bg-brand-bg px-5 pb-10 pt-8 sm:px-6 md:px-10 md:pb-14 md:pt-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mx-auto flex max-w-[1280px] flex-col gap-8"
        >
          <motion.nav variants={itemVariants} className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-brand-muted">
            <Link href={`/${language}/projects`} className="transition-colors hover:text-brand-primary">
              {t('projects.title')}
            </Link>
            <ChevronRight size={14} className="text-brand-muted-light" />
            <span className="text-brand-primary">{localizedName}</span>
          </motion.nav>

          <motion.div variants={itemVariants} className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-end">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-muted-light bg-white/75 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.18em] text-brand-primary">
                  <Building2 size={15} />
                  {t('header.projects')}
                </span>
                {project.isFeature && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-white">
                    <Sparkles size={14} />
                    {t('projectDetails.featured')}
                  </span>
                )}
              </div>
              <h1 className="font-radley text-[40px] leading-[1.05] text-brand-primary sm:text-[52px] md:text-[64px]">
                {localizedName}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-brand-muted shadow-sm">
                  <MapPin size={17} className="shrink-0 text-brand-secondary" />
                  <span className="truncate">{project.locationName || t('projects.noLocation')}</span>
                </span>
                {mainPrice && (
                  <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-brand-primary shadow-sm">
                    <CircleDollarSign size={17} className="shrink-0 text-brand-secondary" />
                    <span className="truncate">{getProjectPriceRange(mainPrice, t)}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-[24px] border border-brand-divider bg-white p-5 shadow-[0_18px_55px_rgba(7,44,62,0.08)]">
              <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.14em] text-brand-secondary">
                {t('projects.developedBy')}
              </p>
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-20 shrink-0 rounded-[18px] border border-brand-primary-soft bg-brand-primary-soft">
                  <Image
                    src={developerLogo}
                    alt={project.developerName || t('featureProject.developerLogo')}
                    fill
                    sizes="80px"
                    draggable={false}
                    className="object-contain p-3"
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-[20px] font-bold text-brand-primary">
                    {project.developerName || t('projects.noDeveloper')}
                  </h2>
                  <p className="mt-1 text-[14px] font-medium text-brand-muted">
                    {t('projectDetails.developerSubtitle')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="px-5 py-10 sm:px-6 md:px-10 md:py-14">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mx-auto flex max-w-[1280px] flex-col gap-8"
        >
          <motion.div variants={itemVariants} className="overflow-hidden rounded-[24px] border border-brand-divider bg-white p-3 shadow-[0_18px_55px_rgba(7,44,62,0.08)]">
            <ImageGallery images={images} projectName={localizedName} />
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
            <div className="flex min-w-0 flex-col gap-8">
              <motion.section variants={itemVariants} className="rounded-[24px] border border-brand-divider bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-3">
                  <h2 className="text-[22px] font-bold text-brand-primary">
                    {t('projectDetails.description')}
                  </h2>
                  <div className="h-px flex-1 bg-brand-primary-soft" />
                </div>
                <div className="mt-6 flex flex-col gap-4">
                  {localizedDesc ? (
                    localizedDesc.split('\n\n').map((para, index) => (
                      <p key={index} className="text-[16px] leading-8 text-brand-muted">
                        {para}
                      </p>
                    ))
                  ) : (
                    <p className="text-[15px] italic leading-8 text-brand-muted">
                      {t('projectDetails.noDescription')}
                    </p>
                  )}
                </div>
              </motion.section>

              {projectTypes.length > 0 && (
                <motion.section variants={itemVariants} className="rounded-[24px] border border-brand-divider bg-white p-6 shadow-sm sm:p-8">
                  <div className="flex items-center gap-3">
                    <h2 className="text-[22px] font-bold text-brand-primary">
                      {t('projectDetails.projectTypes')}
                    </h2>
                    <div className="h-px flex-1 bg-brand-primary-soft" />
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {projectTypes.map((type) => (
                      <span
                        key={type.id}
                        className="inline-flex items-center gap-2 rounded-full border border-brand-divider bg-brand-primary-soft px-4 py-2 text-[14px] font-bold text-brand-primary"
                      >
                        <Home size={16} className="text-brand-secondary" />
                        {getLocalizedValue(type.name, language) || `${t('projectDetails.projectTypes')} ${type.id}`}
                      </span>
                    ))}
                  </div>
                </motion.section>
              )}

              {facilityItems.length > 0 && (
                <motion.section variants={itemVariants} className="rounded-[24px] border border-brand-divider bg-white p-6 shadow-sm sm:p-8">
                  <div className="flex items-center gap-3">
                    <h2 className="text-[22px] font-bold text-brand-primary">
                      {t('projectDetails.facilities')}
                    </h2>
                    <div className="h-px flex-1 bg-brand-primary-soft" />
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {facilityItems.map((facility) => {
                      const FacilityIcon = getFacilityServiceIcon(facility.icon);

                      return (
                        <div key={facility.key} className="flex items-center gap-3 rounded-[18px] bg-brand-primary-soft p-4 text-brand-muted">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-primary shadow-sm">
                            <FacilityIcon size={18} strokeWidth={2.5} />
                          </span>
                          <span className="text-[15px] font-semibold">{facility.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.section>
              )}

              {units.length > 0 && (
                <motion.section variants={itemVariants} className="rounded-[24px] border border-brand-divider bg-white p-6 shadow-sm sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <h2 className="text-[22px] font-bold text-brand-primary">
                        {t('projectDetails.availableUnits')}
                      </h2>
                      <div className="h-px flex-1 bg-brand-primary-soft" />
                    </div>
                    <span className="rounded-full bg-brand-primary-soft px-4 py-2 text-[13px] font-bold text-brand-primary">
                      {units.length} {t('projects.units')}
                    </span>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {units.slice(0, 6).map((unit: ApiUnit) => {
                      const unitName = getLocalizedValue(unit.name, language) || t('projectDetails.unit');
                      const unitImage = resolveProjectImageUrl(unit.imageUrls?.[0]) || DEFAULT_IMAGE;

                      return (
                        <div key={unit.id} className="overflow-hidden rounded-[20px] border border-brand-divider bg-brand-bg">
                          <div className="relative aspect-[1.7] bg-brand-primary-soft">
                            <Image
                              src={unitImage}
                              alt={unitName}
                              fill
                              sizes="(min-width: 1024px) 360px, 100vw"
                              draggable={false}
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="line-clamp-2 text-[16px] font-bold text-brand-primary">{unitName}</h3>
                              <span className="shrink-0 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-brand-primary">
                                {unit.status || unit.type || t('projectDetails.unit')}
                              </span>
                            </div>
                            <p className="mt-2 text-[15px] font-bold text-brand-primary">
                              {formatPrice(unit.price, unit.currencyCode || 'EGP') || t('projectDetails.priceOnRequest')}
                            </p>
                            <div className="mt-4 grid grid-cols-3 gap-2 text-[12px] font-semibold text-brand-muted">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2">
                                <BedDouble size={14} />
                                {unit.noBedRoom}
                              </span>
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2">
                                <Bath size={14} />
                                {unit.noBathRoom}
                              </span>
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2">
                                <Ruler size={14} />
                                {formatNumber(unit.area)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {units.length > 6 && (
                    <p className="mt-4 text-center text-[14px] font-semibold text-brand-muted">
                      +{units.length - 6} {t('projectDetails.moreUnits')}
                    </p>
                  )}
                </motion.section>
              )}
            </div>

            <motion.aside variants={itemVariants} className="flex flex-col gap-6">
              <section className="rounded-[24px] border border-brand-divider bg-brand-bg p-6 shadow-sm">
                <h2 className="text-[22px] font-bold text-brand-primary">
                  {t('projectDetails.overview')}
                </h2>
                <div className="mt-5 grid grid-cols-1 gap-3">
                  {overviewItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div key={item.label} className="flex items-start gap-3 rounded-[18px] bg-white p-4">
                        <Icon size={19} className="mt-0.5 shrink-0 text-brand-secondary" />
                        <div>
                          <p className="text-[13px] font-bold text-brand-primary">
                            {item.label}
                          </p>
                          <p className="mt-1 text-[15px] font-semibold leading-6 text-brand-muted">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-[24px] border border-brand-divider bg-white p-6 shadow-sm">
                <h2 className="text-[22px] font-bold text-brand-primary">
                  {t('projectDetails.pricing')}
                </h2>
                <div className="mt-5 flex flex-col gap-3">
                  {prices.length > 0 ? (
                    prices.map((price) => (
                      <div key={`${price.currency}-${price.id ?? price.minimumPrice}`} className="rounded-[18px] border border-brand-divider bg-brand-bg p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[13px] font-bold text-brand-primary shadow-sm">
                            <CircleDollarSign size={15} className="text-brand-secondary" />
                            {price.currency}
                          </span>
                        </div>
                        <p className="text-[15px] font-bold leading-7 text-brand-primary">
                          {getProjectPriceRange(price, t)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[18px] border border-dashed border-brand-divider bg-brand-bg p-5 text-center text-[14px] font-semibold text-brand-muted">
                      {t('projectDetails.priceOnRequest')}
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-[24px] border border-brand-divider bg-white p-6 shadow-sm">
                <h2 className="text-[22px] font-bold text-brand-primary">
                  {t('projectDetails.paymentPlans')}
                </h2>
                <div className="mt-5 flex flex-col gap-3">
                  {paymentPlans.length > 0 ? (
                    paymentPlans.map((plan) => {
                      const isCash = String(plan.paymentType).toLowerCase() === 'cash';
                      const status = getPlanStatus(plan.status);
                      const months = getPlanMonths(plan);

                      return (
                        <div key={plan.id} className="rounded-[18px] border border-brand-divider bg-brand-bg p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-primary shadow-sm">
                                {isCash ? <Landmark size={18} /> : <CreditCard size={18} />}
                              </span>
                              <div>
                                <h3 className="text-[16px] font-bold text-brand-primary">
                                  {isCash ? t('projectDetails.cashPayment') : t('projectDetails.installment')}
                                </h3>
                                <p className="mt-1 text-[13px] font-semibold text-brand-muted">{status}</p>
                              </div>
                            </div>
                            <CheckCircle2 size={18} className="shrink-0 text-brand-secondary" />
                          </div>
                          <div className="mt-4 grid grid-cols-1 gap-2 text-[13px] font-semibold text-brand-muted">
                            <div className="flex items-center justify-between gap-3">
                              <span className="inline-flex items-center gap-2">
                                <WalletCards size={15} />
                                {t('projectDetails.downPayment')}
                              </span>
                              <span className="font-bold text-brand-primary">{plan.installmentDownPayment}%</span>
                            </div>
                            {!isCash && (
                              <div className="flex items-center justify-between gap-3">
                                <span className="inline-flex items-center gap-2">
                                  <Clock3 size={15} />
                                  {t('projectDetails.duration')}
                                </span>
                                <span className="font-bold text-brand-primary">
                                  {months} {t('projectDetails.months')}
                                </span>
                              </div>
                            )}
                            {plan.commissionRate !== null && (
                              <div className="flex items-center justify-between gap-3">
                                <span className="inline-flex items-center gap-2">
                                  <Percent size={15} />
                                  {t('projectDetails.commission')}
                                </span>
                                <span className="font-bold text-brand-primary">{plan.commissionRate}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-[18px] border border-dashed border-brand-divider bg-brand-bg p-5 text-center text-[14px] font-semibold text-brand-muted">
                      {t('projectDetails.noPaymentPlans')}
                    </div>
                  )}
                </div>
              </section>
            </motion.aside>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
