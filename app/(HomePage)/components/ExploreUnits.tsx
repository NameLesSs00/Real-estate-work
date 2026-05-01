"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import PropertyCard from '@/components/PropertyCard';
import './ExploreUnits.css';

const units = [
  {
    title: 'Modern Sea View Apartment',
    type: 'Apartment',
    location: 'El Gouna',
    price: 'EGP 120,000',
    beds: 3,
    baths: 2,
    area: '120 m²',
    image: '/assists/exploreUnitsHome/6407c7878c682986eb17ac857954ff029fb9c3a9.png',
  },
  {
    title: 'Luxury Villa with Pool Access',
    type: 'Villa',
    location: 'Sahl Hasheesh',
    price: '$250,000',
    beds: 4,
    baths: 3,
    area: '200 m²',
    image: '/assists/exploreUnitsHome/a2b0e2fbb0526286d50d2daa20b6d2287d3fea57.png',
  },
  {
    title: 'Modern Sea View Apartment',
    type: 'Apartment',
    location: 'El Gouna',
    price: 'EGP 120,000',
    beds: 3,
    baths: 2,
    area: '120 m²',
    image: '/assists/exploreUnitsHome/6407c7878c682986eb17ac857954ff029fb9c3a9.png',
  },
  {
    title: 'Modern Sea View Apartment',
    type: 'Apartment',
    location: 'El Gouna',
    price: 'EGP 120,000',
    beds: 3,
    baths: 2,
    area: '120 m²',
    image: '/assists/exploreUnitsHome/6407c7878c682986eb17ac857954ff029fb9c3a9.png',
  },
  {
    title: 'Modern Sea View Apartment',
    type: 'Apartment',
    location: 'El Gouna',
    price: 'EGP 120,000',
    beds: 3,
    baths: 2,
    area: '120 m²',
    image: '/assists/exploreUnitsHome/6407c7878c682986eb17ac857954ff029fb9c3a9.png',
  },
  {
    title: 'Modern Sea View Apartment',
    type: 'Apartment',
    location: 'El Gouna',
    price: 'EGP 120,000',
    beds: 3,
    baths: 2,
    area: '120 m²',
    image: '/assists/exploreUnitsHome/6407c7878c682986eb17ac857954ff029fb9c3a9.png',
  },
];

const tabs = [
  { name: 'Hot Deal', icon: '/assists/exploreUnitsHome/mdi_hot.png', active: true },
  { name: 'Recommended for you', icon: '/assists/exploreUnitsHome/carbon_recommend.png', active: false },
  { name: 'Best Price', icon: '/assists/exploreUnitsHome/solar_tag-price-outline.png', active: false },
];

const ExploreUnits = () => {
  const [activeTab, setActiveTab] = useState(0);

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

        <div className="units-grid">
          {units.map((unit, index) => (
            <PropertyCard
              key={index}
              title={unit.title}
              type={unit.type}
              location={unit.location}
              price={unit.price}
              beds={unit.beds}
              baths={unit.baths}
              area={unit.area}
              image={unit.image}
              status="For Sale"
            />
          ))}
        </div>

        <div className="show-more-wrapper">
          <button className="show-more-button">Show More Properties</button>
        </div>
      </div>
    </section>
  );
};

export default ExploreUnits;
