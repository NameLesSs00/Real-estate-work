'use client';

import React, { useState, useEffect } from 'react';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { markUnitOutsideSold, UnitOutside } from '@/lib/api/unitOutsides';

interface MarkUnitOutsideSoldModalProps {
  isOpen: boolean;
  unit: UnitOutside | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MarkUnitOutsideSoldModal({
  isOpen,
  unit,
  onClose,
  onSuccess,
}: MarkUnitOutsideSoldModalProps) {
  useEscapeKey(onClose, isOpen);
  const [selectedPlanId, setSelectedPlanId] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      setIsLoading(false);
      // Pre-select the first active plan if available
      const firstPlan = unit?.paymentPlans?.[0];
      setSelectedPlanId(firstPlan ? firstPlan.id : '');
    }
  }, [isOpen, unit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unit || selectedPlanId === '') {
      setError('Please select a payment plan.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await markUnitOutsideSold(unit.id, Number(selectedPlanId));
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to mark unit as sold.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !unit) return null;

  const plans = unit.paymentPlans ?? [];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-[28px] shadow-2xl w-full max-w-md p-8 z-10 font-inter">
        {/* Icon + Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-[#FEF9C3] rounded-2xl flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A16207" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
          </div>
          <h2 className="text-[22px] font-bold text-[#000000] mb-1">Mark as Sold</h2>
          <p className="text-[14px] text-[#64748B] leading-relaxed">
            You are marking{' '}
            <span className="font-semibold text-[#000000]">&ldquo;{unit.name}&rdquo;</span> as
            sold.
            <br />
            This action will deactivate the unit.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Payment Plan Selector */}
          <div>
            <label className="block text-[13px] font-semibold text-[#000000] mb-2">
              Payment Plan *
            </label>
            {plans.length === 0 ? (
              <p className="text-[13px] text-red-500 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
                This unit has no payment plans. Please add a payment plan before marking it as
                sold.
              </p>
            ) : (
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-[14px] text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#A16207]/30 focus:border-[#A16207] transition-all bg-[#FAFAFA] cursor-pointer"
              >
                <option value="">— Select a plan —</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.paymentType}
                    {plan.installmentMothes > 0 ? ` — ${plan.installmentMothes} months` : ''}
                    {plan.installmentDownPayment > 0
                      ? ` — ${plan.installmentDownPayment}% down`
                      : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3.5 rounded-2xl border border-gray-200 text-[15px] font-semibold text-[#64748B] hover:bg-gray-50 transition-all disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || plans.length === 0}
              className="flex-1 py-3.5 rounded-2xl bg-[#A16207] text-white text-[15px] font-semibold hover:bg-[#8a5305] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing…
                </>
              ) : (
                'Confirm Sale'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
