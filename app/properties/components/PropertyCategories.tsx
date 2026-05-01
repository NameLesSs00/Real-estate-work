"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import './PropertyCategories.css';

const propertyTypes = [
  {
    name: 'Studios',
    image: '/assists/Properties/Studios.png',
  },
  {
    name: 'Villas',
    image: '/assists/Properties/Villas.png',
  },
  {
    name: 'Standalone',
    image: '/assists/Properties/Standalone.png',
  },
];

const PropertyCategories = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="property-categories-section">
      <div className="property-categories-container">
        <div className="property-categories-header">
          <div className="stars-container">
            <Image src="/assists/Properties/star1.png" alt="star" width={32} height={32} />
            <Image src="/assists/Properties/star2.png" alt="star" width={20} height={20} />
            <Image src="/assists/Properties/star3.png" alt="star" width={12} height={12} />
          </div>
          <h2 className="property-categories-title">
            Discover a World of Possibilities
          </h2>
          <p className="property-categories-subtitle">
            Our portfolio of properties is as diverse as your dreams. Explore the following categories to find the perfect property that resonates with your vision of home
          </p>
        </div>

        <div className="property-categories-grid">
          {propertyTypes.map((category, index) => (
            <div 
              key={index} 
              className={`property-type-card ${activeIndex === index ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              <div className="property-type-label">{category.name}</div>
              <div className="property-type-image-wrapper">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="property-type-image"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyCategories;
