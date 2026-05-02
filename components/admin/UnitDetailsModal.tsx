'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { getUnitById, markUnitSold, UnitDetail, resolveProjectImageUrl, uploadUnitImages, deleteUnitImages } from '@/lib/api/projects';

interface UnitDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitId: number | null;
  onUpdate?: () => void;
}

const InfoCard = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="bg-[#F9F6F2] rounded-2xl px-6 py-5">
    <p className="text-[13px] text-gray-500 font-medium mb-1">{label}</p>
    <p className="text-[#16273B] text-[18px] font-bold">{value}</p>
  </div>
);

export default function UnitDetailsModal({ isOpen, onClose, unitId, onUpdate }: UnitDetailsModalProps) {
  const [unit, setUnit] = useState<UnitDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMarkingSold, setIsMarkingSold] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeletingImg, setIsDeletingImg] = useState(false);

  const fetchUnit = useCallback(async () => {
    if (!unitId) return;
    setIsLoading(true);
    setError('');
    try {
      const data = await getUnitById(unitId);
      setUnit(data);
    } catch (err) {
      console.error('[UnitDetailsModal] Fetch error:', err);
      setError('Failed to load unit details.');
    } finally {
      setIsLoading(false);
    }
  }, [unitId]);

  useEffect(() => {
    if (isOpen && unitId) fetchUnit();
    if (!isOpen) setUnit(null);
  }, [isOpen, unitId, fetchUnit]);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !unit) return;
    setIsUploading(true);
    try {
      await uploadUnitImages(unit.id, files);
      await fetchUnit(); onUpdate?.();
    } catch (err) {
      console.error('[UnitDetailsModal] Upload error:', err);
      setError('Failed to upload images.');
    } finally {
      setIsUploading(false); e.target.value = '';
    }
  };

  const handleDeleteImage = async () => {
    if (!unit) return;
    setIsDeletingImg(true);
    try {
      await deleteUnitImages(unit.id);
      await fetchUnit(); onUpdate?.();
    } catch (err) {
      console.error('[UnitDetailsModal] Delete image error:', err);
      setError('Failed to delete image.');
    } finally {
      setIsDeletingImg(false);
    }
  };

  const handleMarkSold = async () => {
    if (!unit) return;
    setIsMarkingSold(true);
    try {
      await markUnitSold(unit.id);
      await fetchUnit();
      onUpdate?.();
    } catch (err) {
      console.error('[UnitDetailsModal] Mark sold error:', err);
      setError('Failed to mark unit as sold.');
    } finally {
      setIsMarkingSold(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-inter" onClick={onClose}>
      <div className="bg-white rounded-[32px] w-full max-w-[860px] max-h-[92vh] flex flex-col shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-[#16273B] px-8 py-5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-white text-[20px] font-bold">Unit Details</h2>
            {unit?.projectName && <p className="text-white/60 text-[13px]">{unit.projectName}</p>}
          </div>
          <button onClick={onClose} className="hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent outline-none">
            <Image src="/admin/units/addUnit/close-square.png" alt="Close" width={26} height={26} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto scrollbar-hide flex-1 p-8 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#16273B] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <p className="text-red-500 text-center py-20">{error}</p>
          ) : unit ? (
            <>
              {/* Images */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[18px] font-bold text-[#16273B]">
                    Images <span className="text-[14px] font-normal text-gray-400">({unit.imageUrls?.length || 0})</span>
                  </h4>
                  <div className="flex gap-3 items-center">
                    {unit.imageUrls && unit.imageUrls.length > 0 && (
                      <button onClick={handleDeleteImage} disabled={isDeletingImg}
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

                {!unit.imageUrls || unit.imageUrls.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400">
                    <p className="text-sm">No images yet. Click &quot;Add Images&quot; to upload.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {unit.imageUrls.map((url, i) => {
                      const resolved = resolveProjectImageUrl(url);
                      return resolved ? (
                        <div key={i} className={`relative rounded-2xl overflow-hidden ${i === 0 ? 'col-span-2 row-span-2 aspect-video' : 'aspect-video bg-gray-100 border border-gray-100'}`}>
                          <Image src={resolved} alt={`Unit image ${i + 1}`} fill className="object-cover" />
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              {/* Name + Status badges */}
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-[26px] font-bold text-[#16273B]">{unit.name}</h3>
                {unit.isFeatured && (
                  <span className="inline-flex px-4 py-1.5 rounded-full bg-[#FEF9C3] text-[#A16207] text-[13px] font-bold">⭐ Featured</span>
                )}
                {unit.isActive ? (
                  <span className="inline-flex px-4 py-1.5 rounded-full bg-[#DCFCE7] text-[#166534] text-[13px] font-bold">Active</span>
                ) : (
                  <span className="inline-flex px-4 py-1.5 rounded-full bg-[#FEE2E2] text-[#991B1B] text-[13px] font-bold">Sold</span>
                )}
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                <InfoCard label="Price" value={`EGP ${unit.price.toLocaleString()}`} />
                <InfoCard label="Property Type" value={unit.propertyType || '—'} />
                <InfoCard label="Project" value={unit.projectName || '—'} />
                <InfoCard label="Location" value={unit.locationName || '—'} />
              </div>

              {/* Description */}
              {unit.description && (
                <div className="bg-[#F9F6F2] rounded-2xl px-6 py-5">
                  <p className="text-[13px] text-gray-500 font-medium mb-2">Description</p>
                  <p className="text-[#16273B] text-[15px] leading-relaxed">{unit.description}</p>
                </div>
              )}

              {/* Payment Plans */}
              {unit.paymentPlans && unit.paymentPlans.length > 0 && (
                <div>
                  <h4 className="text-[17px] font-bold text-[#16273B] mb-3">Payment Plans</h4>
                  <div className="space-y-3">
                    {unit.paymentPlans.map((plan, i) => (
                      <div key={i} className="bg-[#F9F6F2] rounded-2xl px-6 py-4 flex flex-wrap gap-6">
                        <div>
                          <p className="text-[12px] text-gray-400">Type</p>
                          <p className="text-[#16273B] font-bold">{plan.paymentType}</p>
                        </div>
                        <div>
                          <p className="text-[12px] text-gray-400">Months</p>
                          <p className="text-[#16273B] font-bold">{plan.installmentMothes}</p>
                        </div>
                        <div>
                          <p className="text-[12px] text-gray-400">Down Payment</p>
                          <p className="text-[#16273B] font-bold">EGP {plan.installmentDownPayment.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[12px] text-gray-400">Status</p>
                          <p className="text-[#16273B] font-bold">{plan.planStatus}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Facilities & Services */}
              <div className="grid grid-cols-2 gap-4">
                {unit.facilities && unit.facilities.length > 0 && (
                  <div className="bg-[#F9F6F2] rounded-2xl px-6 py-5">
                    <p className="text-[13px] text-gray-500 font-medium mb-3">Facilities</p>
                    <div className="flex flex-wrap gap-2">
                      {unit.facilities.map((f, i) => (
                        <span key={i} className="px-3 py-1 bg-white rounded-full text-[13px] text-[#16273B] font-medium border border-gray-200">{f}</span>
                      ))}
                    </div>
                  </div>
                )}
                {unit.services && unit.services.length > 0 && (
                  <div className="bg-[#F9F6F2] rounded-2xl px-6 py-5">
                    <p className="text-[13px] text-gray-500 font-medium mb-3">Services</p>
                    <div className="flex flex-wrap gap-2">
                      {unit.services.map((s, i) => (
                        <span key={i} className="px-3 py-1 bg-white rounded-full text-[13px] text-[#16273B] font-medium border border-gray-200">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Meta */}
              <div className="text-[12px] text-gray-400 flex gap-6">
                <span>Created by <strong className="text-gray-500">{unit.createdBy}</strong></span>
                {unit.updatedBy && <span>Updated by <strong className="text-gray-500">{unit.updatedBy}</strong></span>}
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 shrink-0 flex items-center justify-between bg-white">
          {unit?.isActive && (
            <button
              onClick={handleMarkSold}
              disabled={isMarkingSold}
              className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-8 py-3.5 rounded-2xl transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed border border-red-100"
            >
              {isMarkingSold ? 'Marking...' : '🔴 Mark as Sold'}
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-auto bg-[#16273B] hover:bg-[#1a304a] text-white font-bold px-16 py-3.5 rounded-2xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
