"use client";

import React from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { X, ChevronDown } from 'lucide-react';
import { FilterState } from '../page';
import { UNIT_OUTSIDE_PROPERTY_TYPES } from '@/lib/api/unitOutsides';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  draftFilters: FilterState;
  setDraftFilters: (filters: FilterState) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}

const PropertyFilters = ({
  isOpen,
  onClose,
  draftFilters,
  setDraftFilters,
  applyFilters,
  clearFilters
}: Props) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-poppins">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="relative w-full sm:max-w-[480px] bg-brand-bg h-full shadow-2xl flex flex-col transform transition-transform duration-500 animate-in slide-in-from-right">
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-200 shrink-0 bg-white">
          <h2 className="text-[28px] font-radley text-brand-primary">{t('propertiesPage.sidebar.title') as string}</h2>
          <button onClick={onClose} className="p-2.5 bg-brand-bg rounded-full hover:bg-brand-divider transition-colors cursor-pointer text-brand-primary">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          
          {/* Search Term */}
          <div className="space-y-4">
            <label className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">{t('propertiesPage.sidebar.searchKeywords') as string}</label>
            <input 
              type="text" 
              placeholder={t('propertiesPage.sidebar.placeholderSearch') as string} 
              value={draftFilters.searchTerm}
              onChange={(e) => setDraftFilters({ ...draftFilters, searchTerm: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              className="w-full bg-transparent border-b-2 border-brand-divider py-3 text-[16px] text-brand-primary placeholder:text-brand-muted-light focus:outline-none focus:border-brand-secondary transition-colors"
            />
          </div>

          {/* Country */}
          <div className="space-y-4">
            <label className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">{t('propertiesPage.sidebar.country') as string}</label>
            <input 
              type="text" 
              placeholder={t('propertiesPage.sidebar.placeholderCountry') as string} 
              value={draftFilters.country}
              onChange={(e) => setDraftFilters({ ...draftFilters, country: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              className="w-full bg-transparent border-b-2 border-brand-divider py-3 text-[16px] text-brand-primary placeholder:text-brand-muted-light focus:outline-none focus:border-brand-secondary transition-colors"
            />
          </div>

          {/* Property Type */}
          <div className="space-y-4">
            <label className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">{t('propertiesPage.sidebar.propertyType') as string}</label>
            <div className="flex flex-wrap gap-3">
              {[
                { value: '', label: t('propertiesPage.sidebar.any') as string },
                ...UNIT_OUTSIDE_PROPERTY_TYPES.map((type) => ({ value: type, label: type })),
              ].map(type => (
                <button 
                  key={type.value}
                  onClick={() => setDraftFilters({ ...draftFilters, propertyType: type.value })}
                  className={`px-5 py-2.5 rounded-full border text-[14px] font-semibold transition-all duration-300 ${draftFilters.propertyType === type.value ? 'bg-brand-secondary text-white border-brand-secondary shadow-md' : 'bg-white text-brand-primary border-brand-divider hover:border-brand-secondary hover:text-brand-secondary'}`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Listing Type (Buy/Rent) */}
          <div className="space-y-4">
            <label className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">{t('propertiesPage.sidebar.listingType') as string}</label>
            <div className="flex flex-wrap gap-3">
              {[
                { value: '', label: t('propertiesPage.sidebar.any') as string },
                { value: 'Buy', label: t('propertiesPage.sidebar.buy') as string },
                { value: 'Rent', label: t('propertiesPage.sidebar.rent') as string },
              ].map(type => (
                <button 
                  key={type.value}
                  onClick={() => setDraftFilters({ ...draftFilters, listingType: type.value })}
                  className={`px-5 py-2.5 rounded-full border text-[14px] font-semibold transition-all duration-300 ${draftFilters.listingType === type.value ? 'bg-brand-secondary text-white border-brand-secondary shadow-md' : 'bg-white text-brand-primary border-brand-divider hover:border-brand-secondary hover:text-brand-secondary'}`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bedrooms */}
          <div className="space-y-4">
            <label className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">{t('propertiesPage.sidebar.bedrooms') || 'Bedrooms'}</label>
            <div className="flex flex-wrap gap-3">
              {[
                { value: '', label: t('propertiesPage.sidebar.any') as string },
                { value: '1', label: '1+' },
                { value: '2', label: '2+' },
                { value: '3', label: '3+' },
                { value: '4', label: '4+' },
                { value: '5', label: '5+' },
              ].map(bed => (
                <button 
                  key={bed.value}
                  onClick={() => setDraftFilters({ ...draftFilters, beds: bed.value })}
                  className={`px-4 py-2 rounded-full border text-[14px] font-semibold transition-all duration-300 ${draftFilters.beds === bed.value ? 'bg-brand-secondary text-white border-brand-secondary shadow-md' : 'bg-white text-brand-primary border-brand-divider hover:border-brand-secondary hover:text-brand-secondary'}`}
                >
                  {bed.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div className="space-y-4">
            <label className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">{t('propertiesPage.sidebar.bathrooms') || 'Bathrooms'}</label>
            <div className="flex flex-wrap gap-3">
              {[
                { value: '', label: t('propertiesPage.sidebar.any') as string },
                { value: '1', label: '1+' },
                { value: '2', label: '2+' },
                { value: '3', label: '3+' },
                { value: '4', label: '4+' },
              ].map(bath => (
                <button 
                  key={bath.value}
                  onClick={() => setDraftFilters({ ...draftFilters, baths: bath.value })}
                  className={`px-4 py-2 rounded-full border text-[14px] font-semibold transition-all duration-300 ${draftFilters.baths === bath.value ? 'bg-brand-secondary text-white border-brand-secondary shadow-md' : 'bg-white text-brand-primary border-brand-divider hover:border-brand-secondary hover:text-brand-secondary'}`}
                >
                  {bath.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <label className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">{t('propertiesPage.sidebar.priceRange') as string}</label>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 text-[14px] font-semibold">{draftFilters.currency || '$'}</span>
                <input 
                  type="number" 
                  placeholder={t('propertiesPage.sidebar.min') as string} 
                  value={draftFilters.minPrice}
                  onChange={(e) => setDraftFilters({ ...draftFilters, minPrice: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-brand-divider py-3 pl-6 text-[16px] text-brand-primary placeholder:text-brand-muted-light focus:outline-none focus:border-brand-secondary transition-colors"
                />
              </div>
              <div className="w-4 h-[2px] bg-gray-300" />
              <div className="flex-1 relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 text-[14px] font-semibold">{draftFilters.currency || '$'}</span>
                <input 
                  type="number" 
                  placeholder={t('propertiesPage.sidebar.max') as string} 
                  value={draftFilters.maxPrice}
                  onChange={(e) => setDraftFilters({ ...draftFilters, maxPrice: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-brand-divider py-3 pl-6 text-[16px] text-brand-primary placeholder:text-brand-muted-light focus:outline-none focus:border-brand-secondary transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Currency */}
          <div className="space-y-4">
            <label className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">{t('propertiesPage.sidebar.currency') as string}</label>
            <div className="relative">
              <select 
                value={draftFilters.currency}
                onChange={(e) => setDraftFilters({ ...draftFilters, currency: e.target.value })}
                className="w-full bg-transparent border-b-2 border-brand-divider py-3 text-[16px] text-brand-primary focus:outline-none focus:border-brand-secondary transition-colors appearance-none cursor-pointer"
              >
                <option value="" className="text-gray-500">{t('propertiesPage.sidebar.any') as string}</option>
                <option value="EGP" className="text-brand-primary">EGP</option>
                <option value="USD" className="text-brand-primary">USD</option>
                <option value="EUR" className="text-brand-primary">EUR</option>
                <option value="GBP" className="text-brand-primary">GBP</option>
              </select>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>
          
        </div>

        {/* Footer Buttons */}
        <div className="p-8 bg-white border-t border-gray-200 flex items-center gap-6 shrink-0">
          <button 
            onClick={clearFilters}
            className="py-4 px-6 text-[15px] font-bold text-gray-500 hover:text-brand-primary transition-colors cursor-pointer whitespace-nowrap"
          >
            {t('propertiesPage.sidebar.resetAll') as string}
          </button>
          <button 
            onClick={applyFilters}
            disabled={Number(draftFilters.minPrice) > 0 && Number(draftFilters.maxPrice) > 0 && Number(draftFilters.minPrice) > Number(draftFilters.maxPrice)}
            className="flex-1 bg-brand-primary text-white py-4 rounded-full text-[15px] font-bold hover:bg-brand-secondary hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('propertiesPage.sidebar.apply') as string}
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default PropertyFilters;
