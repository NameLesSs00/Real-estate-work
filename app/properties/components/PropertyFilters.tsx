"use client";

import React from 'react';
import Image from 'next/image';
import { ChevronDown, Search, MapPin } from 'lucide-react';
import './PropertyFilters.css';

const PropertyFilters = () => {
  return (
    <div className="property-filters-container">
      <div className="search-bar-wrapper">
        <input 
          type="text" 
          placeholder="Search For A Property" 
          className="search-input"
        />
        <button className="find-property-btn">
          <Search size={18} className="btn-search-icon" />
          Find Property
        </button>
      </div>
      
      <div className="filters-grid">
        <div className="filter-dropdown">
          <div className="filter-left">
            <MapPin size={20} className="filter-icon" />
            <span className="filter-text">Location</span>
          </div>
          <ChevronDown className="filter-chevron" size={18} />
        </div>
        
        <div className="filter-dropdown">
          <div className="filter-left">
            <Image src="/assists/Properties/PropertyType.png" alt="Property Type" width={20} height={20} className="filter-icon" />
            <span className="filter-text">Property Type</span>
          </div>
          <ChevronDown className="filter-chevron" size={18} />
        </div>
        
        <div className="filter-dropdown">
          <div className="filter-left">
            <Image src="/assists/Properties/PricingRange.png" alt="Pricing Range" width={20} height={20} className="filter-icon" />
            <span className="filter-text">Pricing Range</span>
          </div>
          <ChevronDown className="filter-chevron" size={18} />
        </div>
        
        <div className="filter-dropdown">
          <div className="filter-left">
            <Image src="/assists/Properties/PropertySize.png" alt="Property Size" width={20} height={20} className="filter-icon" />
            <span className="filter-text">Property Size</span>
          </div>
          <ChevronDown className="filter-chevron" size={18} />
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
