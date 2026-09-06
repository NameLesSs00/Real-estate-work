/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { getPaymentPlanType } from '@/lib/utils';

import PropertyCard from '@/components/PropertyCard';
import PropertyFilters from './components/PropertyFilters';


import {
  getUnitOutsideDisplayPrice,
  getUnitOutsides,
  normalizeUnitOutsidePropertyType,
} from '@/lib/api/unitOutsides';
import { resolveProjectImageUrl } from '@/lib/api/projects';

import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import './properties.css';

const PROPERTY_PAGE_SIZE = 50;

export interface FilterState {
  searchTerm: string;
  location: string;
  propertyType: string; // Apartment/Villa/etc
  minPrice: string;
  maxPrice: string;
  currency: string;
  locationId: string;
  country: string;
  listingType?: string;
  beds?: string;
  baths?: string;
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
  const [filters, setFilters] = useState<FilterState>({ searchTerm: '', location: '', propertyType: '', minPrice: '', maxPrice: '', currency: '', locationId: '', country: '', listingType: '', beds: '', baths: '' });
  const [draftFilters, setDraftFilters] = useState<FilterState>({ searchTerm: '', location: '', propertyType: '', minPrice: '', maxPrice: '', currency: '', locationId: '', country: '', listingType: '', beds: '', baths: '' });
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
    const empty = { searchTerm: '', location: '', propertyType: '', minPrice: '', maxPrice: '', currency: '', locationId: '', country: '', listingType: '', beds: '', baths: '' };
    setDraftFilters(empty);
    handleSearch(empty);
    setIsSidebarOpen(false);
  };

  const fetchUnits = useCallback(async (page: number, f: FilterState) => {
    setLoading(true);
    setError('');
    try {
      const propertyTypeName = normalizeUnitOutsidePropertyType(f.propertyType);
      const data = await getUnitOutsides({
        SearchTerm: f.searchTerm || undefined,
        Search: f.searchTerm || undefined,
        MinPrice: f.minPrice ? Number(f.minPrice) : undefined,
        MaxPrice: f.maxPrice ? Number(f.maxPrice) : undefined,
        Currency: f.currency || undefined,
        City: f.location || undefined,
        Country: f.country || undefined,
        PropertyType: propertyTypeName || undefined,
        IsSoldOutside: false,
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
        propertyTypeLabel: normalizeUnitOutsidePropertyType(u.propertyType) || String(u.propertyType || 'Unit'),
        imageUrls: u.images?.sort((a: any, b: any) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0)).map((img: any) => img.imageUrl) || []
      }));

      if (f.listingType) {
        mappedUnits = mappedUnits.filter((u: any) => u.unitType?.toLowerCase() === f.listingType?.toLowerCase());
      }
      if (f.beds) {
        mappedUnits = mappedUnits.filter((u: any) => (u.noBedRoom || 0) >= parseInt(f.beds as string, 10));
      }
      if (f.baths) {
        mappedUnits = mappedUnits.filter((u: any) => (u.noBathRoom || 0) >= parseInt(f.baths as string, 10));
      }

      setUnits(mappedUnits);
      setTotalPages(data.totalPages || 1);
      setTotalCount(f.listingType || f.beds || f.baths ? mappedUnits.length : (data.totalCount || items.length));
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
      listingType: searchParams.get('listingType') || '',
      beds: searchParams.get('beds') || '',
      baths: searchParams.get('baths') || '',
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
              {units.map((unit) => {
                const displayPrice = getUnitOutsideDisplayPrice(unit, filters.currency || undefined);

                return (
                  <PropertyCard
                    key={unit.mappedId || unit.id}
                    id={unit.mappedId || unit.id}
                    title={unit.resolvedName ?? getLocalized(unit.name)}
                    type={unit.propertyTypeLabel || t('propertyCard.fallback.unit')}
                    location={unit.locationName || '—'}
                    price={`${displayPrice.currency} ${displayPrice.price.toLocaleString()}`}
                    beds={unit.noBedRoom}
                    baths={unit.noBathRoom}
                    area={`${unit.area} m²`}
                    image={resolveProjectImageUrl(unit.imageUrls?.[0]) || '/assists/defaultImage.png'}
                    status={!unit.isActive || unit.isSoldOutside ? 'Sold' : (unit.unitStatus || 'For Sale')}
                    unitType={unit.unitType}
                    isDefaultImage={!unit.imageUrls || unit.imageUrls.length === 0}
                    paymentPlan={getPaymentPlanType(unit.paymentPlans)}
                  />
                );
              })}
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

      <PropertyFilters 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        draftFilters={draftFilters} 
        setDraftFilters={setDraftFilters} 
        applyFilters={applyFilters} 
        clearFilters={clearFilters} 
      />
    </div>
  );
}
