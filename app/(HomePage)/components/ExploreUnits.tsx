'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import { getUnitsFiltered, UnitListItem } from '@/lib/api/units';
import { resolveProjectImageUrl } from '@/lib/api/projects';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import './ExploreUnits.css';

const tabs = [
  { key: 'hotDeal', icon: '/assists/exploreUnitsHome/mdi_hot.png', sortBy: 'featured' },
  { key: 'recommended', icon: '/assists/exploreUnitsHome/carbon_recommend.png', sortBy: 'recommended' },
  { key: 'bestPrice', icon: '/assists/exploreUnitsHome/solar_tag-price-outline.png', sortBy: 'price' },
];

const ExploreUnits = () => {
  const { t, getLocalized } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);
  const [units, setUnits] = useState<UnitListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUnits() {
      setIsLoading(true);
      try {
        // Fetch a larger set to allow meaningful client-side sorting if API doesn't support it
        // Or if the API is simple, we take the first page and sort it.
        // For 'Hot Deal', we'll just take the first page as is (latest).
        const data = await getUnitsFiltered({ PageNumber: 1, PageSize: 50 });
        let items = data.items;

        if (activeTab === 1) {
          // Recommended: Most expensive first
          items = [...items].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        } else if (activeTab === 2) {
          // Best Price: Cheapest first
          items = [...items].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        }
        
        setUnits(items.slice(0, 6));
      } catch (err) {
        console.error('Failed to load units:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUnits();
  }, [activeTab]);

  return (
    <section className="explore-units-section">
      <div className="explore-units-container">
        <div className="explore-units-header">
          <span className="explore-units-tag">{t('exploreUnits.tag') as string}</span>
          <h2 className="explore-units-title">{t('exploreUnits.title') as string}</h2>
          <p className="explore-units-subtitle">{t('exploreUnits.subtitle') as string}</p>
          <div className="explore-units-accent-line"></div>
        </div>

        <div className="explore-tabs">
          {tabs.map((tab, index) => (
            <button key={index} className={`explore-tab ${activeTab === index ? 'active' : ''}`} onClick={() => setActiveTab(index)}>
              <Image src={tab.icon} alt={t(`exploreUnits.tabs.${tab.key}`) as string} width={20} height={20} className="explore-tab-icon" />
              {t(`exploreUnits.tabs.${tab.key}`) as string}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="units-grid">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-[20px] animate-pulse h-[380px]" />
            ))}
          </div>
        ) : units.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium">{t('exploreUnits.noUnits') as string}</div>
        ) : (
          <div className="units-grid">
            {units.map((unit) => (
              <PropertyCard
                key={unit.id}
                id={unit.id}
                title={getLocalized(unit.name) || 'Untitled Unit'}
                type={unit.propertyType || unit.unitType || 'Unit'}
                location={unit.locationName || 'Unknown Location'}
                price={`${unit.currencyCode || unit.currency || 'EGP'} ${unit.price?.toLocaleString()}`}
                beds={unit.noBedRoom || 0}
                baths={unit.noBathRoom || 0}
                area={`${unit.area || 0} m²`}
                image={resolveProjectImageUrl(unit.imageUrls?.[0]) || '/assists/defaultImage.png'}
                status={!unit.isActive ? 'Sold' : (unit.unitStatus || 'For Sale')}
                unitType={unit.unitType}
                isDefaultImage={!unit.imageUrls || unit.imageUrls.length === 0}
              />
            ))}
          </div>
        )}

        <div className="show-more-wrapper">
          <Link href="/properties" className="show-more-button">{t('exploreUnits.showMore') as string}</Link>
        </div>
      </div>
    </section>
  );
};

export default ExploreUnits;
