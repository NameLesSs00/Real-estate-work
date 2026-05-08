'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Loader2 } from 'lucide-react';
import { getProjects, resolveProjectImageUrl, Project } from '@/lib/api/projects';

import { motion, AnimatePresence, type Variants } from 'framer-motion';

import { useLanguage } from '@/lib/contexts/LanguageContext';
import { slugify } from '@/lib/utils';

const DEFAULT_IMAGE = '/assists/defaultImage.png';
const DEFAULT_DEVELOPER_LOGO = '/assists/defaultLogo.png';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' as const }
  }
};

export default function ProjectsPage() {
  const { t, getLocalized, language } = useLanguage();
  const [projects, setProjects]           = useState<Project[]>([]);
  const [page, setPage]                   = useState(1);
  const [hasMore, setHasMore]             = useState(true);
  const [loading, setLoading]             = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError]                 = useState<string | null>(null);

  const fetchPage = useCallback(async (pageNumber: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProjects(pageNumber, 10, language);
      setProjects((prev) => pageNumber === 1 ? data.items : [...prev, ...data.items]);
      setHasMore(data.hasNextPage);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('projects.error') as string);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [t, language]);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const handleShowMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPage(nextPage);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-36 pb-24 font-poppins">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">

        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-[36px] md:text-[48px] font-bold text-[#1B2134] leading-tight">
            {t('projects.title') as string}
          </h1>
        </motion.div>

        {/* Initial Loading */}
        {initialLoading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-gray-400">
            <Loader2 className="animate-spin" size={36} />
            <p className="text-[16px]">{t('projects.loading') as string}</p>
          </div>
        )}

        {/* Error */}
        {error && !initialLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-red-500 text-[16px]">{error}</p>
            <button
              onClick={() => fetchPage(1)}
              className="bg-[#1B2134] text-white px-8 py-3 rounded-full text-[15px] hover:bg-[#252d46] transition-all"
            >
              {t('projects.tryAgain') as string}
            </button>
          </div>
        )}

        {/* Project Cards */}
        {!initialLoading && !error && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8"
          >
            {projects.length === 0 ? (
              <div className="text-center py-24 text-gray-400 text-[18px]">
                {t('projects.noResults') as string}
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {projects.map((project) => {
                  const heroImage =
                    project.imageUrls?.[0]
                      ? (resolveProjectImageUrl(project.imageUrls[0]) ?? DEFAULT_IMAGE)
                      : DEFAULT_IMAGE;

                  const localizedName = getLocalized(project.name);
                  const localizedDesc = getLocalized(project.description);

                  return (
                    <motion.div
                      key={project.id}
                      variants={itemVariants}
                      layout
                      className="bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden border border-[#F0EDE8] hover:shadow-[0_16px_48px_rgba(0,0,0,0.09)] hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row"
                    >
                      {/* Left: Hero Image */}
                      <Link href={`/${language}/projects/${project.id}-${slugify(localizedName)}`} className="relative w-full md:w-[400px] h-[240px] md:h-auto flex-shrink-0 overflow-hidden block">
                        <Image
                          src={heroImage}
                          alt={localizedName}
                          fill
                          draggable={false}
                          className="object-cover transition-transform duration-700 hover:scale-105"
                        />
                      </Link>

                      {/* Right: Content */}
                      <div className="flex-1 p-7 md:p-10 flex flex-col justify-between relative">

                        {/* Developer Logo — top right */}
                        <div className="absolute top-5 right-5">
                          <div className="relative w-[60px] h-[30px] sm:w-[100px] sm:h-[50px]">
                            <Image
                              src={resolveProjectImageUrl(project.logoImage) || DEFAULT_DEVELOPER_LOGO}
                              alt={project.developerName}
                              fill
                              draggable={false}
                              className="object-contain"
                            />
                          </div>
                        </div>

                        {/* Top Content */}
                        <div className="flex flex-col gap-3 pr-20 sm:pr-28">
                          {/* Project Name */}
                          <h2 className="text-[22px] md:text-[28px] font-bold text-[#1B2134] leading-tight">
                            {localizedName}
                          </h2>

                          {/* Location */}
                          <div className="flex items-center gap-2 text-[14px] text-[#888]">
                            <MapPin size={16} className="text-[#C7B7A1] flex-shrink-0" />
                            <span>{project.locationName || t('projects.noLocation') as string}</span>
                          </div>

                          {/* Description */}
                          <p className="text-[14px] md:text-[15px] text-[#666] leading-relaxed line-clamp-3 mt-1">
                            {localizedDesc}
                          </p>
                        </div>

                        {/* Bottom: View Details Button */}
                        <div className="flex justify-end mt-8">
                          <Link
                            href={`/${language}/projects/${project.id}-${slugify(localizedName)}`}
                            className="bg-[#1B2134] text-white px-10 py-3.5 rounded-full text-[15px] font-semibold hover:bg-[#252d46] hover:-translate-y-0.5 transition-all"
                          >
                            {t('projects.viewDetails') as string}
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}

            {/* Show More */}
            {hasMore && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleShowMore}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 border border-[#1B2134] text-[#1B2134] rounded-full py-5 text-[17px] font-semibold hover:bg-[#1B2134] hover:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      {t('projects.loadingMore') as string}
                    </>
                  ) : (
                    t('projects.showMore') as string
                  )}
                </button>
              </div>
            )}

            {/* End of results */}
            {!hasMore && projects.length > 0 && (
              <p className="text-center text-[14px] text-gray-400 pt-4">
                {t('projects.allLoaded') as string}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
