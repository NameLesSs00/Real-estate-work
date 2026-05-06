'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import Image from 'next/image';
import { getUnitById, UnitDetail } from '@/lib/api/projects';
import { getPaymentPlansByUnit, PaymentPlan } from '@/lib/api/paymentPlans';
import MarkAsSoldModal from './MarkAsSoldModal';

import UnitImages from './unit-details/UnitImages';
import UnitInfo from './unit-details/UnitInfo';
import UnitPaymentPlans from './unit-details/UnitPaymentPlans';

interface UnitDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitId: number | null;
  onUpdate?: () => void;
}

export default function UnitDetailsModal({ isOpen, onClose, unitId, onUpdate }: UnitDetailsModalProps) {
  useBodyScrollLock(isOpen);
  useEscapeKey(onClose, isOpen);
  const [unit, setUnit] = useState<UnitDetail | null>(null);
  const [extraPlans, setExtraPlans] = useState<PaymentPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Mark Sold state
  const [isMarkSoldModalOpen, setIsMarkSoldModalOpen] = useState(false);

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
                <UnitImages unit={unit} fetchUnit={fetchUnit} onUpdate={onUpdate} />
                <UnitInfo unit={unit} />
                <UnitPaymentPlans unit={unit} extraPlans={extraPlans} fetchUnit={fetchUnit} setError={setError} />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </>
            ) : null}
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-gray-100 shrink-0 flex items-center justify-between bg-white">
            {unit && (unit.isActive || unit.IsActive) && (
              <button
                onClick={() => setIsMarkSoldModalOpen(true)}
                className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-8 py-3.5 rounded-2xl transition-all cursor-pointer border border-red-100"
              >
                🔴 Mark as Sold
              </button>
            )}
            <div className="ml-auto flex items-center gap-3">
              <a
                href={`/properties/${(() => {
                  const id = unit?.Id || unit?.id;
                  if (!id) return '';
                  const rawName = typeof unit?.Name === 'string' ? unit.Name : (unit?.Name?.en || unit?.name?.en || unit?.name || '');
                  const slug = typeof rawName === 'string' ? rawName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') : '';
                  return slug ? `${id}-${slug}` : id;
                })()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-8 py-3.5 rounded-2xl transition-all border border-blue-100 text-center"
              >
                View as Client
              </a>
              <button
                onClick={onClose}
                className="bg-[#16273B] hover:bg-[#1a304a] text-white font-bold px-16 py-3.5 rounded-2xl transition-all cursor-pointer"
              >
                Close
              </button>
          </div>
        </div>
      </div>
    </div>

    {/* Internal Mark As Sold Modal */}
      {unit && (
        <MarkAsSoldModal
          isOpen={isMarkSoldModalOpen}
          unitId={unit.Id || unit.id || 0}
          unitName={typeof unit.Name === 'string' ? unit.Name : (unit.Name?.en || (typeof unit.name === 'string' ? unit.name : unit.name?.en) || "Untitled")}
          onClose={() => setIsMarkSoldModalOpen(false)}
          onSuccess={handleMarkSoldSuccess}
        />
      )}
    </>
  );
}
