'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ProjectCard from '@/components/admin/ProjectCard';
import AddProjectModal from '@/components/admin/AddProjectModal';
import DeleteProjectModal from '@/components/admin/DeleteProjectModal';
import ProjectDetailsModal from '@/components/admin/ProjectDetailsModal';
import { Project } from '@/types/admin';

const mockProjects: Project[] = [
  {
    id: 1,
    title: 'Sky Tower Residences',
    developer: 'Elite Developers',
    location: 'Manhattan, NY',
    unitCount: 45,
    image: '/admin/projects/3062699a2d7a3ad99d9b2fd1be7db0f3ab8c6b9b.png'
  },
  {
    id: 2,
    title: 'Sky Tower Residences',
    developer: 'Elite Developers',
    location: 'Manhattan, NY',
    unitCount: 45,
    image: '/admin/projects/3062699a2d7a3ad99d9b2fd1be7db0f3ab8c6b9b.png'
  },
  {
    id: 3,
    title: 'Sky Tower Residences',
    developer: 'Elite Developers',
    location: 'Manhattan, NY',
    unitCount: 45,
    image: '/admin/projects/3062699a2d7a3ad99d9b2fd1be7db0f3ab8c6b9b.png'
  },
  {
    id: 4,
    title: 'Sky Tower Residences',
    developer: 'Elite Developers',
    location: 'Manhattan, NY',
    unitCount: 45,
    image: '/admin/projects/3062699a2d7a3ad99d9b2fd1be7db0f3ab8c6b9b.png'
  },
  {
    id: 5,
    title: 'Sky Tower Residences',
    developer: 'Elite Developers',
    location: 'Manhattan, NY',
    unitCount: 45,
    image: '/admin/projects/3062699a2d7a3ad99d9b2fd1be7db0f3ab8c6b9b.png'
  },
  {
    id: 6,
    title: 'Sky Tower Residences',
    developer: 'Elite Developers',
    location: 'Manhattan, NY',
    unitCount: 45,
    image: '/admin/projects/3062699a2d7a3ad99d9b2fd1be7db0f3ab8c6b9b.png'
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleView = (project: Project) => {
    setViewingProject(project);
    setIsDetailsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setProjectToDelete(project);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      setProjects(projects.filter(p => p.id !== projectToDelete.id));
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 font-inter bg-[#F8F9FA] min-h-full scrollbar-hide">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 px-2">
        <div>
          <h1 className="text-[36px] font-bold text-[#16273B] mb-1">Projects Management</h1>
          <p className="text-[#64748B] text-[17px]">Manage development projects</p>
        </div>
        
        <button 
          onClick={handleAddNew}
          className="bg-[#16273B] text-white px-10 py-5 rounded-[24px] flex items-center gap-3 hover:bg-[#1a304a] transition-all shadow-xl hover:shadow-2xl active:scale-95 group cursor-pointer"
        >
          <Image 
            src="/admin/projects/mingcute_add-fill.png" 
            alt="Add" 
            width={24} 
            height={24}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
          <span className="text-[18px] font-semibold">Add New Project</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-full mb-12 px-2">
        <div className="absolute left-10 top-1/2 -translate-y-1/2">
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
          placeholder="Search project"
          className="w-full bg-white border border-gray-100 rounded-[28px] py-6 pl-18 pr-10 text-[18px] text-[#16273B] focus:outline-none focus:ring-8 focus:ring-[#16273B]/5 focus:border-[#16273B]/10 transition-all shadow-sm placeholder:text-[#94A3B8]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {filteredProjects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-[#64748B] text-[18px]">No projects found matching your search.</p>
        </div>
      )}

      {/* Modals */}
      <AddProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editData={editingProject}
      />

      <DeleteProjectModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        projectTitle={projectToDelete?.title}
        onConfirm={confirmDelete}
      />

      <ProjectDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        project={viewingProject}
      />
    </div>
  );
}
