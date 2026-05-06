'use client';

import React, { useState, useEffect } from 'react';
import { getDealById, Deal } from '@/lib/api/deals';
import { useEscapeKey } from '@/hooks/useEscapeKey';

interface DealDetailModalProps {
  isOpen: boolean;
  dealId: number | null;
  onClose: () => void;
}

export default function DealDetailModal({ isOpen, dealId, onClose }: DealDetailModalProps) {
  useEscapeKey(onClose, isOpen);
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !dealId) return;
    setDeal(null);
    setError('');
    setIsLoading(true);
    getDealById(dealId)
      .then(setDeal)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load deal.'))
      .finally(() => setIsLoading(false));
  }, [isOpen, dealId]);

  if (!isOpen) return null;

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[28px] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10 font-inter">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-8 py-5 flex items-center justify-between rounded-t-[28px]">
          <div>
            <h2 className="text-[20px] font-bold text-[#16273B]">Deal Detail</h2>
            <p className="text-[13px] text-[#64748B]">Deal #{dealId}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8">
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-[#16273B] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {error && <div className="text-center py-12 text-red-500">{error}</div>}
          {deal && (
            <div className="space-y-6">
              {/* Overview banner */}
              <div className="flex items-center gap-4 bg-[#16273B] rounded-2xl p-5 text-white">
                <div>
                  <p className="text-white/60 text-[12px] uppercase tracking-wider">Deal Type</p>
                  <p className="text-[20px] font-bold">{deal.dealType || '—'}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-white/60 text-[12px]">Date</p>
                  <p className="text-[14px] font-semibold">{fmt(deal.dealDate)}</p>
                </div>
              </div>

              {/* Unit */}
              <SectionLabel title="Unit Info" />
              <div className="grid grid-cols-2 gap-3">
                <IC label="Unit" value={deal.unit?.unitName} />
                <IC label="Project" value={deal.unit?.projectName} />
                <IC label="Price" value={`EGP ${deal.unit?.price?.toLocaleString()}`} />
                <IC label="Area" value={deal.unit?.area ? `${deal.unit.area} m²` : '—'} />
                <IC label="Status" value={
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[12px] font-bold ${deal.unit?.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {deal.unit?.isActive ? 'Active' : 'Sold'}
                  </span>
                } />
              </div>

              {/* Deal Details */}
              <SectionLabel title="Deal Details" />
              <div className="grid grid-cols-2 gap-3">
                <IC label="Commission" value={deal.unitDetails?.commissionRate !== undefined ? `${deal.unitDetails.commissionRate}%` : '—'} />
                <IC label="Payment Type" value={deal.unitDetails?.paymentType} />
                <IC label="Installment Months" value={deal.unitDetails?.installmentMothes} />
                <IC label="Down Payment" value={deal.unitDetails?.installmentDownPayment !== undefined ? `${deal.unitDetails.installmentDownPayment}%` : '—'} />
                <IC label="Status" value={<span className="inline-flex px-2 py-0.5 rounded-full text-[12px] font-bold bg-[#EEF0F5] text-[#16273B]">{deal.unitDetails?.status || '—'}</span>} />
              </div>

              {/* Buyer */}
              <SectionLabel title="Buyer" />
              <div className="grid grid-cols-2 gap-3">
                <IC label="Full Name" value={deal.buyer?.fullName} />
                <IC label="Phone" value={deal.buyer?.phone} />
                <IC label="Email" value={deal.buyer?.email} />
                <IC label="Location" value={deal.buyer?.dealLocation} />
                <IC label="Deal Date" value={deal.buyer?.dealDate ? fmt(deal.buyer.dealDate) : '—'} />
              </div>

              {/* Meta */}
              <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-3">
                <IC label="Created By" value={deal.createdBy} />
                <IC label="Created At" value={fmt(deal.createdAt)} />
                {deal.updatedBy && <IC label="Updated By" value={deal.updatedBy} />}
                {deal.updatedAt && <IC label="Updated At" value={fmt(deal.updatedAt)} />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ title }: { title: string }) {
  return <h3 className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider">{title}</h3>;
}

function IC({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-[#F8F9FA] rounded-xl p-3">
      <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-0.5">{label}</p>
      <div className="text-[13px] font-semibold text-[#16273B]">{value ?? '—'}</div>
    </div>
  );
}
