'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ChevronRight, Loader2, Check } from 'lucide-react';
import { getProjectById, resolveProjectImageUrl, Project } from '@/lib/api/projects';
import { getFacilities, Facility } from '@/lib/api/facilities';
import { getDeveloperById } from '@/lib/api/developers';
import { motion, type Variants } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import ImageGallery from '@/components/ImageGallery';

const DEFAULT_IMAGE = '/assists/defaultImage.png';



const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.6
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const }
  }
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { t, getLocalized } = useLanguage();
  const { slug } = use(params);
  const projectId = Number(slug);

  const [project,     setProject]     = useState<Project | null>(null);
  const [facilities,  setFacilities]  = useState<Facility[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);

  const load = useCallback(async () => {
    if (isNaN(projectId)) {
      setError(t('projectDetails.notFound') as string);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [data, facs] = await Promise.all([
        getProjectById(projectId),
        getFacilities()
      ]);
      setProject(data);
      setFacilities(facs);

      if (data.developerId) {
        try {
          await getDeveloperById(data.developerId);
        } catch {
          // silently fall back
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('projects.error') as string);
    } finally {
      setLoading(false);
    }
  }, [projectId, t]);

  useEffect(() => { load(); }, [load]);

  // Build resolved image URLs
  const images: string[] = (project?.imageUrls ?? [])
    .map((url) => resolveProjectImageUrl(url) ?? DEFAULT_IMAGE)
    .filter(Boolean);

  if (images.length === 0) images.push(DEFAULT_IMAGE);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-36">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <Loader2 size={40} className="animate-spin" />
          <p className="text-[16px] font-poppins">{t('projectDetails.loading') as string}</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error || !project) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-36 gap-4">
        <p className="text-red-500 text-[16px] font-poppins">{error ?? t('projectDetails.notFound') as string}</p>
        <Link
          href="/projects"
          className="bg-[#1B2134] text-white px-8 py-3 rounded-full text-[15px] hover:bg-[#252d46] transition-all"
        >
          {t('projectDetails.backToProjects') as string}
        </Link>
      </div>
    );
  }

  const localizedName = getLocalized(project.name);
  const localizedDesc = getLocalized(project.description);

  return (
    <>
      <div className="min-h-screen bg-white pt-36 pb-24 font-poppins">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col gap-10"
        >

          {/* Breadcrumb */}
          <motion.nav variants={itemVariants} className="flex items-center gap-1.5 text-[14px] text-[#888]">
            <Link href="/projects" className="hover:text-[#1B2134] transition-colors">{t('projects.title') as string}</Link>
            <ChevronRight size={13} className="text-[#bbb]" />
            <span className="text-[#1B2134] font-semibold">{localizedName}</span>
          </motion.nav>

          {/* ── Top: Gallery (left) + Form (right) ── */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Left: Gallery + Meta */}
            <motion.div variants={itemVariants} className="flex flex-col gap-8 flex-1 min-w-0">

              <ImageGallery images={images} projectName={localizedName} />

              {/* Project Meta */}
              <div className="flex flex-col gap-3">
                <h1 className="text-[28px] md:text-[36px] font-bold text-[#1B2134] leading-tight">
                  {localizedName}
                </h1>

                <div className="flex flex-wrap items-center gap-6 mt-2">
                  <div className="flex items-center gap-2 text-[15px] text-[#666]">
                    <MapPin size={18} className="text-[#C7B7A1] flex-shrink-0" />
                    <span>{project.locationName || t('projects.noLocation') as string}</span>
                  </div>

                  {project.developerName && (
                    <div className="flex items-center gap-8 mt-4 group">
                      {project.logoImage && (
                        <div className="relative w-24 h-24 flex-shrink-0 transition-all duration-700 ease-in-out">
                          <Image 
                            src={resolveProjectImageUrl(project.logoImage) || DEFAULT_IMAGE} 
                            alt={project.developerName} 
                            fill 
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div className="h-12 w-px bg-[#E5E2DE]" />
                      <div className="flex flex-col">
                        <span className="text-[12px] text-[#C7B7A1] font-bold uppercase tracking-[0.2em] mb-1">Developed By</span>
                        <span className="text-[24px] font-bold text-[#1B2134] tracking-tight">{project.developerName}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right: Get in Touch Form (static) */}
            <motion.div variants={itemVariants} className="w-full lg:w-[420px] flex-shrink-0">
              <div className="bg-[#F8F5F080] border border-[#F0EDE8] rounded-[20px] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.06)] sticky top-28">
                <h2 className="text-[20px] font-bold text-[#1B2134] text-center mb-6">
                  {t('projectDetails.getInTouch') as string}
                </h2>
                <form className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-[#1B2134]">
                      {t('projectDetails.fullName') as string} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder={t('projectDetails.fullName') as string}
                      required
                      className="w-full border border-[#E5E2DE] rounded-[10px] px-4 py-3 text-[14px] placeholder:text-[#BDBDBD] outline-none focus:border-[#1B2134] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-[#1B2134]">
                      {t('projectDetails.phoneNumber') as string} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder={t('projectDetails.phoneNumber') as string}
                      required
                      className="w-full border border-[#E5E2DE] rounded-[10px] px-4 py-3 text-[14px] placeholder:text-[#BDBDBD] outline-none focus:border-[#1B2134] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-[#1B2134]">{t('projectDetails.email') as string}</label>
                    <input
                      type="email"
                      placeholder={t('projectDetails.email') as string}
                      required
                      className="w-full border border-[#E5E2DE] rounded-[10px] px-4 py-3 text-[14px] placeholder:text-[#BDBDBD] outline-none focus:border-[#1B2134] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-[#1B2134]">{t('projectDetails.message') as string}</label>
                    <textarea
                      placeholder={t('projectDetails.message') as string}
                      rows={4}
                      required
                      className="w-full border border-[#E5E2DE] rounded-[10px] px-4 py-3 text-[14px] placeholder:text-[#BDBDBD] outline-none focus:border-[#1B2134] transition-colors resize-none"
                    />
                  </div>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="mt-0.5 w-4 h-4 accent-[#1B2134] cursor-pointer flex-shrink-0"
                    />
                    <label htmlFor="terms" className="text-[13px] text-[#666] leading-snug cursor-pointer">
                      {t('projectDetails.agreeTerms') as string}
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#1B2134] text-white rounded-full py-4 text-[15px] font-semibold flex items-center justify-center gap-3 hover:bg-[#252d46] transition-all mt-1"
                  >
                    {t('projectDetails.bookVisit') as string}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* ── Facilities Grid (Replaces Stats) ── */}
          {((project.facilityIds && project.facilityIds.length > 0) || (project.facilities && project.facilities.length > 0)) && (
            <motion.div variants={itemVariants} className="bg-white border border-[#F0EDE8] rounded-[24px] p-8 shadow-sm">
              <h2 className="text-[20px] font-bold text-[#1B2134] mb-6 flex items-center gap-3">
                {t('projectDetails.facilities') || 'Facilities'}
                <span className="h-px flex-1 bg-gray-100"></span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {project.facilityIds && project.facilityIds.length > 0 ? (
                  project.facilityIds.map((facId) => {
                    const facName = facilities.find(f => f.id === facId)?.name;
                    const localizedFacName = typeof facName === 'string' ? facName : (facName ? getLocalized(facName) : `Facility ${facId}`);
                    return (
                      <div key={facId} className="flex items-center gap-4 group p-3 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-[#1B2134]/5 flex items-center justify-center text-[#1B2134] group-hover:bg-[#1B2134] group-hover:text-white transition-all">
                          <Check size={16} strokeWidth={3} />
                        </div>
                        <span className="text-[14px] md:text-[15px] font-medium text-[#666] group-hover:text-[#1B2134] transition-colors">{localizedFacName}</span>
                      </div>
                    );
                  })
                ) : project.facilities && project.facilities.length > 0 ? (
                  project.facilities.map((facId) => {
                    const id = Number(facId);
                    const facName = facilities.find(f => f.id === id)?.name;
                    const localizedFacName = typeof facName === 'string' ? facName : (facName ? getLocalized(facName) : `Facility ${facId}`);
                    return (
                      <div key={facId} className="flex items-center gap-4 group p-3 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-[#1B2134]/5 flex items-center justify-center text-[#1B2134] group-hover:bg-[#1B2134] group-hover:text-white transition-all">
                          <Check size={16} strokeWidth={3} />
                        </div>
                        <span className="text-[14px] md:text-[15px] font-medium text-[#666] group-hover:text-[#1B2134] transition-colors">{localizedFacName}</span>
                      </div>
                    );
                  })
                ) : null}
              </div>
            </motion.div>
          )}

          {/* ── Description ── */}
          <motion.div variants={itemVariants} className="bg-[#F8F5F0] border border-[#F0EDE8] rounded-[24px] p-8 shadow-sm">
            <h2 className="text-[20px] font-bold text-[#1B2134] mb-4">{t('projectDetails.description') as string}</h2>
            <hr className="border-[#F0EDE8] mb-6" />
            <div className="flex flex-col gap-4">
              {project.description
                ? localizedDesc.split('\n\n').map((para, i) => (
                    <p key={i} className="text-[14px] md:text-[15px] text-[#666] leading-relaxed">
                      {para}
                    </p>
                  ))
                : <p className="text-[14px] text-[#AAA] italic">{t('projectDetails.noDescription') as string}</p>
              }
            </div>
          </motion.div>

        </motion.div>
      </div>
    </>
  );
}
