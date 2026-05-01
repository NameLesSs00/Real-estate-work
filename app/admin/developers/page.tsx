'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import AddDeveloperModal from '@/components/admin/AddDeveloperModal';
import DeleteDeveloperModal from '@/components/admin/DeleteDeveloperModal';
import DeveloperDetailsModal from '@/components/admin/DeveloperDetailsModal';
import { Developer } from '@/types/admin';

const mockDevelopers: Developer[] = [
  {
    id: 1,
    logo: '/admin/developer/sublogo.png',
    name: 'Elite Developers',
    contactEmail: 'contact@elitedev.com',
    contactPhone: '+1 234 567 8900',
    projectCount: 12
  },
  {
    id: 2,
    logo: '/admin/developer/sublogo.png',
    name: 'Elite Developers',
    contactEmail: 'contact@elitedev.com',
    contactPhone: '+1 234 567 8900',
    projectCount: 12
  },
  {
    id: 3,
    logo: '/admin/developer/sublogo.png',
    name: 'Elite Developers',
    contactEmail: 'contact@elitedev.com',
    contactPhone: '+1 234 567 8900',
    projectCount: 12
  },
];

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState<Developer[]>(mockDevelopers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeveloper, setEditingDeveloper] = useState<Developer | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [developerToDelete, setDeveloperToDelete] = useState<Developer | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingDeveloper, setViewingDeveloper] = useState<Developer | null>(null);

  const handleEdit = (developer: Developer) => {
    setEditingDeveloper(developer);
    setIsModalOpen(true);
  };

  const handleView = (developer: Developer) => {
    setViewingDeveloper(developer);
    setIsDetailsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingDeveloper(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const dev = developers.find(d => d.id === id);
    if (dev) {
      setDeveloperToDelete(dev);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = () => {
    if (developerToDelete) {
      setDevelopers(developers.filter(d => d.id !== developerToDelete.id));
      setIsDeleteModalOpen(false);
      setDeveloperToDelete(null);
    }
  };

  const filteredDevelopers = developers.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-10 lg:p-14 font-inter bg-[#F8F9FA] min-h-full scrollbar-hide">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-[36px] font-bold text-[#16273B] mb-1">Developers</h1>
          <p className="text-[#64748B] text-[17px]">Manage property developers</p>
        </div>
        
        <button 
          onClick={handleAddNew}
          className="bg-[#16273B] text-white px-10 py-5 rounded-[24px] flex items-center gap-3 hover:bg-[#1e324d] transition-all shadow-xl hover:shadow-2xl active:scale-95 group cursor-pointer"
        >          <Image 
            src="/admin/projects/mingcute_add-fill.png" 
            alt="Add" 
            width={24} 
            height={24}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
          <span className="text-[18px] font-semibold">Add developer</span>
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
          placeholder="Search For developer"
          className="w-full bg-white border border-gray-100 rounded-[28px] py-6 pl-18 pr-10 text-[18px] text-[#16273B] focus:outline-none focus:ring-8 focus:ring-[#16273B]/5 focus:border-[#16273B]/10 transition-all shadow-sm placeholder:text-[#94A3B8]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Developers Table */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 text-[16px] font-bold text-[#16273B]">
                <th className="py-8 px-10">Logo</th>
                <th className="py-8 px-4">Name</th>
                <th className="py-8 px-4">Contact</th>
                <th className="py-8 px-4 text-center">Projects</th>
                <th className="py-8 px-10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDevelopers.map((dev) => (
                <tr key={dev.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-8 px-10">
                    <div 
                      className="w-[100px] h-[52px] relative rounded-xl overflow-hidden bg-black flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleView(dev)}
                    >
                      <Image 
                        src={dev.logo} 
                        alt={dev.name} 
                        width={80} 
                        height={40} 
                        className="object-contain"
                      />
                    </div>
                  </td>
                  <td className="py-8 px-4">
                    <span 
                      className="text-[18px] font-bold text-[#16273B] cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleView(dev)}
                    >
                      {dev.name}
                    </span>
                  </td>
                  <td className="py-8 px-4">
                    <div className="flex flex-col">
                      <span className="text-[15px] text-[#64748B]">{dev.contactEmail}</span>
                      <span className="text-[15px] text-[#64748B]">{dev.contactPhone}</span>
                    </div>
                  </td>
                  <td className="py-8 px-4 text-center">
                    <span className="inline-flex px-6 py-3 rounded-full bg-[#EBF3FF] text-[#1447E6] text-[15px] font-bold">
                      {dev.projectCount} Projects
                    </span>
                  </td>
                  <td className="py-8 px-10">
                    <div className="flex items-center justify-end gap-6">
                      <button 
                        onClick={() => handleEdit(dev)}
                        className="hover:scale-125 transition-transform duration-200 cursor-pointer"
                      >
                        <Image src="/admin/projects/edit.png" alt="Edit" width={16} height={16} className="opacity-70 hover:opacity-100" />
                      </button>
                      <button 
                        onClick={() => handleDelete(dev.id)}
                        className="hover:scale-125 transition-transform duration-200 cursor-pointer"
                      >
                        <Image src="/admin/projects/delete.png" alt="Delete" width={16} height={16} className="opacity-70 hover:opacity-100" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredDevelopers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-[#64748B] text-[18px]">No developers found matching your search.</p>
        </div>
      )}

      {/* Modals */}
      <AddDeveloperModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editData={editingDeveloper}
      />

      <DeleteDeveloperModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        developerName={developerToDelete?.name}
        onConfirm={confirmDelete}
      />

      <DeveloperDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        developer={viewingDeveloper}
      />
    </div>
  );
}
