'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import AddDeveloperModal from '@/components/admin/AddDeveloperModal';
import DeleteDeveloperModal from '@/components/admin/DeleteDeveloperModal';
import DeveloperDetailsModal from '@/components/admin/DeveloperDetailsModal';
import { getDevelopers, resolveImageUrl, Developer } from '@/lib/api/developers';

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDeveloper, setEditingDeveloper] = useState<Developer | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deletingName, setDeletingName] = useState('');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingId, setViewingId] = useState<number | null>(null);

  const fetchDevelopers = useCallback(async (page = 1, query = searchQuery) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getDevelopers(page, query);
      setDevelopers(data.items);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
      setCurrentPage(data.pageNumber);
    } catch (err) {
      console.error('[DevelopersPage] Fetch error:', err);
      setError('Failed to load developers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDevelopers(1, searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchDevelopers]);

  const handleAddNew = () => {
    setEditingDeveloper(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (dev: Developer) => {
    setEditingDeveloper(dev);
    setIsAddModalOpen(true);
  };

  const handleView = (dev: Developer) => {
    setViewingId(dev.id);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = (dev: Developer) => {
    setDeletingId(dev.id);
    setDeletingName(dev.name);
    setIsDeleteModalOpen(true);
  };

  const handleSuccess = () => fetchDevelopers(currentPage);

  return (
    <div className="p-10 lg:p-14 font-inter bg-[#F8F9FA] min-h-full scrollbar-hide">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-[36px] font-bold text-[#16273B] mb-1">Developers</h1>
          <p className="text-[#64748B] text-[17px]">
            {totalCount} developer{totalCount !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-[#16273B] text-white px-10 py-5 rounded-[24px] flex items-center gap-3 hover:bg-[#1e324d] transition-all shadow-xl hover:shadow-2xl active:scale-95 group cursor-pointer"
        >
          <Image
            src="/admin/projects/mingcute_add-fill.png"
            alt="Add"
            width={24}
            height={24}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
          <span className="text-[18px] font-semibold">Add Developer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-full mb-12">
        <div className="absolute left-8 top-1/2 -translate-y-1/2">
          <Image
            src="/admin/projects/search-line.png"
            alt="Search"
            width={24}
            height={24}
            className="opacity-40"
          />
        </div>
        <input
          type="text"
          placeholder="Search developers..."
          className="w-full bg-white border border-gray-100 rounded-[28px] py-6 pl-18 pr-10 text-[18px] text-[#16273B] focus:outline-none focus:ring-4 focus:ring-[#16273B]/5 focus:border-[#16273B]/10 transition-all shadow-sm placeholder:text-[#94A3B8]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-[#16273B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-red-500 font-poppins">{error}</p>
            <button
              onClick={() => fetchDevelopers(currentPage)}
              className="bg-[#16273B] text-white px-6 py-2 rounded-full text-sm cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : developers.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-[#64748B] text-[18px]">
              {searchQuery ? 'No developers match your search.' : 'No developers yet. Add one!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 text-[15px] font-bold text-[#16273B]">
                  <th className="py-7 px-10">Logo</th>
                  <th className="py-7 px-4">Name</th>
                  <th className="py-7 px-4">Description</th>
                  <th className="py-7 px-4 text-center">Projects</th>
                  <th className="py-7 px-4 text-center">Gallery</th>
                  <th className="py-7 px-10 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {developers.map((dev) => {
                  const logoUrl = resolveImageUrl(dev.logoImage);
                  return (
                    <tr
                      key={dev.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Logo */}
                      <td className="py-6 px-10">
                        <div
                          className="w-[110px] h-[60px] relative flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handleView(dev)}
                          title={!logoUrl ? "Default Logo" : undefined}
                        >
                          <Image
                            src={logoUrl || '/admin/defaultLogo.png'}
                            alt={dev.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-6 px-4">
                        <span
                          className="text-[17px] font-bold text-[#16273B] cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => handleView(dev)}
                        >
                          {dev.name}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="py-6 px-4 max-w-[260px]">
                        <p className="text-[14px] text-[#64748B] line-clamp-2 leading-relaxed break-words">
                          {dev.description || <span className="italic text-gray-300">No description</span>}
                        </p>
                      </td>

                      {/* Projects */}
                      <td className="py-6 px-4 text-center">
                        <span className="inline-flex px-5 py-2 rounded-full bg-[#EBF3FF] text-[#1447E6] text-[14px] font-bold">
                          {dev.projects.length}
                        </span>
                      </td>

                      {/* Gallery */}
                      <td className="py-6 px-4 text-center">
                        <span className="inline-flex px-5 py-2 rounded-full bg-[#F0EDE8] text-[#1B2134] text-[14px] font-bold">
                          {dev.gallery.length} imgs
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-6 px-10">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleView(dev)} 
                            className="p-2.5 bg-gray-50 hover:bg-[#16273B] text-gray-500 hover:text-white rounded-xl transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md"
                            title="View Details"
                          >
                            <div 
                              className="w-[20px] h-[20px] bg-current"
                              style={{
                                WebkitMask: "url('/admin/units/view.png') center/contain no-repeat",
                                mask: "url('/admin/units/view.png') center/contain no-repeat"
                              }}
                            />
                          </button>
                          <button 
                            onClick={() => handleEdit(dev)} 
                            className="p-2.5 bg-gray-50 hover:bg-blue-600 text-gray-500 hover:text-white rounded-xl transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md"
                            title="Edit Developer"
                          >
                            <div 
                              className="w-[20px] h-[20px] bg-current"
                              style={{
                                WebkitMask: "url('/admin/projects/edit.png') center/contain no-repeat",
                                mask: "url('/admin/projects/edit.png') center/contain no-repeat"
                              }}
                            />
                          </button>
                          <button 
                            onClick={() => handleDelete(dev)} 
                            className="p-2.5 bg-gray-50 hover:bg-red-600 text-gray-500 hover:text-white rounded-xl transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md"
                            title="Delete Developer"
                          >
                            <div 
                              className="w-[20px] h-[20px] bg-current"
                              style={{
                                WebkitMask: "url('/admin/projects/delete.png') center/contain no-repeat",
                                mask: "url('/admin/projects/delete.png') center/contain no-repeat"
                              }}
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
            <p className="text-[14px] text-[#94A3B8]">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => fetchDevelopers(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-[14px] font-medium text-[#16273B] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => fetchDevelopers(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-[14px] font-medium text-[#16273B] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddDeveloperModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleSuccess}
        editData={editingDeveloper}
      />

      <DeleteDeveloperModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={handleSuccess}
        developerId={deletingId}
        developerName={deletingName}
      />

      <DeveloperDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        developerId={viewingId}
        onUpdate={handleSuccess}
      />
    </div>
  );
}
