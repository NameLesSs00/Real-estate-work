'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import AddUnitOutsideModal from '@/components/admin/AddUnitOutsideModal';
import DeleteUnitOutsideModal from '@/components/admin/DeleteUnitOutsideModal';
import UnitOutsideDetailsModal from '@/components/admin/UnitOutsideDetailsModal';
import MarkUnitOutsideSoldModal from '@/components/admin/MarkUnitOutsideSoldModal';
import { getUnitOutsides, UnitOutside } from '@/lib/api/unitOutsides';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function UnitsPage() {
  const { getLocalized } = useLanguage();
  // ── Resale Units state ──
  const [outsideUnits, setOutsideUnits] = useState<UnitOutside[]>([]);
  const [outsideLoading, setOutsideLoading] = useState(false);
  const [outsideError, setOutsideError] = useState('');
  const [outsideSearch, setOutsideSearch] = useState('');
  const [outsidePage, setOutsidePage] = useState(1);
  const [outsideTotalPages, setOutsideTotalPages] = useState(1);
  const [outsideTotalCount, setOutsideTotalCount] = useState(0);
  const [outsideNotification, setOutsideNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  // Resale modals
  const [isAddOutsideOpen, setIsAddOutsideOpen] = useState(false);
  const [editingOutside, setEditingOutside] = useState<UnitOutside | null>(null);
  const [deletingOutside, setDeletingOutside] = useState<UnitOutside | null>(null);
  const [viewingOutsideId, setViewingOutsideId] = useState<number | null>(null);
  const [markSoldOutside, setMarkSoldOutside] = useState<UnitOutside | null>(null);

  const fetchOutsideUnits = useCallback(async (page = 1) => {
    setOutsideLoading(true); setOutsideError('');
    try {
      const data = await getUnitOutsides({ PageNumber: page, PageSize: 10 });
      setOutsideUnits(data.items); setOutsideTotalPages(data.totalPages);
      setOutsideTotalCount(data.totalCount); setOutsidePage(data.pageNumber);
    } catch (err) {
      console.error('[UnitsPage] Outside fetch error:', err);
      setOutsideError('Failed to load resale units. Please try again.');
    } finally { setOutsideLoading(false); }
  }, []);

  useEffect(() => { fetchOutsideUnits(1); }, [fetchOutsideUnits]);

  return (
    <div className="p-10 lg:p-14 font-inter bg-admin-bg min-h-full scrollbar-hide">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
        <div>
          <h1 className="text-[36px] font-bold text-brand-primary mb-1">Units</h1>
          <p className="text-admin-muted text-[17px]">
            {`${outsideTotalCount} resale unit${outsideTotalCount !== 1 ? 's' : ''} total`}
          </p>
        </div>
        <button
          onClick={() => { setEditingOutside(null); setIsAddOutsideOpen(true); }}
          className="bg-brand-primary text-white px-10 py-5 rounded-[24px] flex items-center gap-3 hover:bg-brand-primary-hover transition-all shadow-xl hover:shadow-2xl active:scale-95 group cursor-pointer"
        >
          <Image src="/admin/projects/mingcute_add-fill.png" alt="Add" width={24} height={24} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-[18px] font-semibold">Add Resale Unit</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white border border-gray-100 p-1.5 rounded-2xl w-fit mb-8 shadow-sm">
        <div className="px-6 py-2.5 rounded-xl text-[14px] font-bold transition-all bg-brand-primary text-white shadow-md">
          Resale Units
        </div>
      </div>

      {/* ── RESALE TAB ── */}
      <>
          {outsideNotification && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 shadow-sm border ${
              outsideNotification.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
            }`}>
              <span className="font-medium text-[15px]">{outsideNotification.message}</span>
            </div>
          )}
          {/* Search */}
          <div className="relative max-w-full mb-8">
            <div className="absolute left-8 top-1/2 -translate-y-1/2">
              <Image src="/admin/projects/search-line.png" alt="Search" width={24} height={24} className="opacity-40" />
            </div>
            <input
              type="text"
              placeholder="Search resale units..."
              className="w-full bg-white border border-gray-100 rounded-[28px] py-5 pl-18 pr-10 text-[17px] text-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-primary/5 transition-all shadow-sm placeholder:text-brand-muted-light"
              value={outsideSearch}
              onChange={(e) => setOutsideSearch(e.target.value)}
            />
          </div>
          {/* Table */}
          <div className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden">
            {outsideLoading ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : outsideError ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <p className="text-red-500">{outsideError}</p>
                <button onClick={() => fetchOutsideUnits(outsidePage)} className="bg-brand-primary text-white px-6 py-2 rounded-full text-sm cursor-pointer">Retry</button>
              </div>
            ) : outsideUnits.filter(u => u.name.toLowerCase().includes(outsideSearch.toLowerCase())).length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-admin-muted text-[17px]">
                  {outsideSearch ? 'No units match your search.' : 'No resale units yet. Click "Add Resale Unit" to create one!'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full min-w-[1100px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-50 text-[15px] font-bold text-brand-primary">
                      <th className="py-7 px-6 w-[20%] max-w-[250px]">Name</th>
                      <th className="py-7 px-4">Marker ID</th>
                      <th className="py-7 px-4">Price</th>
                      <th className="py-7 px-4">Location</th>
                      <th className="py-7 px-4 text-center">Beds</th>
                      <th className="py-7 px-4 text-center">Baths</th>
                      <th className="py-7 px-4 text-center">Area</th>
                      <th className="py-7 px-4 text-center">Plans</th>
                      <th className="py-7 px-4 text-center">Featured</th>
                      <th className="py-7 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {outsideUnits
                      .filter(u => u.name.toLowerCase().includes(outsideSearch.toLowerCase()))
                      .map((unit) => (
                        <tr key={unit.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-6 px-6 max-w-[250px]">
                            <span
                              className="text-[16px] font-bold text-brand-primary cursor-pointer hover:text-brand-secondary transition-colors"
                              onClick={() => setViewingOutsideId(unit.id)}
                            >{getLocalized(unit.name)}</span>
                            {unit.description && <p className="text-[13px] text-brand-muted-light mt-0.5 line-clamp-1">{getLocalized(unit.description)}</p>}
                          </td>
                          <td className="py-6 px-4">
                            <span className="text-[14px] text-admin-muted font-medium">{unit.markerId || '—'}</span>
                          </td>
                          <td className="py-6 px-4">
                            <span className="text-[15px] font-bold text-brand-primary">{unit.currencyCode} {unit.price.toLocaleString()}</span>
                          </td>
                          <td className="py-6 px-4">
                            <span className="text-[14px] text-admin-muted">{unit.city}, {unit.country}</span>
                          </td>
                          <td className="py-6 px-4 text-center">
                            <span className="inline-flex px-4 py-1.5 rounded-full bg-brand-primary-soft text-brand-primary text-[13px] font-bold">{unit.noBedRoom}</span>
                          </td>
                          <td className="py-6 px-4 text-center">
                            <span className="inline-flex px-4 py-1.5 rounded-full bg-brand-secondary-soft text-brand-secondary text-[13px] font-bold">{unit.noBathRoom}</span>
                          </td>
                          <td className="py-6 px-4 text-center">
                            <span className="text-[14px] text-admin-muted">{unit.area} m²</span>
                          </td>
                          <td className="py-6 px-4 text-center">
                            <span className={`inline-flex px-3 py-1 rounded-full text-[13px] font-bold ${unit.paymentPlans?.length ? 'bg-status-success-bg text-status-success' : 'bg-gray-100 text-gray-400'}`}>
                              {unit.paymentPlans?.length || 0} Plans
                            </span>
                          </td>
                          <td className="py-6 px-4 text-center">
                            {unit.isFeatured
                              ? <span className="inline-flex px-4 py-1.5 rounded-full bg-status-warning-bg text-status-warning text-[13px] font-bold">Yes</span>
                              : <span className="text-gray-300 text-[13px]">—</span>}
                          </td>
                          <td className="py-6 px-4">
                            <div className="flex items-center justify-end gap-2">
                              {unit.isActive && (
                                <button
                                  onClick={() => setMarkSoldOutside(unit)}
                                  className="bg-status-warning-bg text-status-warning hover:bg-status-warning-border px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer mr-1 whitespace-nowrap shadow-sm hover:shadow-md"
                                >Mark Sold</button>
                              )}
                              <div className="flex items-center gap-1.5">
                                <button onClick={() => setViewingOutsideId(unit.id)} className="p-2.5 bg-gray-50 hover:bg-brand-primary text-gray-500 hover:text-white rounded-xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md" title="View">
                                  <div className="w-[20px] h-[20px] bg-current" style={{ WebkitMask: "url('/admin/units/view.png') center/contain no-repeat", mask: "url('/admin/units/view.png') center/contain no-repeat" }} />
                                </button>
                                <button onClick={() => { setEditingOutside(unit); setIsAddOutsideOpen(true); }} className="p-2.5 bg-gray-50 hover:bg-brand-secondary text-gray-500 hover:text-white rounded-xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md" title="Edit">
                                  <div className="w-[20px] h-[20px] bg-current" style={{ WebkitMask: "url('/admin/projects/edit.png') center/contain no-repeat", mask: "url('/admin/projects/edit.png') center/contain no-repeat" }} />
                                </button>
                                <button onClick={() => setDeletingOutside(unit)} className="p-2.5 bg-gray-50 hover:bg-red-600 text-gray-500 hover:text-white rounded-xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md" title="Delete">
                                  <div className="w-[20px] h-[20px] bg-current" style={{ WebkitMask: "url('/admin/projects/delete.png') center/contain no-repeat", mask: "url('/admin/projects/delete.png') center/contain no-repeat" }} />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* Pagination */}
            {!outsideLoading && !outsideError && outsideTotalPages > 1 && (
              <div className="flex items-center justify-between px-10 py-5 border-t border-gray-50">
                <p className="text-[14px] text-brand-muted-light">Page {outsidePage} of {outsideTotalPages}</p>
                <div className="flex gap-3">
                  <button onClick={() => fetchOutsideUnits(outsidePage - 1)} disabled={outsidePage === 1} className="px-5 py-2.5 rounded-xl border border-gray-200 text-[14px] font-medium text-brand-primary hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">Previous</button>
                  <button onClick={() => fetchOutsideUnits(outsidePage + 1)} disabled={outsidePage === outsideTotalPages} className="px-5 py-2.5 rounded-xl border border-gray-200 text-[14px] font-medium text-brand-primary hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">Next</button>
                </div>
              </div>
            )}
          </div>
        </>
      {/* ── OUTSIDE MODALS ── */}
      <AddUnitOutsideModal
        isOpen={isAddOutsideOpen}
        onClose={() => { setIsAddOutsideOpen(false); setEditingOutside(null); }}
        onSuccess={() => { fetchOutsideUnits(outsidePage); setOutsideNotification({ type: 'success', message: isAddOutsideOpen && !editingOutside ? 'Resale unit created!' : 'Resale unit updated!' }); setTimeout(() => setOutsideNotification(null), 3000); }}
        editData={editingOutside}
      />
      <DeleteUnitOutsideModal
        isOpen={deletingOutside !== null}
        onClose={() => setDeletingOutside(null)}
        onSuccess={() => { fetchOutsideUnits(outsidePage); setDeletingOutside(null); setOutsideNotification({ type: 'success', message: 'Resale unit deleted.' }); setTimeout(() => setOutsideNotification(null), 3000); }}
        unitId={deletingOutside?.id ?? null}
        unitName={deletingOutside?.name}
      />
      <UnitOutsideDetailsModal
        isOpen={viewingOutsideId !== null}
        onClose={() => setViewingOutsideId(null)}
        unitId={viewingOutsideId}
        onUpdate={() => fetchOutsideUnits(outsidePage)}
        onMarkSold={(unit) => { setViewingOutsideId(null); setMarkSoldOutside(unit); }}
      />
      <MarkUnitOutsideSoldModal
        isOpen={markSoldOutside !== null}
        unit={markSoldOutside}
        onClose={() => setMarkSoldOutside(null)}
        onSuccess={() => { fetchOutsideUnits(outsidePage); setMarkSoldOutside(null); setOutsideNotification({ type: 'success', message: 'Resale unit marked as sold.' }); setTimeout(() => setOutsideNotification(null), 3000); }}
      />
    </div>
  );
}
