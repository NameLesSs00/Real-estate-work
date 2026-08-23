"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown, Search, MapPin } from 'lucide-react';
import { FilterState } from '../page';
import { getLocations } from '@/lib/api/locations';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import './PropertyFilters.css';

interface Props {
  onSearch: (filters: FilterState) => void;
}

const PROPERTY_TYPES = [
  { key: 'apartment', value: '0' },
  { key: 'villa', value: '1' },
  { key: 'townhouse', value: '2' },
  { key: 'studio', value: '3' },
  { key: 'penthouse', value: '4' },
  { key: 'chalet', value: '5' },
];

const CATEGORIES = [
  { value: 'Buy' },
  { value: 'Rent' },
];

const PropertyFilters = ({ onSearch }: Props) => {
  const { t } = useLanguage();
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
    onSearch({ searchTerm, location, propertyType, unitType, minPrice, maxPrice, currency: 'EGP', status: '', locationId: '', country: '' });
  };
  const selectedPropertyType = PROPERTY_TYPES.find((type) => type.value === propertyType);

  return (
    <div className="property-filters-container">
      <div className="search-bar-wrapper">
        <input 
          type="text" 
          placeholder={t('propertiesPage.sidebar.placeholderSearch')} 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="find-property-btn cursor-pointer" onClick={handleSearch}>
          <Search size={18} className="btn-search-icon" />
          {t('propertiesPage.grid.findProperty')}
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
              <option value="">{t('hero.allLocations')}</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <span className="filter-text pointer-events-none">{location || t('propertiesPage.sidebar.location')}</span>
          </div>
          <ChevronDown className="filter-chevron pointer-events-none" size={18} />
        </div>
        
        <div className="filter-dropdown relative group">
          <div className="filter-left">
            <Image src="/assists/Properties/PropertyType.png" alt={t('propertiesPage.sidebar.propertyType')} width={20} height={20} className="filter-icon" />
            <select 
              value={propertyType} 
              onChange={(e) => setPropertyType(e.target.value)} 
              className="filter-text bg-transparent outline-none appearance-none cursor-pointer absolute inset-0 w-full h-full opacity-0"
            >
              <option value="">{t('hero.allTypes')}</option>
              {PROPERTY_TYPES.map(type => <option key={type.value} value={type.value}>{t(`propertiesPage.sidebar.${type.key}`)}</option>)}
            </select>
            <span className="filter-text pointer-events-none">
              {selectedPropertyType
                ? t(`propertiesPage.sidebar.${selectedPropertyType.key}`)
                : t('propertiesPage.sidebar.propertyType')}
            </span>
          </div>
          <ChevronDown className="filter-chevron pointer-events-none" size={18} />
        </div>

        <div className="filter-dropdown relative group">
          <div className="filter-left">
            <Image src="/assists/Properties/PropertyType.png" alt={t('propertiesPage.sidebar.category')} width={20} height={20} className="filter-icon" />
            <select 
              value={unitType} 
              onChange={(e) => setUnitType(e.target.value)} 
              className="filter-text bg-transparent outline-none appearance-none cursor-pointer absolute inset-0 w-full h-full opacity-0"
            >
              <option value="">{t('propertiesPage.sidebar.allCategories')}</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.value === 'Buy' ? t('propertiesPage.sidebar.buy') : t('propertiesPage.sidebar.rent')}</option>)}
            </select>
            <span className="filter-text pointer-events-none">
              {unitType ? (unitType === 'Buy' ? t('propertiesPage.sidebar.buy') : t('propertiesPage.sidebar.rent')) : t('propertiesPage.sidebar.category')}
            </span>
          </div>
          <ChevronDown className="filter-chevron pointer-events-none" size={18} />
        </div>
        
        <div className="filter-dropdown relative">
          <div className="filter-left w-full">
            <Image src="/assists/Properties/PricingRange.png" alt={t('propertiesPage.sidebar.priceRange')} width={20} height={20} className="filter-icon flex-shrink-0" />
            <input 
              type="number" 
              placeholder={t('propertiesPage.sidebar.min')}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full bg-transparent outline-none text-[14px] text-[#000000] placeholder:text-[#949494]"
            />
          </div>
        </div>
        
        <div className="filter-dropdown relative">
          <div className="filter-left w-full">
            <Image src="/assists/Properties/PricingRange.png" alt={t('propertiesPage.sidebar.priceRange')} width={20} height={20} className="filter-icon flex-shrink-0" />
            <input 
              type="number" 
              placeholder={t('propertiesPage.sidebar.max')}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-transparent outline-none text-[14px] text-[#000000] placeholder:text-[#949494]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
