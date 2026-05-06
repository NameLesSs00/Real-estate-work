"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown, Search, MapPin } from 'lucide-react';
import { FilterState } from '../page';
import { getLocations } from '@/lib/api/locations';
import './PropertyFilters.css';

interface Props {
  onSearch: (filters: FilterState) => void;
}

const PROPERTY_TYPES = [
  { name: 'Apartment', value: '0' },
  { name: 'Villa', value: '1' },
  { name: 'TownHouse', value: '2' },
  { name: 'Studio', value: '3' },
  { name: 'Penthouse', value: '4' },
  { name: 'Chalet', value: '5' },
];

const CATEGORIES = [
  { name: 'Buy', value: 'Buy' },
  { name: 'Rent', value: 'Rent' },
];

const PropertyFilters = ({ onSearch }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [unitType, setUnitType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    getLocations(1).then(data => {
      const cities = [...new Set((data.items ?? []).map((l: { city: string }) => l.city).filter(Boolean))];
      setLocations(cities);
    }).catch(() => {});
  }, []);

  const handleSearch = () => {
    onSearch({ searchTerm, location, propertyType, unitType, minPrice, maxPrice, currency: 'EGP', status: '', locationId: '' });
  };

  return (
    <div className="property-filters-container">
      <div className="search-bar-wrapper">
        <input 
          type="text" 
          placeholder="Search For A Property" 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="find-property-btn cursor-pointer" onClick={handleSearch}>
          <Search size={18} className="btn-search-icon" />
          Find Property
        </button>
      </div>
      
      <div className="filters-grid">
        <div className="filter-dropdown relative group">
          <div className="filter-left">
            <MapPin size={20} className="filter-icon" />
            <select 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              className="filter-text bg-transparent outline-none appearance-none cursor-pointer absolute inset-0 w-full h-full opacity-0"
            >
              <option value="">All Locations</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <span className="filter-text pointer-events-none">{location || 'Location'}</span>
          </div>
          <ChevronDown className="filter-chevron pointer-events-none" size={18} />
        </div>
        
        <div className="filter-dropdown relative group">
          <div className="filter-left">
            <Image src="/assists/Properties/PropertyType.png" alt="Property Type" width={20} height={20} className="filter-icon" />
            <select 
              value={propertyType} 
              onChange={(e) => setPropertyType(e.target.value)} 
              className="filter-text bg-transparent outline-none appearance-none cursor-pointer absolute inset-0 w-full h-full opacity-0"
            >
              <option value="">All Types</option>
              {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.name}</option>)}
            </select>
            <span className="filter-text pointer-events-none">
              {PROPERTY_TYPES.find(t => t.value === propertyType)?.name || 'Property Type'}
            </span>
          </div>
          <ChevronDown className="filter-chevron pointer-events-none" size={18} />
        </div>

        <div className="filter-dropdown relative group">
          <div className="filter-left">
            <Image src="/assists/Properties/PropertyType.png" alt="Category" width={20} height={20} className="filter-icon" />
            <select 
              value={unitType} 
              onChange={(e) => setUnitType(e.target.value)} 
              className="filter-text bg-transparent outline-none appearance-none cursor-pointer absolute inset-0 w-full h-full opacity-0"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.name}</option>)}
            </select>
            <span className="filter-text pointer-events-none">{unitType || 'Category'}</span>
          </div>
          <ChevronDown className="filter-chevron pointer-events-none" size={18} />
        </div>
        
        <div className="filter-dropdown relative">
          <div className="filter-left w-full">
            <Image src="/assists/Properties/PricingRange.png" alt="Pricing Range" width={20} height={20} className="filter-icon flex-shrink-0" />
            <input 
              type="number" 
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full bg-transparent outline-none text-[14px] text-[#1b2134] placeholder:text-[#949494]"
            />
          </div>
        </div>
        
        <div className="filter-dropdown relative">
          <div className="filter-left w-full">
            <Image src="/assists/Properties/PricingRange.png" alt="Pricing Range" width={20} height={20} className="filter-icon flex-shrink-0" />
            <input 
              type="number" 
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-transparent outline-none text-[14px] text-[#1b2134] placeholder:text-[#949494]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
