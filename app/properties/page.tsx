'use client';

import React, { useState, useEffect, useCallback } from 'react';
import PropertyFilters from './components/PropertyFilters';
import PropertyCategories from './components/PropertyCategories';
import PropertyCard from '@/components/PropertyCard';
import { getUnitsFiltered, UnitListItem } from '@/lib/api/units';
import { resolveProjectImageUrl } from '@/lib/api/projects';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './properties.css';

export interface FilterState {
  searchTerm: string;
  location: string;
  unitType: string;
  minPrice: string;
  maxPrice: string;
}

export default function PropertiesPage() {
  const [units, setUnits] = useState<UnitListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<FilterState>({ searchTerm: '', location: '', unitType: '', minPrice: '', maxPrice: '' });

  const fetchUnits = useCallback(async (page: number, f: FilterState) => {
    setLoading(true);
    setError('');
    try {
      const data = await getUnitsFiltered({
        SearchTerm: f.searchTerm || undefined,
        UnitType: f.unitType || undefined,
        MinPrice: f.minPrice ? Number(f.minPrice) : undefined,
        MaxPrice: f.maxPrice ? Number(f.maxPrice) : undefined,
        PageNumber: page,
        PageSize: 9,
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
    fetchUnits(1, filters);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

      <div className="properties-filters-wrapper">
        <PropertyFilters onSearch={handleSearch} />
      </div>

      <PropertyCategories onCategorySelect={(type) => handleSearch({ ...filters, unitType: type })} />

      <section className="properties-grid-section">
        <div className="properties-container">
          <div className="properties-grid-header">
            <h2 className="properties-grid-title">All Properties</h2>
            <p className="properties-grid-subtitle">
              {loading ? 'Loading...' : `Showing ${totalCount} result${totalCount !== 1 ? 's' : ''}`}
            </p>
          </div>

          {error && (
            <div className="flex flex-col items-center py-16 gap-4">
              <p className="text-red-500">{error}</p>
              <button onClick={() => fetchUnits(1, filters)} className="bg-[#1B2134] text-white px-6 py-2 rounded-full text-sm cursor-pointer">Retry</button>
            </div>
          )}

          {loading ? (
            <div className="properties-list-grid">
              {Array(9).fill(0).map((_, i) => <div key={i} className="bg-gray-100 rounded-[20px] animate-pulse h-[380px]" />)}
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
                  image={resolveProjectImageUrl(unit.imageUrls?.[0]) || '/assists/defalutImage.jpg'}
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
    </div>
  );
}
