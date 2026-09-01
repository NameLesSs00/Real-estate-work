'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ListingCard from '@/components/ListingCard';
import { getUnitsFiltered, UnitListItem } from '@/lib/api/units';
import { resolveProjectImageUrl } from '@/lib/api/projects';
import { useLanguage } from '@/lib/contexts/LanguageContext';

const BestListings = () => {
  const { t, getLocalized, language } = useLanguage();
  const [units, setUnits] = useState<UnitListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUnits() {
      setIsLoading(true);
      try {
        const data = await getUnitsFiltered({ UnitType: 'Buy', PageNumber: 1, PageSize: 8, Language: language });
        setUnits(data.items || []);
      } catch (err) {
        console.error('Failed to load units:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUnits();
  }, [language]);

  return (
    <section className="pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-[1280px]">
        
        {/* Header */}
        <div className="text-center mb-16 flex items-baseline justify-center gap-4">
          <h2 className="text-[40px] md:text-[56px] font-serif text-brand-primary leading-tight">
            {t('bestListings.title')}
          </h2>
          <span 
            className="text-brand-secondary text-[40px] md:text-[56px] font-medium"
            style={{ fontFamily: 'var(--font-dancing-script)' }}
          >
            {t('bestListings.accent')}
          </span>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-[24px] animate-pulse h-[360px]" />
            ))}
          </div>
        ) : units.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium">{t('bestListings.noListings')}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {units.map((unit) => (
              <ListingCard
                key={unit.id}
                id={unit.id}
                title={getLocalized(unit.name) || t('propertyCard.fallback.untitled')}
                type={unit.propertyType || t('propertyCard.fallback.unit')}
                location={unit.locationName || t('propertyCard.fallback.unknownLocation')}
                price={`${unit.currencyCode || unit.currency || 'EGP'} ${unit.price?.toLocaleString()}`}
                beds={unit.noBedRoom || 0}
                baths={unit.noBathRoom || 0}
                area={`${unit.area || 0} m²`}
                image={resolveProjectImageUrl(unit.imageUrls?.[0]) || '/assists/defaultImage.png'}
                status={!unit.isActive ? 'Sold' : (unit.unitStatus || 'For Sale')}
                unitType={unit.unitType}
                featured={Math.random() > 0.5} // Simulating featured flag
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        <div className="mt-16 flex justify-center">
          <Link 
            href={`/${language}/properties`}
            className="bg-brand-secondary hover:bg-brand-secondary-hover text-white px-8 py-3 rounded-[8px] font-bold text-[14px] transition-colors"
          >
            {t('bestListings.loadMore')}
          </Link>
        </div>

      </div>
    </section>
  );
};

export default BestListings;
