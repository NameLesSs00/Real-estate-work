'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import AddSpotModal from '@/components/admin/AddSpotModal';
import DeleteSpotModal from '@/components/admin/DeleteSpotModal';
import { getLocations, Location } from '@/lib/api/locations';

export default function SpotsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchLocations = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getLocations(page);
      setLocations(data.items);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
      setCurrentPage(data.pageNumber);
    } catch (err) {
      console.error('[SpotsPage] Fetch error:', err);
      setError('Failed to load locations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations(1);
  }, [fetchLocations]);

  const handleAddNew = () => {
    setEditingLocation(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleSuccess = () => {
    fetchLocations(currentPage);
  };

  // Client-side search filter
  const filteredLocations = locations.filter((loc) => {
    const q = searchQuery.toLowerCase();
    return (
      loc.city.toLowerCase().includes(q) ||
      loc.district.toLowerCase().includes(q) ||
      (loc.country || '').toLowerCase().includes(q) ||
      (loc.street || '').toLowerCase().includes(q)
    );
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-brand-bg p-8 md:p-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-brand-primary font-poppins mb-1">Locations</h1>
          <p className="text-[15px] text-brand-muted font-poppins">
            {totalCount} location{totalCount !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-brand-primary text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-brand-primary transition-colors font-poppins font-medium cursor-pointer"
        >
          <Image src="/admin/spots/add.png" alt="Add" width={20} height={20} className="object-contain" />
          Add New Location
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-full md:max-w-2xl">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-muted-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by city, district or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-brand-divider rounded-[20px] py-4 pl-12 pr-4 text-admin-muted placeholder:text-brand-muted-light focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-poppins shadow-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[20px] shadow-sm border border-brand-divider overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-red-500 font-poppins">{error}</p>
            <button
              onClick={() => fetchLocations(currentPage)}
              className="bg-brand-primary text-white px-6 py-2 rounded-full font-poppins text-sm cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : filteredLocations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-2">
            <p className="text-brand-muted font-poppins text-lg">No locations found.</p>
            {searchQuery && (
              <p className="text-brand-muted-light font-poppins text-sm">Try adjusting your search.</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-poppins">
              <thead>
                <tr className="bg-admin-bg border-b border-brand-divider">
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-admin-muted uppercase tracking-wider">#</th>
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-admin-muted uppercase tracking-wider">City</th>
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-admin-muted uppercase tracking-wider">District</th>
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-admin-muted uppercase tracking-wider">Street</th>
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-admin-muted uppercase tracking-wider">Country</th>
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-admin-muted uppercase tracking-wider">Created</th>
                  <th className="text-center px-6 py-4 text-[13px] font-semibold text-admin-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-divider">
                {filteredLocations.map((loc, idx) => (
                  <tr key={loc.id} className="hover:bg-brand-bg transition-colors group">
                    <td className="px-6 py-4 text-[14px] text-brand-muted-light font-medium">
                      {(currentPage - 1) * 10 + idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[15px] font-semibold text-brand-primary">{loc.city}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[13px] font-medium bg-brand-divider text-brand-primary">
                        {loc.district}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-admin-muted">
                      {loc.street || <span className="text-brand-divider italic">—</span>}
                    </td>
                    <td className="px-6 py-4 text-[14px] text-admin-muted">
                      {loc.country || <span className="text-brand-divider italic">—</span>}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-brand-muted-light">
                      {formatDate(loc.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit */}
                        <button
                          onClick={() => handleEdit(loc)}
                          title="Edit"
                          className="w-9 h-9 flex items-center justify-center rounded-lg border border-brand-divider hover:bg-admin-bg transition-colors cursor-pointer"
                        >
                          <Image src="/admin/spots/edit.png" alt="Edit" width={16} height={16} />
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(loc.id)}
                          title="Delete"
                          className="w-9 h-9 flex items-center justify-center rounded-lg border border-status-danger-border hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Image src="/admin/spots/delete.png" alt="Delete" width={16} height={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-brand-divider">
            <p className="text-[13px] text-brand-muted-light font-poppins">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchLocations(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-brand-divider text-[14px] font-medium text-brand-primary hover:bg-admin-bg disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer font-poppins"
              >
                Previous
              </button>
              <button
                onClick={() => fetchLocations(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-brand-divider text-[14px] font-medium text-brand-primary hover:bg-admin-bg disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer font-poppins"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddSpotModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleSuccess}
        editData={editingLocation}
      />

      <DeleteSpotModal
        isOpen={isDeleteModalOpen}
        locationId={deletingId}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
