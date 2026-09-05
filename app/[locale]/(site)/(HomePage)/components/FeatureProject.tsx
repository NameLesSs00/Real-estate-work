'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ArrowRight, Loader2, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { getProjects, Project, resolveProjectImageUrl } from '@/lib/api/projects';
import { getServices, Service } from '@/lib/api/services';

import './FeatureProject.css';
import { slugify } from '@/lib/utils';
import { BRAND_LOGOS } from '@/lib/brand';
import { getFacilityServiceIcon } from '@/lib/icons/facilityServiceIcons';

const DEFAULT_LOGO = BRAND_LOGOS.markColor;

const FeatureProject = () => {
  const { t, language } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [projData, servData] = await Promise.all([
        getProjects(1, 20, language),
        getServices(),
      ]);

      // Shuffle and take up to 5 projects
      const allProjects = projData.items || [];
      const shuffled = [...allProjects].sort(() => 0.5 - Math.random());
      setProjects(shuffled.slice(0, 5));
      setServices(servData);


    } catch (err) {
      console.error('[FeatureProject] Failed to fetch data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-cycle every 8 seconds
  useEffect(() => {
    if (projects.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % projects.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [projects.length]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (projects.length === 0) return null;

  const activeProject = projects[activeIndex];
  const projectImg = resolveProjectImageUrl(activeProject.imageUrls?.[0] ?? null) || '/assists/defaultImage.png';

  // Resolve developer logo for active project
  const developerLogoUrl = resolveProjectImageUrl(activeProject.logoImage) || DEFAULT_LOGO;

  // Map facility IDs to names
  const projectFacilities = (activeProject.facilities || [])
    .map((fId) => {
      if (typeof fId === 'string') return { name: fId, icon: null };
      const service = services.find((s) => s.id === fId);
      if (!service) return null;
      const name = typeof service.name === 'object' ? service.name[language] || service.name.en : service.name;
      return { name, icon: service.icon };
    })
    .filter(Boolean) as { name: string; icon: string | null }[];

  return (
    <section className="feature-project-section overflow-hidden" aria-labelledby="feature-project-heading">
      <div className="feature-project-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="feature-project-header"
        >
          <span className="feature-project-tag">{t('featureProject.tag') as string}</span>
          <h2 id="feature-project-heading" className="feature-project-title">{t('featureProject.title') as string}</h2>
          <p className="feature-project-subtitle">{t('featureProject.subtitle') as string}</p>
          <div className="feature-project-accent-line"></div>
        </motion.div>

        <div className="feature-project-content-wrapper">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="feature-project-content"
            >
              {/* ── Left: Image + Developer Logo Badge ── */}
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="project-visuals"
              >
                <div className="project-img-wrapper">
                  <Image
                    src={projectImg}
                    alt={activeProject.name}
                    width={800}
                    height={600}
                    className="project-main-img"
                    unoptimized
                  />
                </div>
              </motion.div>

              {/* ── Right: Details ── */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="project-details-info"
              >
                <h3 className="project-name">{activeProject.name}</h3>
                <div className="project-location-row">
                  <div className="project-location">
                    <MapPin size={18} />
                    <span>{activeProject.locationName || t('featureProject.locationTbd')}</span>
                  </div>
                  <div className="developer-logo-inline" title={activeProject.developerName || undefined}>
                    <Image
                      src={developerLogoUrl}
                      alt={activeProject.developerName || t('featureProject.developerLogo')}
                      width={60}
                      height={60}
                      className="dev-logo-img"
                      unoptimized
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = DEFAULT_LOGO;
                      }}
                    />
                    {activeProject.developerName && (
                      <span className="developer-name">{activeProject.developerName}</span>
                    )}
                  </div>
                </div>
                <p className="project-desc line-clamp-3">
                  {activeProject.description ||
                    t('featureProject.fallbackDescription')}
                </p>

                {projectFacilities.length > 0 && (
                  <>
                    <h4 className="details-grid-title">{t('featureProject.projectDetails') as string}</h4>
                    <div className="details-cards-grid">
                      {projectFacilities.slice(0, 6).map((facility, index) => {
                        const FacilityIcon = getFacilityServiceIcon(facility.icon);

                        return (
                          <motion.div
                            key={`${facility.name}-${index}`}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                            className="detail-info-card"
                          >
                            <div className="detail-info-icon-wrapper" aria-hidden="true">
                              <FacilityIcon size={16} />
                            </div>
                            <span className="detail-info-value">{facility.name}</span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </>
                )}

                <div className="project-actions">
                  <Link href={`/${language}/projects/${activeProject.id}-${slugify(activeProject.name)}`} className="get-in-touch-btn">
                    {t('featureProject.viewProjectDetails') as string}
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Centered Pagination Dots at the Bottom of Section */}
        <div className="stationary-dots-container">
          <div className="pagination-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`dot ${activeIndex === index ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
                type="button"
                aria-label={`${t('featureProject.viewProjectDetails')} ${index + 1}`}
                aria-current={activeIndex === index}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="show-more-projects-wrapper"
        >
          <Link href={`/${language}/projects`} className="show-more-projects-link">
            {t('featureProject.showMore') as string}
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureProject;
