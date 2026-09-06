'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Building2, Loader2, MapPin, SearchX } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { getProjects, resolveProjectImageUrl, Project, type ProjectFilters as ProjectApiFilters, type FurnitureType } from '@/lib/api/projects';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { slugify } from '@/lib/utils';
import { BRAND_LOGOS } from '@/lib/brand';
import ProjectFilters, { EMPTY_PROJECT_FILTERS, type ProjectFilterValues } from './components/ProjectFilters';

const DEFAULT_IMAGE = '/assists/defaultImage.png';
const DEFAULT_DEVELOPER_LOGO = BRAND_LOGOS.markColor;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' as const },
  },
};

const PAGE_SIZE = 9;

const hasActiveFilters = (filters: ProjectFilterValues) => Object.values(filters).some(Boolean);

const getProjectFiltersFromSearchParams = (searchParams: URLSearchParams): ProjectFilterValues => ({
  ...EMPTY_PROJECT_FILTERS,
  searchTerm: searchParams.get('searchTerm') || '',
  locationId: searchParams.get('locationId') || '',
  developerId: searchParams.get('developerId') || '',
  projectTypeId: searchParams.get('projectTypeId') || '',
  facilityId: searchParams.get('facilityId') || '',
  minimumPrice: searchParams.get('minimumPrice') || '',
  maximumPrice: searchParams.get('maximumPrice') || '',
  priceCurrency: searchParams.get('priceCurrency') || '',
  furnitureType: searchParams.get('furnitureType') || '',
  isFurniture: searchParams.get('isFurniture') || '',
  isFeature: searchParams.get('isFeature') || '',
  deliveryDateFrom: searchParams.get('deliveryDateFrom') || '',
  deliveryDateTo: searchParams.get('deliveryDateTo') || '',
  sortBy: searchParams.get('sortBy') || '',
  sortDirection: searchParams.get('sortDirection') || '',
});

const filtersAreEqual = (a: ProjectFilterValues, b: ProjectFilterValues) => {
  return Object.keys(EMPTY_PROJECT_FILTERS).every((key) => a[key as keyof ProjectFilterValues] === b[key as keyof ProjectFilterValues]);
};

const toNumber = (value: string) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const toBoolean = (value: string) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
};

const buildApiFilters = (filters: ProjectFilterValues): ProjectApiFilters => {
  const furnitureType = toNumber(filters.furnitureType);

  return {
    searchTerm: filters.searchTerm.trim() || undefined,
    locationId: toNumber(filters.locationId),
    developerId: toNumber(filters.developerId),
    projectTypeId: toNumber(filters.projectTypeId),
    facilityId: toNumber(filters.facilityId),
    minimumPrice: toNumber(filters.minimumPrice),
    maximumPrice: toNumber(filters.maximumPrice),
    priceCurrency: filters.priceCurrency || undefined,
    furnitureType: furnitureType === undefined ? undefined : furnitureType as FurnitureType,
    isFurniture: toBoolean(filters.isFurniture),
    isFeature: toBoolean(filters.isFeature),
    deliveryDateFrom: filters.deliveryDateFrom || undefined,
    deliveryDateTo: filters.deliveryDateTo || undefined,
    sortBy: filters.sortBy || undefined,
    sortDirection: filters.sortDirection || undefined,
  };
};

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-bg animate-pulse" />}>
      <ProjectsPageContent />
    </Suspense>
  );
}

function ProjectsPageContent() {
  const { t, getLocalized, language } = useLanguage();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<ProjectFilterValues>(() => getProjectFiltersFromSearchParams(searchParams));

  const fetchProjects = useCallback(async (pageNumber: number, filters: ProjectFilterValues, append = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProjects(pageNumber, PAGE_SIZE, language, buildApiFilters(filters));
      setProjects((current) => append ? [...current, ...data.items] : data.items);
      setTotalCount(data.totalCount);
      setTotalPages(data.totalPages);
      setHasNextPage(data.hasNextPage);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('projects.error'));
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [language, t]);

  useEffect(() => {
    const nextFilters = getProjectFiltersFromSearchParams(searchParams);
    setPage(1);
    setActiveFilters((current) => filtersAreEqual(current, nextFilters) ? current : nextFilters);
  }, [searchParams]);

  useEffect(() => {
    setInitialLoading(page === 1);
    fetchProjects(page, activeFilters, page > 1);
  }, [activeFilters, fetchProjects, page]);

  const handleApplyFilters = (filters: ProjectFilterValues) => {
    setPage(1);
    setActiveFilters({ ...filters });
  };

  const handleClearFilters = () => {
    setPage(1);
    setActiveFilters({ ...EMPTY_PROJECT_FILTERS });
  };

  const hasMore = hasNextPage || page < totalPages;
  const displayedProjects = projects;
  const filtersAreActive = hasActiveFilters(activeFilters);

  const handleShowMore = () => {
    setPage((p) => p + 1);
  };

  return (
    <div className="min-h-screen bg-brand-bg pt-32 font-poppins text-brand-primary">
      <section className="px-5 pb-8 pt-8 sm:px-6 md:px-10 md:pb-12 md:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mx-auto flex max-w-[1280px] flex-col gap-6"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[720px]">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-muted-light bg-white/75 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.18em] text-brand-primary">
                <Building2 size={15} />
                {t('header.projects')}
              </span>
              <h1 className="font-radley text-[42px] leading-[1.05] text-brand-primary sm:text-[52px] md:text-[64px]">
                {t('projects.title')}
              </h1>
              <p className="mt-4 max-w-[620px] text-[15px] leading-7 text-brand-muted md:text-[17px]">
                {t('projects.subtitle')}
              </p>
            </div>

            {!initialLoading && !error && (
              <div className="w-fit rounded-full border border-brand-divider bg-white px-5 py-3 text-[14px] font-semibold text-brand-primary shadow-sm">
                {totalCount} {t('projects.countLabel')}
              </div>
            )}
          </div>
        </motion.div>
      </section>

      <section className="bg-brand-primary-soft px-5 py-12 sm:px-6 md:px-10 md:py-16">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
          <ProjectFilters
            values={activeFilters}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
            isLoading={loading}
          />

          {initialLoading && (
            <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 rounded-[24px] border border-brand-divider bg-white text-brand-muted">
              <Loader2 className="animate-spin text-brand-primary" size={36} />
              <p className="text-[15px] font-semibold">{t('projects.loading')}</p>
            </div>
          )}

          {error && !initialLoading && (
            <div className="flex min-h-[320px] flex-col items-center justify-center gap-5 rounded-[24px] border border-brand-divider bg-white px-6 text-center shadow-sm">
              <SearchX className="text-brand-primary" size={38} />
              <p className="text-[16px] font-semibold text-status-danger">{error}</p>
              <button
                onClick={() => {
                  setInitialLoading(true);
                  fetchProjects(1, activeFilters);
                }}
                className="rounded-full bg-brand-primary px-7 py-3 text-[14px] font-bold text-white transition-all hover:bg-brand-primary"
              >
                {t('projects.tryAgain')}
              </button>
            </div>
          )}

          {!initialLoading && !error && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-10">
              {displayedProjects.length === 0 ? (
                <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-[24px] border border-brand-divider bg-white px-6 text-center text-brand-muted shadow-sm">
                  <SearchX className="text-brand-primary" size={38} />
                  <p className="text-[17px] font-semibold">
                    {filtersAreActive ? t('projects.filters.noFilteredResults') : t('projects.noResults')}
                  </p>
                  {filtersAreActive && (
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="rounded-full bg-brand-primary px-6 py-3 text-[14px] font-bold text-white transition-all hover:bg-brand-primary"
                    >
                      {t('projects.filters.clear')}
                    </button>
                  )}
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {displayedProjects.map((project) => {
                      const localizedName = getLocalized(project.name);
                      const localizedDesc = getLocalized(project.description);
                      const heroImage = resolveProjectImageUrl(project.imageUrls?.[0]) || DEFAULT_IMAGE;
                      const developerLogo = resolveProjectImageUrl(project.logoImage) || DEFAULT_DEVELOPER_LOGO;
                      const projectHref = `/${language}/projects/${project.id}-${slugify(localizedName || project.name)}`;

                      return (
                        <motion.article
                          key={project.id}
                          variants={itemVariants}
                          layout
                          className="group overflow-hidden rounded-[24px] border border-brand-divider bg-white shadow-[0_18px_55px_rgba(7,44,62,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(7,44,62,0.14)]"
                        >
                          <Link href={projectHref} className="relative block aspect-[1.35] overflow-hidden bg-brand-primary-soft">
                            <Image
                              src={heroImage}
                              alt={localizedName || t('projects.title')}
                              fill
                              sizes="(min-width: 1280px) 390px, (min-width: 768px) 50vw, 100vw"
                              draggable={false}
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-primary/70 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                              <span className="inline-flex min-w-0 items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-[12px] font-bold text-brand-primary shadow-sm">
                                <MapPin size={14} className="shrink-0 text-brand-secondary" />
                                <span className="truncate">{project.locationName || t('projects.noLocation')}</span>
                              </span>
                            </div>
                          </Link>

                          <div className="flex min-h-[260px] flex-col p-5 sm:p-6">
                            <div className="mb-5 flex items-center justify-between gap-4">
                              <div className="min-w-0">
                                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-secondary">
                                  {t('projects.developedBy')}
                                </p>
                                <p className="truncate text-[14px] font-semibold text-brand-muted">
                                  {project.developerName || t('projects.noDeveloper')}
                                </p>
                              </div>
                              <div className="relative h-12 w-16 shrink-0 rounded-[14px] border border-brand-primary-soft bg-brand-primary-soft p-2">
                                <Image
                                  src={developerLogo}
                                  alt={project.developerName || t('featureProject.developerLogo')}
                                  fill
                                  sizes="64px"
                                  draggable={false}
                                  className="object-contain p-2"
                                />
                              </div>
                            </div>

                            <h2 className="line-clamp-2 text-[22px] font-bold leading-tight text-brand-primary">
                              <Link href={projectHref} className="transition-colors hover:text-brand-primary">
                                {localizedName}
                              </Link>
                            </h2>
                            <p className="mt-3 line-clamp-3 text-[14px] leading-7 text-brand-muted">
                              {localizedDesc || t('projectDetails.noDescription')}
                            </p>

                            <div className="mt-auto flex items-center justify-end gap-4 pt-6">
                              <Link
                                href={projectHref}
                                className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-5 py-3 text-[14px] font-bold text-white transition-all hover:bg-brand-primary"
                              >
                                {t('projects.viewDetails')}
                                <ArrowRight size={17} />
                              </Link>
                            </div>
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>
                </AnimatePresence>
              )}

              {hasMore && displayedProjects.length > 0 && (
                <div className="flex justify-center">
                  <button
                    onClick={handleShowMore}
                    disabled={loading}
                    className="inline-flex min-w-[220px] items-center justify-center gap-3 rounded-full border border-brand-primary bg-white px-8 py-4 text-[15px] font-bold text-brand-primary transition-all hover:bg-brand-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        {t('projects.loadingMore')}
                      </>
                    ) : (
                      <>
                        {t('projects.showMore')}
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              )}

              {!hasMore && displayedProjects.length > 0 && (
                <p className="text-center text-[14px] font-medium text-brand-muted">
                  {t('projects.allLoaded')}
                </p>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
