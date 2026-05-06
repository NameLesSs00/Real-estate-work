import React, { useState } from 'react';
import Image from 'next/image';
import { UnitDetail, resolveProjectImageUrl, uploadUnitImages, deleteUnitImages } from '@/lib/api/projects';

interface UnitImagesProps {
  unit: UnitDetail;
  fetchUnit: () => Promise<void>;
  onUpdate?: () => void;
}

export default function UnitImages({ unit, fetchUnit, onUpdate }: UnitImagesProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeletingImg, setIsDeletingImg] = useState(false);

  const [localError, setLocalError] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    if (files.length > 10) {
      setLocalError('You can only upload a maximum of 10 images at once.');
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    setLocalError('');
    try {
      const id = unit.Id || unit.id;
      if (!id) throw new Error('Unit ID not found');
      await uploadUnitImages(id, files);
      await fetchUnit(); onUpdate?.();
    } catch (err: unknown) {
      console.error('[UnitImages] Upload error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload images.';
      setLocalError(errorMessage);
    } finally {
      setIsUploading(false); e.target.value = '';
    }
  };

  const handleDeleteImage = async (imageUrl?: string) => {
    setIsDeletingImg(true);
    setLocalError('');
    try {
      const id = unit.Id || unit.id;
      if (!id) throw new Error('Unit ID not found');
      await deleteUnitImages(id, imageUrl);
      await fetchUnit(); onUpdate?.();
    } catch (err) {
      console.error('[UnitImages] Delete image error:', err);
      setLocalError('Failed to delete image.');
    } finally {
      setIsDeletingImg(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[18px] font-bold text-[#16273B]">
          Images <span className="text-[14px] font-normal text-gray-400">({(unit.ImageUrls?.length || (unit as any).imageUrls?.length || 0)})</span>
        </h4>
        <div className="flex gap-3 items-center">
          {(unit.ImageUrls?.length || (unit as any).imageUrls?.length) > 0 && (
            <button onClick={() => handleDeleteImage()} disabled={isDeletingImg}
              className="text-[13px] font-semibold border border-red-200 text-red-500 px-4 py-2 rounded-full cursor-pointer hover:bg-red-50 transition-colors disabled:opacity-50">
              {isDeletingImg ? 'Removing...' : 'Remove All'}
            </button>
          )}
          <label htmlFor="unit-detail-upload"
            className={`flex items-center gap-2 bg-[#16273B] text-white px-5 py-2.5 rounded-full text-[14px] font-semibold cursor-pointer hover:bg-[#1a304a] transition-colors ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}>
            {isUploading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Uploading...</> : <><span className="text-lg leading-none">+</span> Add Images</>}
          </label>
          <input type="file" id="unit-detail-upload" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
        </div>
      </div>

      {localError && (
        <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium px-4 py-3 rounded-xl flex items-center justify-between">
          <span>{localError}</span>
          <button onClick={() => setLocalError('')} className="text-red-400 hover:text-red-600 font-bold ml-4">×</button>
        </div>
      )}

      {(!unit.ImageUrls || unit.ImageUrls.length === 0) && (!(unit as any).imageUrls || (unit as any).imageUrls.length === 0) ? (
        <label htmlFor="unit-detail-upload" className="block border-2 border-dashed border-gray-200 hover:border-[#16273B] hover:bg-gray-50 transition-colors rounded-2xl p-10 text-center text-gray-400 cursor-pointer">
          <p className="text-sm">No images yet. Click here to upload.</p>
        </label>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {(unit.ImageUrls || (unit as any).imageUrls || []).map((url: string, i: number) => {
            const resolved = resolveProjectImageUrl(url);
            return resolved ? (
              <div key={i} className={`group relative rounded-2xl overflow-hidden ${i === 0 ? 'col-span-2 row-span-2 aspect-video' : 'aspect-video bg-gray-100 border border-gray-100'}`}>
                <Image src={resolved} alt={`Unit image ${i + 1}`} fill className="object-cover" />
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(url);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500 text-gray-500 cursor-pointer"
                  title="Remove this image"
                >
                  <span className="text-lg font-bold">×</span>
                </button>
              </div>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
