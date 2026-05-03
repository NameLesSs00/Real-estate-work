"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import PropertyCard from '@/components/PropertyCard';
import { getUnits, ApiUnit, resolveProjectImageUrl } from '@/lib/api/projects';
import './ExploreUnits.css';

const tabs = [
  { name: 'Hot Deal', icon: '/assists/exploreUnitsHome/mdi_hot.png', active: true },
  { name: 'Recommended for you', icon: '/assists/exploreUnitsHome/carbon_recommend.png', active: false },
  { name: 'Best Price', icon: '/assists/exploreUnitsHome/solar_tag-price-outline.png', active: false },
];

const ExploreUnits = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [units, setUnits] = useState<ApiUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUnits() {
      try {
        const res = await getUnits(1);
        // We can just show the first 6 units for the homepage
        setUnits(res.items.slice(0, 6));
      } catch (err) {
        console.error('Failed to load units:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUnits();
  }, []);

  return (
    <section className="explore-units-section">
      <div className="explore-units-container">
        <div className="explore-units-header">
          <span className="explore-units-tag">POPULAR UNITS</span>
          <h2 className="explore-units-title">Feature Units</h2>
          <p className="explore-units-subtitle">
            Carefully selected premium units in the most sought-after locations, combining
            comfort, luxury, and the perfect setting.
          </p>
          <div className="explore-units-accent-line"></div>
        </div>

        <div className="explore-tabs">
          {tabs.map((tab, index) => (
            <button 
              key={index} 
              className={`explore-tab ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              <Image 
                src={tab.icon} 
                alt={tab.name} 
                width={20} 
                height={20} 
                className="explore-tab-icon"
              />
              {tab.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-gray-500 font-medium">Loading units...</div>
        ) : units.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium">No units available.</div>
        ) : (
          <div className="units-grid">
            {units.map((unit) => (
              <PropertyCard
                key={unit.id}
                id={unit.id}
                title={unit.name || 'Untitled Unit'}
                type={String(unit.propertyType) || 'Unit'}
                location={unit.floorName || 'Unknown Location'}
                price={`EGP ${unit.price?.toLocaleString()}`}
                beds={unit.noBedRoom || 0}
                baths={unit.noBathRoom || 0}
                area={`${unit.area || 0} m²`}
                image={resolveProjectImageUrl(unit.imageUrls?.[0]) || '/assists/defalutImage.jpg'}
                status={unit.isFeatured ? 'Featured' : 'For Sale'}
                isDefaultImage={!unit.imageUrls || unit.imageUrls.length === 0}
              />
            ))}
          </div>
        )}

        <div className="show-more-wrapper">
          <button className="show-more-button">Show More Properties</button>
        </div>
      </div>
    </section>
  );
};

export default ExploreUnits;
