'use client';

import { useState, useEffect, useCallback, use, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Building2, Check, ChevronRight, Loader2, MapPin, Minus, Plus, RotateCcw, X, ZoomIn } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import {
  getProjectById,
  getProjectImagePricelists,
  resolveProjectImageUrl,
  Project,
  ProjectImagePricelist,
} from '@/lib/api/projects';
import { getFacilities, Facility } from '@/lib/api/facilities';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import ImageGallery from '@/components/ImageGallery';
import { BRAND_LOGOS } from '@/lib/brand';

const DEFAULT_IMAGE = '/assists/defaultImage.png';
const DEFAULT_DEVELOPER_LOGO = BRAND_LOGOS.markColor;
const MIN_LIGHTBOX_ZOOM = 1;
const MAX_LIGHTBOX_ZOOM = 4;
const LIGHTBOX_ZOOM_STEP = 0.25;

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
  const [priceLists, setPriceLists] = useState<ProjectImagePricelist[]>([]);
  const [selectedPriceList, setSelectedPriceList] = useState<ProjectImagePricelist | null>(null);
  const [lightboxZoom, setLightboxZoom] = useState(MIN_LIGHTBOX_ZOOM);
  const [lightboxPan, setLightboxPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const panStartRef = useRef({ pointerId: null as number | null, x: 0, y: 0, panX: 0, panY: 0 });

  useBodyScrollLock(Boolean(selectedPriceList));

  const resetLightboxView = useCallback(() => {
    setLightboxZoom(MIN_LIGHTBOX_ZOOM);
    setLightboxPan({ x: 0, y: 0 });
    setIsPanning(false);
    panStartRef.current = { pointerId: null, x: 0, y: 0, panX: 0, panY: 0 };
  }, []);

  const closePriceListLightbox = useCallback(() => {
    setSelectedPriceList(null);
    resetLightboxView();
  }, [resetLightboxView]);

  useEscapeKey(closePriceListLightbox, Boolean(selectedPriceList));

  const openPriceListLightbox = (priceList: ProjectImagePricelist) => {
    resetLightboxView();
    setSelectedPriceList(priceList);
  };

  const changeLightboxZoom = useCallback((delta: number) => {
    setLightboxZoom((current) => {
      const next = Math.min(MAX_LIGHTBOX_ZOOM, Math.max(MIN_LIGHTBOX_ZOOM, current + delta));
      if (next === MIN_LIGHTBOX_ZOOM) setLightboxPan({ x: 0, y: 0 });
      return Number(next.toFixed(2));
    });
  }, []);

  const resetLightboxZoom = () => {
    setLightboxZoom(MIN_LIGHTBOX_ZOOM);
    setLightboxPan({ x: 0, y: 0 });
    setIsPanning(false);
  };

  const handleLightboxWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    changeLightboxZoom(event.deltaY < 0 ? LIGHTBOX_ZOOM_STEP : -LIGHTBOX_ZOOM_STEP);
  };

  const handlePanStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if (lightboxZoom <= MIN_LIGHTBOX_ZOOM) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    panStartRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      panX: lightboxPan.x,
      panY: lightboxPan.y,
    };
    setIsPanning(true);
  };

  const handlePanMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanning || panStartRef.current.pointerId !== event.pointerId) return;

    const start = panStartRef.current;
    setLightboxPan({
      x: start.panX + event.clientX - start.x,
      y: start.panY + event.clientY - start.y,
    });
  };

  const handlePanEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (panStartRef.current.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    panStartRef.current.pointerId = null;
    setIsPanning(false);
  };

  const load = useCallback(async () => {
    if (Number.isNaN(projectId)) {
      setError(t('projectDetails.notFound'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [projectData, facilityData, priceListData] = await Promise.all([
        getProjectById(projectId, language),
        getFacilities(),
        getProjectImagePricelists(projectId).catch((priceListError) => {
          console.error('[ProjectDetailsPage] Failed to load price lists:', priceListError);
          return [];
        }),
      ]);
      setProject(projectData);
      setFacilities(facilityData);
      setPriceLists(priceListData);
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
      <div className="flex min-h-screen items-center justify-center bg-[#E3F2FD] px-5 pt-32 font-poppins">
        <div className="flex flex-col items-center gap-4 rounded-[24px] border border-[#BBDEFB] bg-white px-12 py-10 text-[#36516F] shadow-sm">
          <Loader2 size={38} className="animate-spin text-[#1565C0]" />
          <p className="text-[15px] font-semibold">{t('projectDetails.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !project || !localizedName) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#E3F2FD] px-5 pt-32 text-center font-poppins">
        <p className="text-[16px] font-semibold text-[#B42318]">{error ?? t('projectDetails.notFound')}</p>
        <Link
          href={`/${language}/projects`}
          className="inline-flex items-center gap-2 rounded-full bg-[#1565C0] px-7 py-3 text-[14px] font-bold text-white transition-all hover:bg-[#0D47A1]"
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
  const sortedPriceLists = [...priceLists].sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id);
  const selectedPriceListImage = selectedPriceList
    ? resolveProjectImageUrl(selectedPriceList.imageUrl)
    : null;

  return (
    <div className="min-h-screen bg-[#F8FBFF] pt-32 font-poppins text-[#0B1F3A]">
      <section className="bg-[#E3F2FD] px-5 pb-10 pt-8 sm:px-6 md:px-10 md:pb-14 md:pt-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mx-auto flex max-w-[1280px] flex-col gap-8"
        >
          <motion.nav variants={itemVariants} className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-[#5B6F86]">
            <Link href={`/${language}/projects`} className="transition-colors hover:text-[#1565C0]">
              {t('projects.title')}
            </Link>
            <ChevronRight size={14} className="text-[#90CAF9]" />
            <span className="text-[#0D47A1]">{localizedName}</span>
          </motion.nav>

          <motion.div variants={itemVariants} className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#90CAF9] bg-white/75 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.18em] text-[#1565C0]">
                <Building2 size={15} />
                {t('header.projects')}
              </span>
              <h1 className="font-radley text-[40px] leading-[1.05] text-[#0D47A1] sm:text-[52px] md:text-[64px]">
                {localizedName}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-[#36516F] shadow-sm">
                  <MapPin size={17} className="shrink-0 text-[#2196F3]" />
                  <span className="truncate">{project.locationName || t('projects.noLocation')}</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-[#36516F] shadow-sm">
                  <Check size={17} className="text-[#2196F3]" />
                  {unitCount} {t('projects.unitsAvailable')}
                </span>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#BBDEFB] bg-white p-5 shadow-[0_18px_55px_rgba(13,71,161,0.08)]">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#42A5F5]">
                {t('projects.developedBy')}
              </p>
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-20 shrink-0 rounded-[18px] border border-[#E1F0FF] bg-[#F8FBFF]">
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
                  <h2 className="truncate text-[20px] font-bold text-[#071F49]">
                    {project.developerName || t('projects.noDeveloper')}
                  </h2>
                  <p className="mt-1 text-[13px] font-medium text-[#6F849D]">
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
          <motion.div variants={itemVariants} className="overflow-hidden rounded-[24px] border border-[#BBDEFB] bg-white p-3 shadow-[0_18px_55px_rgba(13,71,161,0.08)]">
            <ImageGallery images={images} projectName={localizedName} />
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <motion.article variants={itemVariants} className="rounded-[24px] border border-[#BBDEFB] bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-radley text-[32px] leading-tight text-[#0D47A1]">
                {t('projectDetails.description')}
              </h2>
              <div className="mt-5 h-px w-full bg-[#D5EAFF]" />
              <div className="mt-6 flex flex-col gap-4">
                {localizedDesc ? (
                  localizedDesc.split('\n\n').map((para, index) => (
                    <p key={index} className="text-[15px] leading-8 text-[#4F6580]">
                      {para}
                    </p>
                  ))
                ) : (
                  <p className="text-[15px] italic leading-8 text-[#6F849D]">
                    {t('projectDetails.noDescription')}
                  </p>
                )}
              </div>
            </motion.article>

            <motion.aside variants={itemVariants} className="flex flex-col gap-6">
              <div className="rounded-[24px] border border-[#BBDEFB] bg-[#E3F2FD] p-6 shadow-sm">
                <h2 className="font-radley text-[28px] leading-tight text-[#0D47A1]">
                  {t('projectDetails.overview')}
                </h2>
                <div className="mt-5 flex flex-col gap-3">
                  <div className="flex items-start gap-3 rounded-[18px] bg-white p-4">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-[#2196F3]" />
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#42A5F5]">
                        {t('projects.location')}
                      </p>
                      <p className="mt-1 text-[14px] font-semibold text-[#36516F]">
                        {project.locationName || t('projects.noLocation')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-[18px] bg-white p-4">
                    <Building2 size={18} className="mt-0.5 shrink-0 text-[#2196F3]" />
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#42A5F5]">
                        {t('projects.units')}
                      </p>
                      <p className="mt-1 text-[14px] font-semibold text-[#36516F]">
                        {unitCount} {t('projects.unitsAvailable')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {facilityIds.length > 0 && (
                <div className="rounded-[24px] border border-[#BBDEFB] bg-white p-6 shadow-sm">
                  <h2 className="font-radley text-[28px] leading-tight text-[#0D47A1]">
                    {t('projectDetails.facilities')}
                  </h2>
                  <div className="mt-5 flex flex-col gap-3">
                    {facilityIds.map((facId) => {
                      const facName = facilities.find((facility) => facility.id === facId)?.name;
                      const localizedFacName = typeof facName === 'string'
                        ? facName
                        : getLocalized(facName) || `${t('projectDetails.facilities')} ${facId}`;

                      return (
                        <div key={facId} className="flex items-center gap-3 rounded-[18px] bg-[#F8FBFF] p-4 text-[#36516F]">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E3F2FD] text-[#1565C0]">
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

          {sortedPriceLists.length > 0 && (
            <motion.section variants={itemVariants} className="rounded-[24px] border border-[#BBDEFB] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-radley text-[32px] leading-tight text-[#0D47A1]">
                    {t('projectDetails.priceLists')}
                  </h2>
                  <div className="mt-4 h-px w-full bg-[#D5EAFF] sm:w-[260px]" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sortedPriceLists.map((priceList) => {
                  const imageUrl = resolveProjectImageUrl(priceList.imageUrl);

                  return (
                    <button
                      key={priceList.id}
                      type="button"
                      onClick={() => {
                        if (imageUrl) openPriceListLightbox(priceList);
                      }}
                      disabled={!imageUrl}
                      aria-label={t('projectDetails.viewPriceList')}
                      className="group relative aspect-[1.35] w-full overflow-hidden rounded-[20px] border border-[#D5EAFF] bg-[#E3F2FD] transition-all hover:-translate-y-0.5 hover:border-[#90CAF9] hover:shadow-[0_16px_40px_rgba(13,71,161,0.1)] disabled:cursor-default disabled:hover:translate-y-0 disabled:hover:border-[#D5EAFF] disabled:hover:shadow-none"
                    >
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={t('projectDetails.priceLists')}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[13px] font-semibold text-[#6F849D]">
                          {t('projectDetails.noPriceLists')}
                        </div>
                      )}
                      <span className="absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#1565C0] shadow-sm transition-transform group-hover:scale-105">
                        <ZoomIn size={18} />
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.section>
          )}
        </motion.div>
      </section>

      {selectedPriceList && selectedPriceListImage && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={closePriceListLightbox}
        >
          <div className="relative flex h-full max-h-[92vh] w-full max-w-[1180px] flex-col gap-4" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-end gap-2 text-white">
              <button
                type="button"
                onClick={() => changeLightboxZoom(-LIGHTBOX_ZOOM_STEP)}
                disabled={lightboxZoom <= MIN_LIGHTBOX_ZOOM}
                className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40 sm:inline-flex"
                aria-label="Zoom out"
              >
                <Minus size={20} />
              </button>
              <span className="hidden h-11 min-w-16 items-center justify-center rounded-full bg-white/10 px-4 text-[13px] font-bold tabular-nums sm:inline-flex">
                {Math.round(lightboxZoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => changeLightboxZoom(LIGHTBOX_ZOOM_STEP)}
                disabled={lightboxZoom >= MAX_LIGHTBOX_ZOOM}
                className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40 sm:inline-flex"
                aria-label="Zoom in"
              >
                <Plus size={20} />
              </button>
              <button
                type="button"
                onClick={resetLightboxZoom}
                className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:inline-flex"
                aria-label="Reset zoom"
              >
                <RotateCcw size={19} />
              </button>
              <button
                type="button"
                onClick={closePriceListLightbox}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Close price list image"
              >
                <X size={22} />
              </button>
            </div>

            <div
              className={`relative min-h-0 flex-1 overflow-hidden rounded-[20px] bg-black ${lightboxZoom > MIN_LIGHTBOX_ZOOM ? isPanning ? 'cursor-grabbing touch-none' : 'cursor-grab touch-none' : 'cursor-zoom-in'}`}
              onWheel={handleLightboxWheel}
              onPointerDown={handlePanStart}
              onPointerMove={handlePanMove}
              onPointerUp={handlePanEnd}
              onPointerCancel={handlePanEnd}
            >
              <div
                className="absolute inset-0 transition-transform duration-100 ease-out"
                style={{
                  transform: `translate3d(${lightboxPan.x}px, ${lightboxPan.y}px, 0) scale(${lightboxZoom})`,
                  transformOrigin: 'center',
                }}
              >
                <Image
                  src={selectedPriceListImage}
                  alt={t('projectDetails.priceLists')}
                  fill
                  sizes="100vw"
                  className="select-none object-contain"
                  draggable={false}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
