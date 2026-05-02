'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import AddSpotModal from '@/components/admin/AddSpotModal';
import DeleteSpotModal from '@/components/admin/DeleteSpotModal';

interface Spot {
  id: number;
  title: string;
  location: string;
  description: string;
  image: string;
}

const mockSpots: Spot[] = [
  {
    id: 1,
    title: 'Makadi Height',
    location: 'Makadi, NY',
    description: 'Iconic urban park in the heart of Manhattan',
    image: '/admin/spots/img.png',
  },
  {
    id: 2,
    title: 'Makadi Height',
    location: 'Makadi, NY',
    description: 'Iconic urban park in the heart of Manhattan',
    image: '/admin/spots/img.png',
  },
  {
    id: 3,
    title: 'Makadi Height',
    location: 'Makadi, NY',
    description: 'Iconic urban park in the heart of Manhattan',
    image: '/admin/spots/img.png',
  },
  {
    id: 4,
    title: 'Makadi Height',
    location: 'Makadi, NY',
    description: 'Iconic urban park in the heart of Manhattan',
    image: '/admin/spots/img.png',
  },
];

export default function SpotsPage() {
  const [spots, setSpots] = useState<Spot[]>(mockSpots);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState<Spot | null>(null);

  const handleAddNew = () => {
    setEditingSpot(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (spot: Spot) => {
    setEditingSpot(spot);
    setIsAddModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setIsDeleteModalOpen(false);
  };

  // Filtering spots based on search query
  const filteredSpots = spots.filter(spot =>
    spot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spot.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-8 md:p-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#1B2134] font-poppins mb-1">Featured Spots</h1>
          <p className="text-[15px] text-[#666] font-poppins">Manage featured locations and landmarks</p>
        </div>
        
        <button 
          onClick={handleAddNew}
          className="bg-[#1B2134] text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-[#252d46] transition-colors font-poppins font-medium cursor-pointer"
        >
          <Image src="/admin/spots/add.png" alt="Add" width={20} height={20} className="object-contain" />
          Add New Spot
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-10">
        <div className="relative max-w-full md:max-w-2xl">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search project"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E2E8F0] rounded-[20px] py-4 pl-12 pr-4 text-[#4A5568] placeholder-[#A0AEC0] focus:outline-none focus:border-[#1B2134] focus:ring-1 focus:ring-[#1B2134] transition-all font-poppins shadow-sm"
          />
        </div>
      </div>

      {/* Spots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSpots.map((spot) => (
          <div key={spot.id} className="bg-white rounded-[20px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#F0EDE8] flex flex-col">
            
            {/* Image */}
            <div className="relative w-full aspect-[4/3]">
              <Image 
                src={spot.image} 
                alt={spot.title} 
                fill 
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-[18px] font-bold text-[#1B2134] font-poppins mb-2">{spot.title}</h3>
              
              <div className="flex items-center gap-1.5 mb-3">
                <Image src="/admin/spots/locatoin.png" alt="Location" width={14} height={14} className="object-contain" />
                <span className="text-[13px] text-[#A0AEC0] font-poppins">{spot.location}</span>
              </div>
              
              <p className="text-[14px] text-[#718096] font-poppins leading-relaxed mb-6 flex-1">
                {spot.description}
              </p>
              
              {/* Actions */}
              <div className="flex items-center gap-3 mt-auto">
                <button 
                  onClick={() => handleEdit(spot)}
                  className="flex-1 border border-[#E2E8F0] rounded-[10px] py-2.5 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Image src="/admin/spots/edit.png" alt="Edit" width={16} height={16} />
                  <span className="text-[14px] font-medium text-[#1B2134] font-poppins">Edit</span>
                </button>
                <button 
                  onClick={handleDelete}
                  className="border border-[#FEB2B2] rounded-[10px] p-2.5 flex items-center justify-center hover:bg-red-50 transition-colors aspect-square cursor-pointer"
                >
                  <Image src="/admin/spots/delete.png" alt="Delete" width={18} height={18} />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Modals */}
      <AddSpotModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        editData={editingSpot}
      />

      <DeleteSpotModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
