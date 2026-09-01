'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { DollarSign } from 'lucide-react';
import AddProjectModal from '@/components/admin/AddProjectModal';
import DeleteProjectModal from '@/components/admin/DeleteProjectModal';
import ProjectDetailsModal from '@/components/admin/ProjectDetailsModal';
import ProjectPriceListsModal from '@/components/admin/ProjectPriceListsModal';
import { getProjects, resolveProjectImageUrl, Project } from '@/lib/api/projects';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deletingName, setDeletingName] = useState('');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingId, setViewingId] = useState<number | null>(null);
  const [isPriceListsModalOpen, setIsPriceListsModalOpen] = useState(false);
  const [priceListsProject, setPriceListsProject] = useState<Project | null>(null);

  const fetchProjects = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getProjects(page);
      setProjects(data.items);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
      setCurrentPage(data.pageNumber);
    } catch (err) {
      console.error('[ProjectsPage] Fetch error:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects(1);
  }, [fetchProjects]);

  const handleAddNew = () => {
    setEditingProject(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsAddModalOpen(true);
  };

  const handleView = (project: Project) => {
    setViewingId(project.id);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = (project: Project) => {
    setDeletingId(project.id);
    setDeletingName(project.name);
    setIsDeleteModalOpen(true);
  };

  const handlePriceLists = (project: Project) => {
    setPriceListsProject(project);
    setIsPriceListsModalOpen(true);
  };

  const handleSuccess = () => fetchProjects(currentPage);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.developerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.locationName.toLowerCase().includes(searchQuery.toLowerCase())
  );



  return (
    <div className="p-10 lg:p-14 font-inter bg-admin-bg min-h-full scrollbar-hide">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-[36px] font-bold text-brand-primary mb-1">Projects</h1>
          <p className="text-admin-muted text-[17px]">
            {totalCount} project{totalCount !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-brand-primary text-white px-10 py-5 rounded-[24px] flex items-center gap-3 hover:bg-brand-primary-hover transition-all shadow-xl hover:shadow-2xl active:scale-95 group cursor-pointer"
        >
          <Image
            src="/admin/projects/mingcute_add-fill.png"
            alt="Add"
            width={24}
            height={24}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
          <span className="text-[18px] font-semibold">Add Project</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-full mb-12">
        <div className="absolute left-8 top-1/2 -translate-y-1/2">
          <Image src="/admin/projects/search-line.png" alt="Search" width={24} height={24} className="opacity-40" />
        </div>
        <input
          type="text"
          placeholder="Search projects..."
          className="w-full bg-white border border-gray-100 rounded-[28px] py-6 pl-18 pr-10 text-[18px] text-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-primary/5 transition-all shadow-sm placeholder:text-brand-muted-light"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
            <button
              onClick={() => fetchProjects(currentPage)}
              className="bg-brand-primary text-white px-6 py-2 rounded-full text-sm cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-admin-muted text-[18px]">
              {searchQuery ? 'No projects match your search.' : 'No projects yet. Add one!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full min-w-[900px] text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 text-[15px] font-bold text-brand-primary">
                  <th className="py-7 px-10">Image</th>
                  <th className="py-7 px-4">Name</th>
                  <th className="py-7 px-4">Description</th>
                  <th className="py-7 px-4">Developer</th>
                  <th className="py-7 px-4">Location</th>
                  <th className="py-7 px-10 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProjects.map((project) => {
                  const firstImage = resolveProjectImageUrl(project.imageUrls[0] ?? null);
                  return (
                    <tr key={project.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Image */}
                      <td className="py-6 px-10">
                        <div
                          className="w-[100px] h-[60px] relative rounded-xl overflow-hidden bg-gray-100 border border-gray-100 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handleView(project)}
                          title={!firstImage ? "Default Image" : undefined}
                        >
                          <Image 
                            src={firstImage || '/admin/defaultImage.jpg'} 
                            alt={project.name} 
                            fill 
                            className="object-cover" 
                          />
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-6 px-4">
                        <span
                          className="text-[17px] font-bold text-brand-primary cursor-pointer hover:text-brand-secondary transition-colors"
                          onClick={() => handleView(project)}
                        >
                          {project.name}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="py-6 px-4 max-w-[220px]">
                        <p className="text-[14px] text-admin-muted line-clamp-2 leading-relaxed break-words">
                          {project.description || <span className="italic text-gray-300">—</span>}
                        </p>
                      </td>

                      {/* Developer */}
                      <td className="py-6 px-4">
                        <span className="text-[14px] text-admin-muted">
                          {project.developerName || <span className="italic text-gray-300">—</span>}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-6 px-4">
                        <span className="text-[14px] text-admin-muted">
                          {project.locationName || <span className="italic text-gray-300">—</span>}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-6 px-10">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleView(project)} 
                            className="p-2.5 bg-gray-50 hover:bg-brand-primary text-gray-500 hover:text-white rounded-xl transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md"
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
                            onClick={() => handleEdit(project)} 
                            className="p-2.5 bg-gray-50 hover:bg-brand-secondary text-gray-500 hover:text-white rounded-xl transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md"
                            title="Edit Project"
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
                            onClick={() => handlePriceLists(project)}
                            className="p-2.5 bg-gray-50 hover:bg-emerald-600 text-gray-500 hover:text-white rounded-xl transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md"
                            title="Price Lists"
                          >
                            <DollarSign size={20} strokeWidth={2.5} />
                          </button>
                          <button 
                            onClick={() => handleDelete(project)} 
                            className="p-2.5 bg-gray-50 hover:bg-red-600 text-gray-500 hover:text-white rounded-xl transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md"
                            title="Delete Project"
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
            <p className="text-[14px] text-brand-muted-light">Page {currentPage} of {totalPages}</p>
            <div className="flex gap-3">
              <button
                onClick={() => fetchProjects(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-[14px] font-medium text-brand-primary hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => fetchProjects(currentPage + 1)}
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
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleSuccess}
        editData={editingProject}
      />

      <DeleteProjectModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={handleSuccess}
        projectId={deletingId}
        projectName={deletingName}
      />

      <ProjectDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        projectId={viewingId}
        onUpdate={handleSuccess}
      />

      <ProjectPriceListsModal
        isOpen={isPriceListsModalOpen}
        onClose={() => setIsPriceListsModalOpen(false)}
        project={priceListsProject}
      />
    </div>
  );
}
