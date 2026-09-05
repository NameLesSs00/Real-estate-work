/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { getPaymentPlanType } from '@/lib/utils';

import PropertyCard from '@/components/PropertyCard';

import { getUnitOutsides } from '@/lib/api/unitOutsides';
import { resolveProjectImageUrl } from '@/lib/api/projects';

import { ChevronLeft, ChevronRight, Filter, X, ChevronDown } from 'lucide-react';
import './properties.css';

// Maps the numeric propertyType button value to the string name the UnitOutsides API expects
const PROPERTY_TYPE_MAP: Record<string, string> = {
  '': '',
  '0': 'Apartment',
  '1': 'Villa',
  '2': 'TownHouse',
  '3': 'Studio',
  '4': 'Penthouse',
  '5': 'Chalet',
};

// Reverse map for display on cards
const PROPERTY_TYPE_LABEL: Record<string, string> = {
  '0': 'Apartment', 'Apartment': 'Apartment',
  '1': 'Villa',     'Villa': 'Villa',
  '2': 'TownHouse', 'TownHouse': 'TownHouse',
  '3': 'Studio',    'Studio': 'Studio',
  '4': 'Penthouse', 'Penthouse': 'Penthouse',
  '5': 'Chalet',    'Chalet': 'Chalet',
};

const PROPERTY_PAGE_SIZE = 6;

export interface FilterState {
  searchTerm: string;
  location: string;
  propertyType: string; // Apartment/Villa/etc
  minPrice: string;
  maxPrice: string;
  currency: string;
  locationId: string;
  country: string;
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-bg animate-pulse" />}>
      <PropertiesPageContent />
    </Suspense>
  );
}

function PropertiesPageContent() {
  const { t, getLocalized } = useLanguage();
  const searchParams = useSearchParams();
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<FilterState>({ searchTerm: '', location: '', propertyType: '', minPrice: '', maxPrice: '', currency: '', locationId: '', country: '' });
  const [draftFilters, setDraftFilters] = useState<FilterState>({ searchTerm: '', location: '', propertyType: '', minPrice: '', maxPrice: '', currency: '', locationId: '', country: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const openSidebar = () => {
    setDraftFilters(filters);
    setIsSidebarOpen(true);
  };

  const applyFilters = () => {
    handleSearch(draftFilters);
    setIsSidebarOpen(false);
  };

  const clearFilters = () => {
    const empty = { searchTerm: '', location: '', propertyType: '', minPrice: '', maxPrice: '', currency: '', locationId: '', country: '' };
    setDraftFilters(empty);
    handleSearch(empty);
    setIsSidebarOpen(false);
  };

  const fetchUnits = useCallback(async (page: number, f: FilterState) => {
    setLoading(true);
    setError('');
    try {
      // Reset pagination if needed (usually handled by calling fetchUnits(1, ...))
      
      const propertyTypeName = f.propertyType ? PROPERTY_TYPE_MAP[f.propertyType] || f.propertyType : undefined;
      const data = await getUnitOutsides({
        SearchTerm: f.searchTerm || undefined,
        MinPrice: f.minPrice ? Number(f.minPrice) : undefined,
        MaxPrice: f.maxPrice ? Number(f.maxPrice) : undefined,
        Currency: f.currency || undefined,
        City: f.location || undefined,
        Country: f.country || undefined,
        PropertyType: propertyTypeName || undefined,
        PageNumber: page,
        PageSize: PROPERTY_PAGE_SIZE, 
      });
      
      const items = Array.isArray(data) ? data : (data.items || []);
      let mappedUnits = items.map((u: any) => ({
        ...u,
        isResale: true,
        mappedId: `out-${u.id}`,
        resolvedName: typeof u.name === 'string' ? u.name : (u.name?.en || u.name?.de || u.name?.it || 'Unit'),
        locationName: `${u.city || ''}${u.city && u.country ? ', ' : ''}${u.country || ''}`,
        unitStatus: 'Resale',
        unitType: u.type,
        propertyTypeLabel: PROPERTY_TYPE_LABEL[String(u.propertyType)] || String(u.propertyType || 'Unit'),
        imageUrls: u.images?.sort((a: any, b: any) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0)).map((img: any) => img.imageUrl) || []
      }));

      // Frontend filter fallback
      if (f.currency) {
        mappedUnits = mappedUnits.filter((u: any) => 
          (u.currencyCode || u.currency || 'EGP').toUpperCase() === f.currency.toUpperCase()
        );
      }

      setUnits(mappedUnits);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || items.length);
      setCurrentPage(page);
    } catch (err) {
      setError(t('propertiesPage.grid.loadError'));
      console.error('[Properties]', err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    // Read filters from searchParams
    const initialFilters: FilterState = {
      searchTerm: searchParams.get('searchTerm') || '',
      location: searchParams.get('location') || '',
      propertyType: searchParams.get('propertyType') || '', 
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      currency: searchParams.get('currency') || '',
      locationId: searchParams.get('locationId') || '',
      country: searchParams.get('country') || '',
    };
    
    // Check if propertyType was passed via legacy parameters
    const legacyType = searchParams.get('type') || searchParams.get('unitType');
    if (legacyType && !isNaN(Number(legacyType))) {
      initialFilters.propertyType = legacyType;
    }

    setFilters(initialFilters);
    setDraftFilters(initialFilters);
    fetchUnits(1, initialFilters);
  }, [searchParams, fetchUnits]);

  const handleSearch = (newFilters: FilterState) => {
    setFilters(newFilters);
    fetchUnits(1, newFilters);
  };

  const handlePage = (page: number) => {
    fetchUnits(page, filters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="properties-page">
      <section className="properties-hero">
        <div className="properties-container">
          <div className="properties-hero-content">
            <h1 className="properties-hero-title">{t('propertiesPage.hero.title') as string}</h1>
            <p className="properties-hero-subtitle">
              {t('propertiesPage.hero.subtitle') as string}
            </p>
          </div>
        </div>
      </section>




      <section className="properties-grid-section">
        <div className="properties-container">
          <div className="properties-grid-header">
            <h2 className="properties-grid-title">{t('propertiesPage.grid.title') as string}</h2>
            <div className="flex items-center gap-4">
              <button 
                onClick={openSidebar}
                className="flex items-center gap-2 bg-brand-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-primary transition-all cursor-pointer shadow-md"
              >
                <Filter size={16} />
                {t('propertiesPage.grid.filter') as string}
              </button>
              <p className="properties-grid-subtitle">
                {loading ? t('propertiesPage.grid.loading') as string : `${t('propertiesPage.grid.showing') as string} ${totalCount} ${t('propertiesPage.grid.results') as string}`}
              </p>
            </div>
          </div>

          {error && (
            <div className="flex flex-col items-center py-16 gap-4">
              <p className="text-red-500">{error}</p>
              <button onClick={() => fetchUnits(1, filters)} className="bg-brand-primary text-white px-6 py-2 rounded-full text-sm cursor-pointer">Retry</button>
            </div>
          )}

          {loading ? (
            <div className="properties-list-grid">
              {Array(6).fill(0).map((_, i) => <div key={i} className="bg-gray-100 rounded-[20px] animate-pulse h-[380px]" />)}
            </div>
          ) : !error && units.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[18px] font-bold text-brand-primary mb-2">{t('propertiesPage.grid.noResults') as string}</p>
              <p className="text-gray-500">{t('propertiesPage.grid.adjustFilters') as string}</p>
            </div>
          ) : !error && (
            <div className="properties-list-grid">
              {units.map((unit) => (
                <PropertyCard
                  key={unit.mappedId || unit.id}
                  id={unit.mappedId || unit.id}
                  title={unit.resolvedName ?? getLocalized(unit.name)}
                  type={unit.propertyTypeLabel || PROPERTY_TYPE_LABEL[String(unit.propertyType)] || t('propertyCard.fallback.unit')}
                  location={unit.locationName || '—'}
                  price={`${unit.currencyCode || unit.currency || 'EGP'} ${unit.price?.toLocaleString()}`}
                  beds={unit.noBedRoom}
                  baths={unit.noBathRoom}
                  area={`${unit.area} m²`}
                  image={resolveProjectImageUrl(unit.imageUrls?.[0]) || '/assists/defaultImage.png'}
                  status={!unit.isActive ? 'Sold' : (unit.unitStatus || 'For Sale')}
                  unitType={unit.unitType}
                  isDefaultImage={!unit.imageUrls || unit.imageUrls.length === 0}
                  paymentPlan={getPaymentPlanType(unit.paymentPlans)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 sm:gap-4 mt-12 pb-4">
              <button 
                onClick={() => handlePage(currentPage - 1)} 
                disabled={currentPage === 1} 
                className="flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-full border border-brand-divider text-[13px] sm:text-[14px] font-medium text-brand-primary hover:bg-brand-bg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronLeft size={16} /> 
                <span className="hidden sm:inline">{t('propertiesPage.pagination.prev') as string}</span>
              </button>
              <span className="text-[13px] sm:text-[14px] text-brand-muted whitespace-nowrap">
                {t('propertiesPage.pagination.page') as string} {currentPage} {t('propertiesPage.pagination.of') as string} {totalPages}
              </span>
              <button 
                onClick={() => handlePage(currentPage + 1)} 
                disabled={currentPage === totalPages} 
                className="flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-full border border-brand-divider text-[13px] sm:text-[14px] font-medium text-brand-primary hover:bg-brand-bg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <span className="hidden sm:inline">{t('propertiesPage.pagination.next') as string}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Filters Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end font-poppins">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative w-full sm:max-w-[480px] bg-brand-bg h-full shadow-2xl flex flex-col transform transition-transform duration-500 animate-in slide-in-from-right">
            
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-gray-200 shrink-0 bg-white">
              <h2 className="text-[28px] font-radley text-brand-primary">{t('propertiesPage.sidebar.title') as string}</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2.5 bg-brand-bg rounded-full hover:bg-brand-divider transition-colors cursor-pointer text-brand-primary">
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
                    { value: '0', label: t('propertiesPage.sidebar.apartment') as string },
                    { value: '1', label: t('propertiesPage.sidebar.villa') as string },
                    { value: '2', label: t('propertiesPage.sidebar.townhouse') as string },
                    { value: '3', label: t('propertiesPage.sidebar.studio') as string },
                    { value: '4', label: t('propertiesPage.sidebar.penthouse') as string },
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
                className="flex-1 bg-brand-primary text-white py-4 rounded-full text-[15px] font-bold hover:bg-brand-secondary hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                {t('propertiesPage.sidebar.apply') as string}
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
