'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Building2, Check, ChevronRight, Loader2, MapPin } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import {
  getProjectById,
  resolveProjectImageUrl,
  Project,
} from '@/lib/api/projects';
import { getFacilities, Facility } from '@/lib/api/facilities';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import ImageGallery from '@/components/ImageGallery';
import { BRAND_LOGOS } from '@/lib/brand';

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
      const [projectData, facilityData] = await Promise.all([
        getProjectById(projectId, language),
        getFacilities(),
      ]);
      setProject(projectData);
      setFacilities(facilityData);
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
  const unitCount = project.units?.length ?? 0;
  const facilityIds = project.facilityIds?.length
    ? project.facilityIds
    : (project.facilities ?? [])
      .map((facId) => Number(facId))
      .filter((facId) => Number.isFinite(facId));


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

          <motion.div variants={itemVariants} className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-muted-light bg-white/75 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.18em] text-brand-primary">
                <Building2 size={15} />
                {t('header.projects')}
              </span>
              <h1 className="font-radley text-[40px] leading-[1.05] text-brand-primary sm:text-[52px] md:text-[64px]">
                {localizedName}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-brand-muted shadow-sm">
                  <MapPin size={17} className="shrink-0 text-brand-secondary" />
                  <span className="truncate">{project.locationName || t('projects.noLocation')}</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-brand-muted shadow-sm">
                  <Check size={17} className="text-brand-secondary" />
                  {unitCount} {t('projects.unitsAvailable')}
                </span>
              </div>
            </div>

            <div className="rounded-[24px] border border-brand-divider bg-white p-5 shadow-[0_18px_55px_rgba(7,44,62,0.08)]">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-secondary">
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
                  <p className="mt-1 text-[13px] font-medium text-brand-muted">
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

          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <motion.article variants={itemVariants} className="rounded-[24px] border border-brand-divider bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-radley text-[32px] leading-tight text-brand-primary">
                {t('projectDetails.description')}
              </h2>
              <div className="mt-5 h-px w-full bg-brand-primary-soft" />
              <div className="mt-6 flex flex-col gap-4">
                {localizedDesc ? (
                  localizedDesc.split('\n\n').map((para, index) => (
                    <p key={index} className="text-[15px] leading-8 text-brand-muted">
                      {para}
                    </p>
                  ))
                ) : (
                  <p className="text-[15px] italic leading-8 text-brand-muted">
                    {t('projectDetails.noDescription')}
                  </p>
                )}
              </div>
            </motion.article>

            <motion.aside variants={itemVariants} className="flex flex-col gap-6">
              <div className="rounded-[24px] border border-brand-divider bg-brand-bg p-6 shadow-sm">
                <h2 className="font-radley text-[28px] leading-tight text-brand-primary">
                  {t('projectDetails.overview')}
                </h2>
                <div className="mt-5 flex flex-col gap-3">
                  <div className="flex items-start gap-3 rounded-[18px] bg-white p-4">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-brand-secondary" />
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-secondary">
                        {t('projects.location')}
                      </p>
                      <p className="mt-1 text-[14px] font-semibold text-brand-muted">
                        {project.locationName || t('projects.noLocation')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-[18px] bg-white p-4">
                    <Building2 size={18} className="mt-0.5 shrink-0 text-brand-secondary" />
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-secondary">
                        {t('projects.units')}
                      </p>
                      <p className="mt-1 text-[14px] font-semibold text-brand-muted">
                        {unitCount} {t('projects.unitsAvailable')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {facilityIds.length > 0 && (
                <div className="rounded-[24px] border border-brand-divider bg-white p-6 shadow-sm">
                  <h2 className="font-radley text-[28px] leading-tight text-brand-primary">
                    {t('projectDetails.facilities')}
                  </h2>
                  <div className="mt-5 flex flex-col gap-3">
                    {facilityIds.map((facId) => {
                      const facName = facilities.find((facility) => facility.id === facId)?.name;
                      const localizedFacName = typeof facName === 'string'
                        ? facName
                        : getLocalized(facName) || `${t('projectDetails.facilities')} ${facId}`;

                      return (
                        <div key={facId} className="flex items-center gap-3 rounded-[18px] bg-brand-primary-soft p-4 text-brand-muted">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-bg text-brand-primary">
                            <Check size={16} strokeWidth={3} />
                          </span>
                          <span className="text-[14px] font-semibold">{localizedFacName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.aside>
          </div>

        </motion.div>
      </section>
    </div>
  );
}
