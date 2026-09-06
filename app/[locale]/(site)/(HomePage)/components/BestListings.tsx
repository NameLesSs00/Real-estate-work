'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import { getUnitOutsides, getUnitOutsideDisplayPrice, UnitOutside } from '@/lib/api/unitOutsides';
import { resolveProjectImageUrl } from '@/lib/api/projects';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { slugify } from '@/lib/utils';

const BestListings = () => {
  const { t, language, getLocalized } = useLanguage();
  const [units, setUnits] = useState<UnitOutside[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUnits() {
      setIsLoading(true);
      try {
        const data = await getUnitOutsides({ IsSoldOutside: false, PageNumber: 1, PageSize: 8 });
        setUnits(data.items || []);
      } catch (err) {
        console.error('Failed to load resale units:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUnits();
  }, []);

  return (
    <section id="best-listings" className="pt-32 pb-20 px-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-[24px] animate-pulse h-[360px]" />
            ))}
          </div>
        ) : units.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium">{t('bestListings.noListings')}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {units.map((unit) => {
              const displayPrice = getUnitOutsideDisplayPrice(unit);
              const unitName = getLocalized(unit.name) || 'Unit';
              const primaryImage = unit.images?.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))?.[0]?.imageUrl;
              const location = [unit.city, unit.country].filter(Boolean).join(', ');
              const slug = `out-${unit.id}-${slugify(unitName)}`;

              return (
                <PropertyCard
                  key={unit.id}
                  id={slug}
                  title={unitName}
                  type={unit.propertyType || t('propertyCard.fallback.unit')}
                  location={location || '—'}
                  price={`${displayPrice.currency} ${displayPrice.price.toLocaleString()}`}
                  beds={unit.noBedRoom}
                  baths={unit.noBathRoom}
                  area={`${unit.area} m²`}
                  image={resolveProjectImageUrl(primaryImage) || '/assists/defaultImage.png'}
                  status={!unit.isActive || unit.isSoldOutside ? 'Sold' : 'Resale'}
                  unitType={unit.type}
                />
              );
            })}
          </div>
        )}

        {/* Show All Button */}
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
