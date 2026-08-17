'use client';

import React, { useState, useEffect } from 'react';
import { markUnitSold } from '@/lib/api/units';
import { useEscapeKey } from '@/hooks/useEscapeKey';

interface MarkAsSoldModalProps {
  isOpen: boolean;
  unitId: number | null;
  unitName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MarkAsSoldModal({
  isOpen,
  unitId,
  unitName,
  onClose,
  onSuccess,
}: MarkAsSoldModalProps) {
  useEscapeKey(onClose, isOpen);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setNotes('');
      setError('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitId) return;
    setIsLoading(true);
    setError('');
    try {
      await markUnitSold(unitId, notes.trim());
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to mark unit as sold.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

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
            You are marking <span className="font-semibold text-[#000000]">&ldquo;{unitName}&rdquo;</span> as sold.
            <br />This action will deactivate the unit.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Notes */}
          <div>
            <label className="block text-[13px] font-semibold text-[#000000] mb-2">
              Notes
            </label>
            <textarea
              rows={3}
              required
              placeholder="Add relevant notes about this sale (required)…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-[14px] text-[#000000] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#A16207]/30 focus:border-[#A16207] transition-all resize-none bg-[#FAFAFA]"
            />
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
              disabled={isLoading}
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
