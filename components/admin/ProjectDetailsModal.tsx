'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { getProjectById, uploadProjectImages, deleteProjectImage, resolveProjectImageUrl, Project } from '@/lib/api/projects';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number | null;
  onUpdate?: () => void;
}

export default function ProjectDetailsModal({ isOpen, onClose, projectId, onUpdate }: ProjectDetailsModalProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDeletingImg, setIsDeletingImg] = useState(false);

  const fetchProject = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true); setError('');
    try {
      const data = await getProjectById(projectId);
      setProject(data);
    } catch (err) {
      console.error('[ProjectDetailsModal]', err);
      setError('Failed to load project details.');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (isOpen && projectId) fetchProject();
  }, [isOpen, projectId, fetchProject]);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !project) return;

    if (files.length > 10) {
      setError('You can only upload a maximum of 10 images at once.');
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    setError('');
    try {
      await uploadProjectImages(project.id, files);
      await fetchProject(); onUpdate?.();
    } catch (err: unknown) {
      console.error('[ProjectDetailsModal] Upload error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload images.';
      setError(errorMessage);
    } finally {
      setIsUploading(false); e.target.value = '';
    }
  };

  const handleDeleteImage = async (imageUrl?: string) => {
    if (!project) return;
    setIsDeletingImg(true);
    try {
      await deleteProjectImage(project.id, imageUrl);
      await fetchProject(); onUpdate?.();
    } catch (err) {
      console.error('[ProjectDetailsModal] Delete image error:', err);
      setError('Failed to delete image.');
    } finally {
      setIsDeletingImg(false);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-inter" onClick={onClose}>
      <div className="bg-white rounded-[32px] w-full max-w-[820px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-[#16273B] px-8 py-5 flex items-center justify-between shrink-0">
          <h2 className="text-white text-[20px] font-bold">Project Details</h2>
          <button onClick={onClose} className="hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent outline-none">
            <Image src="/admin/units/addUnit/close-square.png" alt="Close" width={26} height={26} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-8 space-y-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#16273B] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <p className="text-red-500 text-center py-20">{error}</p>
          ) : project ? (
            <>
              {/* Name + meta */}
              <div>
                <h3 className="text-[26px] font-bold text-[#16273B]">{project.name}</h3>
                <p className="text-[13px] text-gray-400 mt-1">
                  Created {formatDate(project.createdAt)} by <span className="font-medium text-gray-500">{project.createdBy}</span>
                </p>
              </div>

              {/* Info cards */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Developer', value: project.developerName || '—' },
                  { label: 'Location', value: project.locationName || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#F9F6F2] rounded-2xl px-6 py-5">
                    <p className="text-[13px] text-gray-500 font-medium mb-1">{label}</p>
                    <p className="text-[#16273B] text-[16px] font-bold">{value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              {project.description && (
                <div className="bg-[#F9F6F2] rounded-2xl px-6 py-5">
                  <p className="text-[13px] text-gray-500 font-medium mb-1">Description</p>
                  <p className="text-[#16273B] text-[15px] leading-relaxed">{project.description}</p>
                </div>
              )}

              {/* Images */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[18px] font-bold text-[#16273B]">
                    Images <span className="text-[14px] font-normal text-gray-400">({project.imageUrls.length})</span>
                  </h4>
                  <div className="flex gap-3 items-center">
                    {project.imageUrls.length > 0 && (
                      <button onClick={() => handleDeleteImage()} disabled={isDeletingImg}
                        className="text-[13px] font-semibold border border-red-200 text-red-500 px-4 py-2 rounded-full cursor-pointer hover:bg-red-50 transition-colors disabled:opacity-50">
                        {isDeletingImg ? 'Removing...' : 'Remove All'}
                      </button>
                    )}
                    <label htmlFor="proj-detail-upload"
                      className={`flex items-center gap-2 bg-[#16273B] text-white px-5 py-2.5 rounded-full text-[14px] font-semibold cursor-pointer hover:bg-[#1a304a] transition-colors ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}>
                      {isUploading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Uploading...</> : <><span className="text-lg leading-none">+</span> Add Images</>}
                    </label>
                    <input type="file" id="proj-detail-upload" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                  </div>
                </div>

                {project.imageUrls.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400">
                    <p className="text-sm">No images yet. Click &quot;Add Images&quot; to upload.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {project.imageUrls.map((url, i) => {
                      const resolved = resolveProjectImageUrl(url);
                      return resolved ? (
                        <div key={i} className="group relative aspect-video rounded-xl overflow-hidden border border-gray-100 bg-gray-100">
                          <Image src={resolved} alt="Project" fill className="object-cover" />
                          
                          {/* Single Image Delete Button */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteImage(url);
                            }}
                            className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500 text-gray-500 cursor-pointer"
                            title="Remove this image"
                          >
                            <span className="text-base font-bold">×</span>
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 shrink-0 flex justify-end bg-white">
          <button onClick={onClose} className="bg-[#16273B] hover:bg-[#1a304a] text-white font-bold px-16 py-3.5 rounded-2xl transition-all cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
