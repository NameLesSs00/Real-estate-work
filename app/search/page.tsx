'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import { getUnitsFiltered, UnitListItem } from '@/lib/api/units';
import { getLocations } from '@/lib/api/locations';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { resolveProjectImageUrl } from '@/lib/api/projects';

const PROPERTY_TYPES = ['Apartment', 'Villa', 'Studio', 'Penthouse', 'Chalet', 'Town House', 'Twin House'];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialType = searchParams.get('type') || '';
  const initialLocation = searchParams.get('location') || '';
  const initialSearch = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [unitType, setUnitType] = useState(initialType);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [location, setLocation] = useState(initialLocation);
  const [locations, setLocations] = useState<string[]>([]);
  const [units, setUnits] = useState<UnitListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Load available locations
  useEffect(() => {
    getLocations(1)
      .then(data => {
        const items = data.items ?? [];
        const cities = [...new Set(items.map((l: { city: string }) => l.city).filter(Boolean))];
        setLocations(cities);
      })
      .catch(() => {});
  }, []);

  const doSearch = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const data = await getUnitsFiltered({
        SearchTerm: searchTerm || undefined,
        UnitType: unitType || undefined,
        MinPrice: minPrice ? Number(minPrice) : undefined,
        MaxPrice: maxPrice ? Number(maxPrice) : undefined,
        PageNumber: page,
        PageSize: 12,
      });
      setUnits(data.items);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount);
      setCurrentPage(page);
    } catch (err) {
      console.error('[Search]', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, unitType, minPrice, maxPrice]);

  useEffect(() => {
    doSearch(1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (unitType) params.set('type', unitType);
    if (location) params.set('location', location);
    router.push(`/search?${params.toString()}`);
    doSearch(1);
  };

  const typeLabelMap: Record<string, string> = {
    primary: 'Primary',
    resale: 'Resale',
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-28 pb-16 font-poppins">
      <div className="max-w-[1280px] mx-auto px-6">

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-[32px] md:text-[42px] font-bold text-[#1B2134] font-radley leading-tight">
            {typeLabelMap[initialType] || 'Search'} Properties
          </h1>
          {!loading && (
            <p className="text-[#666] mt-2">{totalCount} propert{totalCount === 1 ? 'y' : 'ies'} found</p>
          )}
        </div>

        {/* Search & Filters */}
        <form onSubmit={handleSearch} className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 mb-10">
          {/* Search row */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by name, project, or location..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 text-[15px] text-[#1B2134] outline-none focus:ring-2 focus:ring-[#1B2134]/10 placeholder:text-gray-400"
              />
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen(o => !o)}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-xl border text-[14px] font-semibold transition-all cursor-pointer ${filtersOpen ? 'bg-[#1B2134] text-white border-[#1B2134]' : 'border-gray-200 text-[#1B2134] hover:bg-gray-50'}`}
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#1B2134] text-white rounded-xl font-semibold text-[14px] hover:bg-[#2a3347] transition-all cursor-pointer"
            >
              Search
            </button>
          </div>

          {/* Expanded filters */}
          {filtersOpen && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
              <select
                value={unitType}
                onChange={e => setUnitType(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-[#1B2134] outline-none focus:ring-2 focus:ring-[#1B2134]/10 bg-white cursor-pointer"
              >
                <option value="">All Types</option>
                {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-[#1B2134] outline-none focus:ring-2 focus:ring-[#1B2134]/10 bg-white cursor-pointer"
              >
                <option value="">All Locations</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>

              <input
                type="number"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                placeholder="Min Price (EGP)"
                className="px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-[#1B2134] outline-none focus:ring-2 focus:ring-[#1B2134]/10"
              />

              <input
                type="number"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                placeholder="Max Price (EGP)"
                className="px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-[#1B2134] outline-none focus:ring-2 focus:ring-[#1B2134]/10"
              />
            </div>
          )}
        </form>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-[20px] animate-pulse h-[380px]" />
            ))}
          </div>
        ) : units.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[20px] font-bold text-[#1B2134] mb-2">No properties found</p>
            <p className="text-[#666]">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {units.map(unit => (
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
                  status={unit.isActive ? 'Available' : 'Sold'}
                  isDefaultImage={!unit.imageUrls || unit.imageUrls.length === 0}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  onClick={() => doSearch(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 text-[14px] font-medium text-[#1B2134] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <span className="text-[14px] text-[#666]">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => doSearch(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 text-[14px] font-medium text-[#1B2134] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#1B2134] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
