'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getDeals, Deal } from '@/lib/api/deals';
import { getProjects, Project } from '@/lib/api/projects';
import { getUnitsFiltered, UnitListItem } from '@/lib/api/units';
import DealDetailModal from '@/components/admin/DealDetailModal';
import CreateDealModal from '@/components/admin/CreateDealModal';

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filter Data
  const [projects, setProjects] = useState<Project[]>([]);
  const [units, setUnits] = useState<UnitListItem[]>([]);

  // Filters
  const [unitIdFilter, setUnitIdFilter] = useState('');
  const [projectIdFilter, setProjectIdFilter] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals
  const [viewingDealId, setViewingDealId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchDeals = useCallback(async (page = 1, unitId?: number, projectId?: number) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getDeals({
        page,
        size: 10,
        unitId: unitId || undefined,
        projectId: projectId || undefined,
      });
      const visibleDeals = data.items.filter((deal) => deal.dealType?.toLowerCase() !== 'rent');
      setDeals(visibleDeals);
      setTotalPages(data.totalPages);
      setTotalCount(visibleDeals.length);
      setCurrentPage(data.pageNumber);
    } catch (err) {
      console.error('[DealsPage] fetch error:', err);
      setError('Failed to load deals. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch projects for filter dropdown
  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjects(1); // Fetching first page of projects
        setProjects(data.items);
      } catch (err) {
        console.error('Failed to load projects for filter', err);
      }
    }
    loadProjects();
  }, []);

  // Fetch units when project changes
  useEffect(() => {
    async function loadUnits() {
      if (!projectIdFilter) {
        setUnits([]);
        setUnitIdFilter('');
        return;
      }
      try {
        const data = await getUnitsFiltered({ ProjectId: Number(projectIdFilter), UnitType: 'Buy', PageSize: 100 });
        setUnits(data.items);
        setUnitIdFilter(''); // Reset unit filter when project changes
      } catch (err) {
        console.error('Failed to load units for filter', err);
      }
    }
    loadUnits();
  }, [projectIdFilter]);

  useEffect(() => {
    fetchDeals(1);
  }, [fetchDeals]);

  const handleSearch = () => {
    fetchDeals(1, Number(unitIdFilter) || undefined, Number(projectIdFilter) || undefined);
  };

  const handleClear = () => {
    setUnitIdFilter('');
    setProjectIdFilter('');
    fetchDeals(1);
  };

  const handleCreateSuccess = () => {
    setNotification({ type: 'success', message: 'Deal created successfully.' });
    setTimeout(() => setNotification(null), 3000);
    fetchDeals(currentPage);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const DEAL_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
    sale: { bg: 'bg-status-success-bg', text: 'text-status-success' },
    resale: { bg: 'bg-status-warning-bg', text: 'text-status-warning' },
  };
  const dealColor = (type: string) =>
    DEAL_TYPE_COLORS[type?.toLowerCase()] ?? { bg: 'bg-gray-100', text: 'text-gray-600' };

  return (
    <div className="p-10 lg:p-14 font-inter bg-admin-bg min-h-full scrollbar-hide">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
        <div>
          <h1 className="text-[36px] font-bold text-brand-primary mb-1">Deals</h1>
          <p className="text-admin-muted text-[17px]">{totalCount} deal{totalCount !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-brand-primary text-white px-10 py-5 rounded-[24px] flex items-center gap-3 hover:bg-brand-primary-hover transition-all shadow-xl hover:shadow-2xl active:scale-95 group cursor-pointer"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform duration-300">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="text-[18px] font-semibold">Create Deal</span>
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 shadow-sm border ${
          notification.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
        }`}>
          <span className="font-medium text-[15px]">{notification.message}</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <select
          value={projectIdFilter}
          onChange={(e) => setProjectIdFilter(e.target.value)}
          className="bg-white border border-gray-100 rounded-[20px] py-4 px-5 text-[15px] text-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-primary/5 shadow-sm w-full md:w-64 cursor-pointer"
        >
          <option value="">Select Project</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select
          value={unitIdFilter}
          onChange={(e) => setUnitIdFilter(e.target.value)}
          disabled={!projectIdFilter}
          className="bg-white border border-gray-100 rounded-[20px] py-4 px-5 text-[15px] text-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-primary/5 shadow-sm w-full md:w-64 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Select Unit</option>
          {units.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>

        <button
          onClick={handleSearch}
          className="bg-brand-primary text-white px-8 py-4 rounded-[20px] text-[15px] font-semibold hover:bg-brand-primary-hover transition-all shadow-sm cursor-pointer whitespace-nowrap"
        >
          Filter
        </button>
        {(unitIdFilter || projectIdFilter) && (
          <button
            onClick={handleClear}
            className="border border-gray-200 text-admin-muted px-6 py-4 rounded-[20px] text-[15px] font-medium hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-red-500">{error}</p>
            <button onClick={() => fetchDeals(currentPage)} className="bg-brand-primary text-white px-6 py-2 rounded-full text-sm cursor-pointer">Retry</button>
          </div>
        ) : deals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 bg-brand-secondary-soft rounded-2xl flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-admin-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
              </svg>
            </div>
            <p className="text-admin-muted text-[17px] font-medium">No deals found.</p>
            {(unitIdFilter || projectIdFilter) && (
              <button onClick={handleClear} className="text-brand-primary underline text-sm cursor-pointer">Clear filters</button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full min-w-[900px] text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 text-[14px] font-bold text-admin-muted">
                  <th className="py-6 px-8">ID</th>
                  <th className="py-6 px-4">Unit</th>
                  <th className="py-6 px-4">Project</th>
                  <th className="py-6 px-4 text-center">Type</th>
                  <th className="py-6 px-4">Buyer</th>
                  <th className="py-6 px-4 text-center">Commission</th>
                  <th className="py-6 px-4 text-center">Price</th>
                  <th className="py-6 px-4 text-center">Date</th>
                  <th className="py-6 px-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {deals.map((deal) => {
                  const tc = dealColor(deal.dealType);
                  return (
                    <tr
                      key={deal.id}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => setViewingDealId(deal.id)}
                    >
                      {/* ID */}
                      <td className="py-5 px-8">
                        <span className="inline-flex px-3 py-1.5 rounded-full bg-brand-secondary-soft text-brand-primary text-[12px] font-bold">
                          #{deal.id}
                        </span>
                      </td>
                      {/* Unit */}
                      <td className="py-5 px-4">
                        <span className="text-[14px] font-bold text-brand-primary">{deal.unit?.unitName || '—'}</span>
                      </td>
                      {/* Project */}
                      <td className="py-5 px-4">
                        <span className="text-[13px] text-admin-muted">{deal.unit?.projectName || '—'}</span>
                      </td>
                      {/* Type */}
                      <td className="py-5 px-4 text-center">
                        <span className={`inline-flex px-3 py-1.5 rounded-full text-[12px] font-bold ${tc.bg} ${tc.text}`}>
                          {deal.dealType || '—'}
                        </span>
                      </td>
                      {/* Buyer */}
                      <td className="py-5 px-4">
                        <p className="text-[13px] font-semibold text-brand-primary">{deal.buyer?.fullName || '—'}</p>
                        <p className="text-[12px] text-brand-muted-light">{deal.buyer?.phone || ''}</p>
                      </td>
                      {/* Commission */}
                      <td className="py-5 px-4 text-center">
                        <span className="text-[13px] font-semibold text-brand-primary">
                          {deal.unitDetails?.commissionRate !== undefined ? `${deal.unitDetails.commissionRate}%` : '—'}
                        </span>
                      </td>
                      {/* Price */}
                      <td className="py-5 px-4 text-center">
                        <span className="text-[14px] font-bold text-brand-primary">
                          {deal.unit?.price !== undefined ? `EGP ${deal.unit.price.toLocaleString()}` : '—'}
                        </span>
                      </td>
                      {/* Date */}
                      <td className="py-5 px-4 text-center">
                        <span className="text-[12px] text-brand-muted-light">{formatDate(deal.dealDate)}</span>
                      </td>
                      {/* Actions */}
                      <td className="py-5 px-8" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => setViewingDealId(deal.id)}
                            title="View Detail"
                            className="p-2.5 bg-gray-50 hover:bg-brand-primary text-gray-500 hover:text-white rounded-xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                          >
                            <div
                              className="w-[18px] h-[18px] bg-current"
                              style={{ WebkitMask: "url('/admin/units/view.png') center/contain no-repeat", mask: "url('/admin/units/view.png') center/contain no-repeat" }}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="flex items-center justify-between px-10 py-5 border-t border-gray-50">
            <p className="text-[14px] text-brand-muted-light">Page {currentPage} of {totalPages}</p>
            <div className="flex gap-3">
              <button
                onClick={() => fetchDeals(currentPage - 1, Number(unitIdFilter) || undefined, Number(projectIdFilter) || undefined)}
                disabled={currentPage === 1}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-[14px] font-medium text-brand-primary hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => fetchDeals(currentPage + 1, Number(unitIdFilter) || undefined, Number(projectIdFilter) || undefined)}
                disabled={currentPage === totalPages}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-[14px] font-medium text-brand-primary hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <DealDetailModal
        isOpen={viewingDealId !== null}
        dealId={viewingDealId}
        onClose={() => setViewingDealId(null)}
      />
      <CreateDealModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
