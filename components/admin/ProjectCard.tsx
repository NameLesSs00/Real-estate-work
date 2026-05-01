'use client';

import React from 'react';
import Image from 'next/image';
import { Project } from '@/types/admin';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
  onView: (project: Project) => void;
}

export default function ProjectCard({ project, onEdit, onDelete, onView }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-[32px] p-4 shadow-[0px_4px_20px_rgba(0,0,0,0,05)] flex flex-col gap-4 border border-gray-50 group hover:shadow-lg transition-all duration-300">
      {/* Image Container */}
      <div 
        className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden cursor-pointer"
        onClick={() => onView(project)}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 px-2">
        <h3 
          className="text-[20px] font-bold text-[#16273B] line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => onView(project)}
        >
          {project.title}
        </h3>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="relative w-5 h-5 flex items-center justify-center">
              <Image 
                src="/admin/projects/buildings-2.png" 
                alt="Developer" 
                width={20} 
                height={20}
                className="opacity-60"
              />
            </div>
            <span className="text-[#64748B] text-[15px]">{project.developer}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-5 h-5 flex items-center justify-center">
              <Image 
                src="/admin/projects/location.png" 
                alt="Location" 
                width={20} 
                height={20}
                className="opacity-60"
              />
            </div>
            <span className="text-[#64748B] text-[15px]">{project.location}</span>
          </div>
        </div>

        <div className="text-[17px] font-semibold text-[#16273B] mt-1">
          {project.unitCount} Units
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-2">
          <button 
            onClick={() => onEdit(project)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-[#E2E8F0] hover:bg-gray-50 transition-colors group/btn cursor-pointer"
          >
            <Image 
              src="/admin/projects/edit.png" 
              alt="Edit" 
              width={18} 
              height={18}
              className="opacity-70 group-hover/btn:opacity-100"
            />
            <span className="text-[16px] font-medium text-[#475569]">Edit</span>
          </button>
          <button 
            onClick={() => onDelete(project.id)}
            className="w-[52px] h-[52px] flex items-center justify-center rounded-2xl border border-[#FEE2E2] hover:bg-[#FEF2F2] transition-colors group/del cursor-pointer"
          >
            <Image 
              src="/admin/projects/delete.png" 
              alt="Delete" 
              width={20} 
              height={20}
              className="opacity-70 group-hover/del:opacity-100"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
