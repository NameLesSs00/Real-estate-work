'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import PropertyCategories from './components/PropertyCategories';
import PropertyCard from '@/components/PropertyCard';
import { getUnitsFiltered, UnitListItem } from '@/lib/api/units';
import { resolveProjectImageUrl } from '@/lib/api/projects';
import { ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import './properties.css';

export interface FilterState {
  searchTerm: string;
  location: string;
  propertyType: string; // Apartment/Villa/etc
  minPrice: string;
  maxPrice: string;
  currency: string;
  unitType: string;   // Buy/Rent (mapped to UnitType API param)
  status: string;     // primary/resale
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F5F0] animate-pulse" />}>
      <PropertiesPageContent />
    </Suspense>
  );
}

function PropertiesPageContent() {
  const searchParams = useSearchParams();
  const [units, setUnits] = useState<UnitListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<FilterState>({ searchTerm: '', location: '', propertyType: '', minPrice: '', maxPrice: '', currency: 'EGP', unitType: '', status: '' });
  const [draftFilters, setDraftFilters] = useState<FilterState>({ searchTerm: '', location: '', propertyType: '', minPrice: '', maxPrice: '', currency: 'EGP', unitType: '', status: '' });
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
    const empty = { searchTerm: '', location: '', propertyType: '', minPrice: '', maxPrice: '', currency: 'EGP', unitType: '', status: '' };
    setDraftFilters(empty);
    handleSearch(empty);
    setIsSidebarOpen(false);
  };

  const fetchUnits = useCallback(async (page: number, f: FilterState) => {
    setLoading(true);
    setError('');
    try {
      const data = await getUnitsFiltered({
        SearchTerm: f.searchTerm || undefined,
        UnitType: f.unitType || undefined,
        MinPrice: f.minPrice ? Number(f.minPrice) : undefined,
        MaxPrice: f.maxPrice ? Number(f.maxPrice) : undefined,
        Currency: f.currency || undefined,

        PropertyType: f.propertyType || undefined,
        Status: f.status || undefined,
        PageNumber: page,
        PageSize: 6,
      });
      setUnits(data.items);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to load properties. Please try again.');
      console.error('[Properties]', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Read filters from searchParams
    const initialFilters: FilterState = {
      searchTerm: searchParams.get('searchTerm') || '',
      location: searchParams.get('location') || '',
      propertyType: searchParams.get('propertyType') || searchParams.get('unitType') || '', 
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      currency: searchParams.get('currency') || 'EGP',
      unitType: searchParams.get('unitType') || searchParams.get('type') || '', 
      status: searchParams.get('status') || '',
    };
    
    // Special case: if unitType is 'Rent' or 'Buy', it's the UnitType filter.
    // If it's a number, it's propertyType.
    if (initialFilters.unitType === 'Rent' || initialFilters.unitType === 'Buy') {
      // correctly assigned
    } else if (initialFilters.unitType && !isNaN(Number(initialFilters.unitType))) {
      initialFilters.propertyType = initialFilters.unitType;
      initialFilters.unitType = '';
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
            <h1 className="properties-hero-title">Find Your Dream Property</h1>
            <p className="properties-hero-subtitle">
              Explore our curated selection of properties, each offering a unique story and a chance to redefine your life.
            </p>
          </div>
        </div>
      </section>



      <PropertyCategories 
        selectedType={filters.propertyType}
        onCategorySelect={(type) => handleSearch({ ...filters, propertyType: type })} 
      />

      <section className="properties-grid-section">
        <div className="properties-container">
          <div className="properties-grid-header">
            <h2 className="properties-grid-title">All Properties</h2>
            <div className="flex items-center gap-4">
              <button 
                onClick={openSidebar}
                className="flex items-center gap-2 bg-[#1B2134] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all cursor-pointer shadow-md"
              >
                <Filter size={16} />
                Show Filters
              </button>
              <p className="properties-grid-subtitle">
                {loading ? 'Loading...' : `Showing ${totalCount} result${totalCount !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          {error && (
            <div className="flex flex-col items-center py-16 gap-4">
              <p className="text-red-500">{error}</p>
              <button onClick={() => fetchUnits(1, filters)} className="bg-[#1B2134] text-white px-6 py-2 rounded-full text-sm cursor-pointer">Retry</button>
            </div>
          )}

          {loading ? (
            <div className="properties-list-grid">
              {Array(6).fill(0).map((_, i) => <div key={i} className="bg-gray-100 rounded-[20px] animate-pulse h-[380px]" />)}
            </div>
          ) : !error && units.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[18px] font-bold text-[#1B2134] mb-2">No properties found</p>
              <p className="text-gray-500">Try adjusting your search filters.</p>
            </div>
          ) : !error && (
            <div className="properties-list-grid">
              {units.map((unit) => (
                <PropertyCard
                  key={unit.id}
                  id={unit.id}
                  title={unit.name}
                  type={unit.propertyType || unit.unitType || 'Unit'}
                  location={unit.locationName || '—'}
                  price={`EGP ${unit.price?.toLocaleString()}`}
                  beds={unit.noBedRoom}
                  baths={unit.noBathRoom}
                  area={`${unit.area} m²`}
                  image={resolveProjectImageUrl(unit.imageUrls?.[0]) || '/assists/defaultImage.png'}
                  status={unit.isActive ? 'For Sale' : 'Sold'}
                  isDefaultImage={!unit.imageUrls || unit.imageUrls.length === 0}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12 pb-4">
              <button onClick={() => handlePage(currentPage - 1)} disabled={currentPage === 1} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-[14px] font-medium text-[#1B2134] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors">
                <ChevronLeft size={16} /> Prev
              </button>
              <span className="text-[14px] text-[#666]">Page {currentPage} of {totalPages}</span>
              <button onClick={() => handlePage(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-[14px] font-medium text-[#1B2134] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors">
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Filters Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-start font-poppins">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 animate-in slide-in-from-left">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <h2 className="text-[22px] font-bold text-[#1B2134]">Filters</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-500 hover:text-[#1B2134]">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Search Term */}
              <div className="space-y-3">
                <label className="text-[15px] font-semibold text-[#1B2134]">Search Keywords</label>
                <input 
                  type="text" 
                  placeholder="e.g. Skyline..." 
                  value={draftFilters.searchTerm}
                  onChange={(e) => setDraftFilters({ ...draftFilters, searchTerm: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1B2134]/20 text-[14px]"
                />
              </div>

              {/* Property Type */}
              <div className="space-y-3">
                <label className="text-[15px] font-semibold text-[#1B2134]">Property Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: '', label: 'Any' },
                    { value: '0', label: 'Apartment' },
                    { value: '1', label: 'Villa' },
                    { value: '2', label: 'TownHouse' },
                    { value: '3', label: 'Studio' },
                    { value: '4', label: 'Penthouse' },
                  ].map(type => (
                    <button 
                      key={type.value}
                      onClick={() => setDraftFilters({ ...draftFilters, propertyType: type.value })}
                      className={`py-3 px-3 rounded-xl border text-[13px] font-bold transition-all ${draftFilters.propertyType === type.value ? 'bg-[#1B2134] text-white border-[#1B2134] shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="space-y-3">
                <label className="text-[15px] font-semibold text-[#1B2134]">Category</label>
                <div className="flex items-center gap-3">
                  {[
                    { value: '', label: 'Any' },
                    { value: 'Buy', label: 'Buy' },
                    { value: 'Rent', label: 'Rent' },
                  ].map(cat => (
                    <button 
                      key={cat.value}
                      onClick={() => setDraftFilters({ ...draftFilters, unitType: cat.value })}
                      className={`flex-1 py-3 px-3 rounded-xl border text-[13px] font-bold transition-all ${draftFilters.unitType === cat.value ? 'bg-[#1B2134] text-white border-[#1B2134] shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <label className="text-[15px] font-semibold text-[#1B2134]">Price Range (EGP)</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={draftFilters.minPrice}
                      onChange={(e) => setDraftFilters({ ...draftFilters, minPrice: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1B2134]/20 text-[14px]"
                    />
                  </div>
                  <span className="text-gray-400 font-medium">-</span>
                  <div className="flex-1">
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={draftFilters.maxPrice}
                      onChange={(e) => setDraftFilters({ ...draftFilters, maxPrice: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1B2134]/20 text-[14px]"
                    />
                  </div>
                </div>
              </div>

              {/* Currency */}
              <div className="space-y-3">
                <label className="text-[15px] font-semibold text-[#1B2134]">Currency</label>
                <div className="flex items-center gap-3">
                  {['EGP', 'USD', 'EUR'].map(curr => (
                    <button 
                      key={curr}
                      onClick={() => setDraftFilters({ ...draftFilters, currency: curr })}
                      className={`flex-1 py-3 px-3 rounded-xl border text-[13px] font-bold transition-all ${draftFilters.currency === curr ? 'bg-[#1B2134] text-white border-[#1B2134] shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-4 shrink-0">
              <button onClick={clearFilters} className="flex-1 py-4 border border-gray-200 bg-white rounded-2xl font-bold text-[#1B2134] hover:border-gray-300 transition-colors cursor-pointer shadow-sm">
                Clear All
              </button>
              <button onClick={applyFilters} className="flex-[2] py-4 bg-[#1B2134] text-white rounded-2xl font-bold hover:bg-[#252d47] transition-colors cursor-pointer shadow-lg shadow-[#1B2134]/20">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
