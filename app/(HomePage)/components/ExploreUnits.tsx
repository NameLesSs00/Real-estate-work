'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import { getUnitsFiltered, UnitListItem } from '@/lib/api/units';
import { resolveProjectImageUrl } from '@/lib/api/projects';
import './ExploreUnits.css';

import { useLanguage } from '@/lib/contexts/LanguageContext';
import './ExploreUnits.css';

const tabs = [
  { key: 'hotDeal', icon: '/assists/exploreUnitsHome/mdi_hot.png', sortBy: 'featured' },
  { key: 'recommended', icon: '/assists/exploreUnitsHome/carbon_recommend.png', sortBy: 'recommended' },
  { key: 'bestPrice', icon: '/assists/exploreUnitsHome/solar_tag-price-outline.png', sortBy: 'price' },
];

const ExploreUnits = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);
  const [units, setUnits] = useState<UnitListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUnits() {
      setIsLoading(true);
      try {
        // Different pages/filters for each tab
        const pageMap: Record<number, number> = { 0: 1, 1: 2, 2: 1 };
        const data = await getUnitsFiltered({ PageNumber: pageMap[activeTab], PageSize: 6 });
        let items = data.items;
        // For Best Price tab, sort ascending by price client-side
        if (activeTab === 2) items = [...items].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
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
          <span className="explore-units-tag">{t('exploreUnits.tag')}</span>
          <h2 className="explore-units-title">{t('exploreUnits.title')}</h2>
          <p className="explore-units-subtitle">{t('exploreUnits.subtitle')}</p>
          <div className="explore-units-accent-line"></div>
        </div>

        <div className="explore-tabs">
          {tabs.map((tab, index) => (
            <button key={index} className={`explore-tab ${activeTab === index ? 'active' : ''}`} onClick={() => setActiveTab(index)}>
              <Image src={tab.icon} alt={t(`exploreUnits.tabs.${tab.key}`)} width={20} height={20} className="explore-tab-icon" />
              {t(`exploreUnits.tabs.${tab.key}`)}
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
          <div className="text-center py-20 text-gray-500 font-medium">{t('exploreUnits.noUnits')}</div>
        ) : (
          <div className="units-grid">
            {units.map((unit) => (
              <PropertyCard
                key={unit.id}
                id={unit.id}
                title={unit.name || 'Untitled Unit'}
                type={unit.propertyType || unit.unitType || 'Unit'}
                location={unit.locationName || 'Unknown Location'}
                price={`EGP ${unit.price?.toLocaleString()}`}
                beds={unit.noBedRoom || 0}
                baths={unit.noBathRoom || 0}
                area={`${unit.area || 0} m²`}
                image={resolveProjectImageUrl(unit.imageUrls?.[0]) || '/assists/defalutImage.jpg'}
                status={unit.unitStatus || 'For Sale'}
                isDefaultImage={!unit.imageUrls || unit.imageUrls.length === 0}
              />
            ))}
          </div>
        )}

        <div className="show-more-wrapper">
          <Link href="/properties" className="show-more-button">{t('exploreUnits.showMore')}</Link>
        </div>
      </div>
    </section>
  );
};

export default ExploreUnits;
