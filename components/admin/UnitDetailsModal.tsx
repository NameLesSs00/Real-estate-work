'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { getUnitById, UnitDetail, resolveProjectImageUrl, uploadUnitImages, deleteUnitImages } from '@/lib/api/projects';
import { getPaymentPlansByUnit, PaymentPlan, createPaymentPlan, deletePaymentPlan } from '@/lib/api/paymentPlans';
import MarkAsSoldModal from './MarkAsSoldModal';

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
  useBodyScrollLock(isOpen);
  const [unit, setUnit] = useState<UnitDetail | null>(null);
  const [extraPlans, setExtraPlans] = useState<PaymentPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDeletingImg, setIsDeletingImg] = useState(false);
  
  // Mark Sold state
  const [isMarkSoldModalOpen, setIsMarkSoldModalOpen] = useState(false);

  // New Payment Plan state
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [newPlan, setNewPlan] = useState({
    paymentType: 'Installment',
    installmentMonths: 12,
    installmentDownPayment: 10
  });
  const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);

  const fetchUnit = useCallback(async () => {
    if (!unitId) return;
    setIsLoading(true);
    setError('');
    try {
      const [unitData, plansData] = await Promise.all([
        getUnitById(unitId),
        getPaymentPlansByUnit(unitId).catch(() => [] as PaymentPlan[])
      ]);
      setUnit(unitData);
      setExtraPlans(plansData);
    } catch (err) {
      console.error('[UnitDetailsModal] Fetch error:', err);
      setError('Failed to load unit details.');
    } finally {
      setIsLoading(false);
    }
  }, [unitId]);

  useEffect(() => {
    if (isOpen && unitId) fetchUnit();
    if (!isOpen) {
      setUnit(null);
      setIsMarkSoldModalOpen(false);
    }
  }, [isOpen, unitId, fetchUnit]);

  const handleMarkSoldSuccess = () => {
    fetchUnit();
    onUpdate?.();
  };

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !unit) return;

    if (files.length > 10) {
      setError('You can only upload a maximum of 10 images at once.');
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    setError('');
    try {
      await uploadUnitImages(unit.id, files);
      await fetchUnit(); onUpdate?.();
    } catch (err: unknown) {
      console.error('[UnitDetailsModal] Upload error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload images.';
      setError(errorMessage);
    } finally {
      setIsUploading(false); e.target.value = '';
    }
  };

  const handleDeleteImage = async (imageUrl?: string) => {
    if (!unit) return;
    setIsDeletingImg(true);
    try {
      await deleteUnitImages(unit.id, imageUrl);
      await fetchUnit(); onUpdate?.();
    } catch (err) {
      console.error('[UnitDetailsModal] Delete image error:', err);
      setError('Failed to delete image.');
    } finally {
      setIsDeletingImg(false);
    }
  };

  const handleAddPlan = async () => {
    if (!unit) return;
    setIsSubmittingPlan(true);
    try {
      // Backend POST /api/payment-plans expects installmentYears, but GET returns installmentMonths.
      // We will send installmentMonths as installmentYears if it's large, 
      // but the safer bet is to follow the schema which says installmentYears.
      // However, usually these are months in real estate.
      await createPaymentPlan({
        unitId: unit.id,
        paymentType: newPlan.paymentType,
        installmentDownPayment: newPlan.installmentDownPayment,
        installmentYears: Math.ceil(newPlan.installmentMonths / 12), // schema says years
        installmentMonths: newPlan.installmentMonths // also sending months
      });
      await fetchUnit();
      setIsAddingPlan(false);
      setNewPlan({ paymentType: 'Installment', installmentMonths: 12, installmentDownPayment: 10 });
    } catch (err) {
      console.error('[UnitDetailsModal] Add plan error:', err);
      setError('Failed to add payment plan.');
    } finally {
      setIsSubmittingPlan(false);
    }
  };

  const handleDeletePlan = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this payment plan?')) return;
    try {
      await deletePaymentPlan(id);
      await fetchUnit();
    } catch (err) {
      console.error('[UnitDetailsModal] Delete plan error:', err);
      setError('Failed to delete payment plan.');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-inter">
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

                  {!unit.imageUrls || unit.imageUrls.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400">
                      <p className="text-sm">No images yet. Click &quot;Add Images&quot; to upload.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {unit.imageUrls.map((url, i) => {
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

                {/* Name + Status badges */}
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-[26px] font-bold text-[#16273B]">{unit.name}</h3>
                  {unit.isFeatured && (
                    <span className="inline-flex px-4 py-1.5 rounded-full bg-[#FEF9C3] text-[#A16207] text-[13px] font-bold">⭐ Featured</span>
                  )}
                  {((unit as any).isActive ?? (unit as any).IsActive) ? (
                    <span className="inline-flex px-4 py-1.5 rounded-full bg-[#DCFCE7] text-[#166534] text-[13px] font-bold">Active</span>
                  ) : (
                    <span className="inline-flex px-4 py-1.5 rounded-full bg-[#FEE2E2] text-[#991B1B] text-[13px] font-bold">Sold</span>
                  )}
                  <Link 
                    href={`/properties/${unit.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF3FF] text-[#1447E6] text-[13px] font-bold hover:bg-[#D6E6FF] transition-all cursor-pointer shadow-sm border border-[#D6E6FF]"
                  >
                    <ExternalLink size={14} />
                    View as Client
                  </Link>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <InfoCard label="Price" value={`${unit.currencyCode || 'EGP'} ${unit.price.toLocaleString()}`} />
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
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[17px] font-bold text-[#16273B]">Payment Plans</h4>
                    <button 
                      onClick={() => setIsAddingPlan(!isAddingPlan)}
                      className="text-[13px] font-semibold text-[#16273B] bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {isAddingPlan ? 'Cancel' : '+ Add Plan'}
                    </button>
                  </div>

                  {isAddingPlan && (
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-4 space-y-4 shadow-inner">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold text-gray-500">Type</label>
                          <select 
                            value={newPlan.paymentType}
                            onChange={(e) => setNewPlan({...newPlan, paymentType: e.target.value})}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[#16273B]/10"
                          >
                            <option value="Installment">Installment</option>
                            <option value="Cash">Cash</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold text-gray-500">Months</label>
                          <input 
                            type="number" 
                            value={newPlan.installmentMonths}
                            onChange={(e) => setNewPlan({...newPlan, installmentMonths: Number(e.target.value)})}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[#16273B]/10"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[12px] font-bold text-gray-500">Down Payment (%)</label>
                          <input 
                            type="number" 
                            value={newPlan.installmentDownPayment}
                            onChange={(e) => setNewPlan({...newPlan, installmentDownPayment: Number(e.target.value)})}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[#16273B]/10"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={handleAddPlan}
                        disabled={isSubmittingPlan}
                        className="w-full bg-[#16273B] text-white font-bold py-2.5 rounded-xl text-[14px] hover:bg-[#1a304a] transition-all disabled:opacity-50"
                      >
                        {isSubmittingPlan ? 'Adding...' : 'Confirm Add Plan'}
                      </button>
                    </div>
                  )}

                  {(() => {
                    const combinedPlans = [
                      ...(unit.paymentPlans || (unit as any).PaymentPlans || []),
                      ...extraPlans
                    ];
                    
                    // Deduplicate by ID if both sources return same plans
                    const uniquePlans = Array.from(new Map(combinedPlans.map(p => [p.id || `${p.paymentType}-${p.installmentMonths}-${p.installmentDownPayment}`, p])).values());

                    if (uniquePlans.length === 0 && !isAddingPlan) return (
                      <p className="text-[14px] text-gray-400 italic">No payment plans defined for this unit.</p>
                    );

                    return (
                      <div className="space-y-3">
                        {uniquePlans.map((plan: any, i: number) => {
                          const months = plan.installmentMonths ?? plan.installmentMonthes ?? plan.installmentMothes ?? plan.InstallmentMonthes ?? plan.InstallmentMothes ?? 0;
                          const downPayment = plan.installmentDownPayment ?? plan.InstallmentDownPayment ?? 0;
                          const type = plan.paymentType ?? plan.PaymentType ?? 'Installment';
                          const status = plan.planStatus ?? plan.PlanStatus ?? plan.unitStatus ?? 'Active';
                          const planId = plan.id ?? plan.paymentPlanId;

                          return (
                            <div key={i} className="bg-[#F9F6F2] rounded-2xl px-6 py-4 flex items-center justify-between group">
                              <div className="flex flex-wrap gap-6">
                                <div>
                                  <p className="text-[12px] text-gray-400">Type</p>
                                  <p className="text-[#16273B] font-bold">{type}</p>
                                </div>
                                <div>
                                  <p className="text-[12px] text-gray-400">Months</p>
                                  <p className="text-[#16273B] font-bold">{months}</p>
                                </div>
                                <div>
                                  <p className="text-[12px] text-gray-400">Down Payment</p>
                                  <p className="text-[#16273B] font-bold">{unit.currencyCode || 'EGP'} {downPayment.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-[12px] text-gray-400">Status</p>
                                  <p className="text-[#16273B] font-bold">{status}</p>
                                </div>
                              </div>
                              {planId && (
                                <button 
                                  onClick={() => handleDeletePlan(planId)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:bg-red-50 p-2 rounded-lg"
                                  title="Delete Plan"
                                >
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* Services */}
                <div className="grid grid-cols-1 gap-4">
                  {unit.services && unit.services.length > 0 && (
                    <div className="bg-[#F9F6F2] rounded-2xl px-6 py-5">
                      <p className="text-[13px] text-gray-500 font-medium mb-3">Services</p>
                      <div className="flex flex-wrap gap-2">
                        {unit.services.map((s, i) => {
                          const name = typeof s.name === 'string' ? s.name : (s.name?.en || s.name?.de || s.name?.pl || 'Unknown');
                          return (
                            <span key={i} className="px-3 py-1 bg-white rounded-full text-[13px] text-[#16273B] font-medium border border-gray-200">{name}</span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className="text-[12px] text-gray-400 flex gap-6">
                  <span>Created by <strong className="text-gray-500">{(unit as any).createdBy || (unit as any).CreatedBy || 'Admin'}</strong></span>
                  {((unit as any).updatedBy || (unit as any).UpdatedBy) && (
                    <span>Updated by <strong className="text-gray-500">{(unit as any).updatedBy || (unit as any).UpdatedBy}</strong></span>
                  )}
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
              </>
            ) : null}
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-gray-100 shrink-0 flex items-center justify-between bg-white">
            {unit && ((unit as any).isActive ?? (unit as any).IsActive) && (
              <button
                onClick={() => setIsMarkSoldModalOpen(true)}
                className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-8 py-3.5 rounded-2xl transition-all cursor-pointer border border-red-100"
              >
                🔴 Mark as Sold
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

      {/* Internal Mark As Sold Modal to ensure Notes are collected */}
      {unit && (
        <MarkAsSoldModal
          isOpen={isMarkSoldModalOpen}
          unitId={unit.id}
          unitName={unit.name}
          onClose={() => setIsMarkSoldModalOpen(false)}
          onSuccess={handleMarkSoldSuccess}
        />
      )}
    </>
  );
}
