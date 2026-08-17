'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import Image from 'next/image';
import {
  getDeveloperById,
  uploadGalleryImages,
  deleteGalleryImage,
  deleteDeveloperLogo,
  uploadDeveloperLogo,
  resolveImageUrl,
  Developer,
} from '@/lib/api/developers';

interface DeveloperDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  developerId: number | null;
  onUpdate?: () => void;
}

export default function DeveloperDetailsModal({
  isOpen,
  onClose,
  developerId,
  onUpdate,
}: DeveloperDetailsModalProps) {
  useBodyScrollLock(isOpen);
  useEscapeKey(onClose, isOpen);
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
  const [isDeletingLogo, setIsDeletingLogo] = useState(false);

  const fetchDeveloper = useCallback(async () => {
    if (!developerId) return;
    setIsLoading(true);
    setError('');
    try {
      const data = await getDeveloperById(developerId);
      setDeveloper(data);
    } catch (err) {
      console.error('[DeveloperDetailsModal] Fetch error:', err);
      setError('Failed to load developer details.');
    } finally {
      setIsLoading(false);
    }
  }, [developerId]);

  useEffect(() => {
    if (isOpen && developerId) {
      fetchDeveloper();
    }
  }, [isOpen, developerId, fetchDeveloper]);

  if (!isOpen) return null;

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !developer) return;
    setIsUploading(true);
    try {
      await uploadGalleryImages(developer.id, files);
      await fetchDeveloper();
      onUpdate?.();
    } catch (err) {
      console.error('[DeveloperDetailsModal] Gallery upload error:', err);
      setError('Failed to upload gallery images.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteGalleryImage = async (imageId: number) => {
    setDeletingImageId(imageId);
    try {
      await deleteGalleryImage(imageId);
      await fetchDeveloper();
      onUpdate?.();
    } catch (err) {
      console.error('[DeveloperDetailsModal] Gallery delete error:', err);
      setError('Failed to delete image.');
    } finally {
      setDeletingImageId(null);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !developer) return;
    setIsUploading(true);
    try {
      await uploadDeveloperLogo(developer.id, file);
      await fetchDeveloper();
      onUpdate?.();
    } catch (err) {
      console.error('[DeveloperDetailsModal] Logo upload error:', err);
      setError('Failed to upload logo.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteLogo = async () => {
    if (!developer) return;
    setIsDeletingLogo(true);
    try {
      await deleteDeveloperLogo(developer.id);
      await fetchDeveloper();
      onUpdate?.();
    } catch (err) {
      console.error('[DeveloperDetailsModal] Logo delete error:', err);
      setError('Failed to delete logo.');
    } finally {
      setIsDeletingLogo(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-inter"
    >
      <div
        className="bg-white rounded-[32px] w-full max-w-[820px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#000000] px-8 py-5 flex items-center justify-between shrink-0">
          <h2 className="text-white text-[20px] font-bold">Developer Details</h2>
          <button
            onClick={onClose}
            className="hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent outline-none"
          >
            <Image
              src="/admin/units/addUnit/close-square.png"
              alt="Close"
              width={26}
              height={26}
            />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-8 space-y-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#000000] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <p className="text-red-500 text-center py-20">{error}</p>
          ) : developer ? (
            <>
              {/* Logo + Name Row */}
              <div className="flex items-center gap-6">
                {/* Logo */}
                <div className="relative shrink-0">
                  <div 
                    className="w-[140px] h-[80px] relative flex items-center justify-center"
                    title={!developer.logoImage ? "Default Logo" : undefined}
                  >
                    <Image
                      src={developer.logoImage ? (resolveImageUrl(developer.logoImage) ?? '/admin/defaultLogo.png') : '/admin/defaultLogo.png'}
                      alt={developer.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  {/* Logo actions */}
                  <div className="flex gap-1 mt-2">
                    <label
                      htmlFor="logo-upload-details"
                      className="flex-1 text-center text-[11px] font-semibold bg-[#000000] text-white px-2 py-1 rounded-lg cursor-pointer hover:bg-[#1a304a] transition-colors"
                    >
                      {developer.logoImage ? 'Replace' : 'Upload'}
                    </label>
                    {developer.logoImage && (
                      <button
                        onClick={handleDeleteLogo}
                        disabled={isDeletingLogo}
                        className="flex-1 text-[11px] font-semibold border border-red-200 text-red-500 px-2 py-1 rounded-lg cursor-pointer hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {isDeletingLogo ? '...' : 'Remove'}
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    id="logo-upload-details"
                    className="hidden"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleLogoUpload}
                  />
                </div>

                {/* Name & Meta */}
                <div className="flex-1">
                  <h3 className="text-[26px] font-bold text-[#000000]">{developer.name}</h3>
                  <p className="text-[13px] text-gray-400 mt-1">
                    Created {formatDate(developer.createdAt)} by{' '}
                    <span className="font-medium text-gray-500">{developer.createdBy}</span>
                  </p>
                </div>

                {/* Projects badge */}
                <span className="inline-flex px-5 py-2.5 rounded-full bg-[#EBF3FF] text-[#1447E6] text-[14px] font-bold shrink-0">
                  {developer.projects.length} Projects
                </span>
              </div>

              {/* Description */}
              {developer.description && (
                <div className="bg-[#F9F6F2] rounded-2xl px-6 py-5">
                  <p className="text-[13px] text-gray-500 font-medium mb-1">Description</p>
                  <p className="text-[#000000] text-[15px] leading-relaxed">
                    {developer.description}
                  </p>
                </div>
              )}

              {/* Gallery Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[18px] font-bold text-[#000000]">
                    Gallery
                    <span className="ml-2 text-[14px] font-normal text-gray-400">
                      ({developer.gallery.length} image{developer.gallery.length !== 1 ? 's' : ''})
                    </span>
                  </h4>

                  <label
                    htmlFor="gallery-upload"
                    className={`flex items-center gap-2 bg-[#000000] text-white px-5 py-2.5 rounded-full text-[14px] font-semibold cursor-pointer hover:bg-[#1a304a] transition-colors ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <span className="text-lg leading-none">+</span>
                        Add Images
                      </>
                    )}
                  </label>
                  <input
                    type="file"
                    id="gallery-upload"
                    className="hidden"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    onChange={handleGalleryUpload}
                  />
                </div>

                {developer.gallery.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400">
                    <p className="text-sm">No gallery images yet. Click &quot;Add Images&quot; to upload.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {developer.gallery.map((img) => (
                      <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-video bg-gray-100 border border-gray-100">
                        <Image
                          src={resolveImageUrl(img.imageUrl) ?? ''}
                          alt="Gallery"
                          fill
                          className="object-cover"
                        />
                        {/* Delete overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                          <button
                            onClick={() => handleDeleteGalleryImage(img.id)}
                            disabled={deletingImageId === img.id}
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-red-500 font-bold px-3 py-1.5 rounded-lg text-[13px] cursor-pointer hover:bg-red-50 disabled:opacity-60"
                          >
                            {deletingImageId === img.id ? '...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 shrink-0 flex justify-end bg-white">
          <button
            onClick={onClose}
            className="bg-[#000000] hover:bg-[#1a304a] text-white font-bold px-16 py-3.5 rounded-2xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
