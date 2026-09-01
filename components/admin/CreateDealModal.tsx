'use client';

import React, { useState, useEffect } from 'react';
import { createDeal, CreateDealPayload } from '@/lib/api/deals';
import { getProjects, Project, getUnitById, PaymentPlan } from '@/lib/api/projects';
import { getUnitsFiltered, UnitListItem } from '@/lib/api/units';
import { useEscapeKey } from '@/hooks/useEscapeKey';

interface CreateDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT: CreateDealPayload = { unitPlanId: 0, fullName: '', email: '', phone: '' };

export default function CreateDealModal({ isOpen, onClose, onSuccess }: CreateDealModalProps) {
  useEscapeKey(onClose, isOpen);
  const [form, setForm] = useState<CreateDealPayload>(DEFAULT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Dropdown Data
  const [projects, setProjects] = useState<Project[]>([]);
  const [units, setUnits] = useState<UnitListItem[]>([]);
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);

  // Selection state
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setForm(DEFAULT);
      setError('');
      setSelectedProjectId('');
      setSelectedUnitId('');
      setUnits([]);
      setPaymentPlans([]);
      loadProjects();
    }
  }, [isOpen]);

  const loadProjects = async () => {
    try {
      const data = await getProjects(1);
      setProjects(data.items);
    } catch (err) {
      console.error('Failed to load projects', err);
    }
  };

  // Load units when project changes
  useEffect(() => {
    if (!selectedProjectId) {
      setUnits([]);
      setSelectedUnitId('');
      return;
    }
    const loadUnits = async () => {
      try {
        const data = await getUnitsFiltered({ ProjectId: Number(selectedProjectId), UnitType: 'Buy', PageSize: 100 });
        setUnits(data.items);
        setSelectedUnitId('');
      } catch (err) {
        console.error('Failed to load units', err);
      }
    };
    loadUnits();
  }, [selectedProjectId]);

  // Load payment plans when unit changes
  useEffect(() => {
    if (!selectedUnitId) {
      setPaymentPlans([]);
      setForm(p => ({ ...p, unitPlanId: 0 }));
      return;
    }
    const loadUnitDetails = async () => {
      try {
        const data = await getUnitById(Number(selectedUnitId));
        // Note: The API likely returns IDs in the paymentPlans, adding fallback checks
        const plans = data.paymentPlans || data.PaymentPlans || [];
        setPaymentPlans(plans);
        setForm(p => ({ ...p, unitPlanId: 0 }));
      } catch (err) {
        console.error('Failed to load unit details for plans', err);
      }
    };
    loadUnitDetails();
  }, [selectedUnitId]);

  const setField = (k: keyof CreateDealPayload, v: string | number) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.unitPlanId) { setError('Please select a payment plan.'); return; }
    if (!form.fullName.trim()) { setError('Buyer full name is required.'); return; }
    setIsLoading(true);
    setError('');
    try {
      await createDeal(form);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create deal.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[28px] shadow-2xl w-full max-w-md z-10 font-inter">
        {/* Header */}
        <div className="border-b border-gray-100 px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-brand-primary">Create Deal</h2>
            <p className="text-[13px] text-admin-muted">Register a new unit sale deal</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-admin-muted)" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4 max-h-[75vh] overflow-y-auto scrollbar-hide">
          
          {/* Project Dropdown */}
          <div>
            <label className="block text-[13px] font-semibold text-brand-primary mb-2">Project</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-[14px] text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all bg-brand-bg cursor-pointer"
            >
              <option value="">Select Project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Unit Dropdown */}
          <div>
            <label className="block text-[13px] font-semibold text-brand-primary mb-2">Unit</label>
            <select
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value)}
              disabled={!selectedProjectId}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-[14px] text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all bg-brand-bg cursor-pointer disabled:opacity-50"
            >
              <option value="">Select Unit</option>
              {units.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          {/* Payment Plan Dropdown */}
          <div>
            <label className="block text-[13px] font-semibold text-brand-primary mb-2">Payment Plan</label>
            <select
              value={form.unitPlanId || ''}
              onChange={(e) => setField('unitPlanId', Number(e.target.value))}
              disabled={!selectedUnitId || paymentPlans.length === 0}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-[14px] text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all bg-brand-bg cursor-pointer disabled:opacity-50"
            >
              <option value="">Select Payment Plan</option>
              {paymentPlans.map((plan, i) => {
                const id = plan.id || plan.unitDetailId || plan.Id || i + 1; // Fallback
                return (
                  <option key={i} value={id}>
                    {plan.paymentType} - {plan.installmentMothes || plan.installmentMonthes} mo
                  </option>
                );
              })}
            </select>
            {selectedUnitId && paymentPlans.length === 0 && (
              <p className="text-[11px] text-red-400 mt-1">No payment plans found for this unit.</p>
            )}
          </div>

          <div className="h-px bg-gray-100 my-2" />

          {/* Buyer Full Name */}
          <div>
            <label className="block text-[13px] font-semibold text-brand-primary mb-2">
              Buyer Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setField('fullName', e.target.value)}
              placeholder="Enter buyer full name"
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-[14px] text-brand-primary placeholder:text-brand-muted-light focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all bg-brand-bg"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[13px] font-semibold text-brand-primary mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              placeholder="buyer@email.com"
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-[14px] text-brand-primary placeholder:text-brand-muted-light focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all bg-brand-bg"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[13px] font-semibold text-brand-primary mb-2">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
              placeholder="+20 xxx xxx xxxx"
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-[14px] text-brand-primary placeholder:text-brand-muted-light focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all bg-brand-bg"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium px-4 py-3 rounded-xl">{error}</div>
          )}

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} disabled={isLoading} className="flex-1 py-3.5 rounded-2xl border border-gray-200 text-[15px] font-semibold text-admin-muted hover:bg-gray-50 transition-all disabled:opacity-50 cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="flex-1 py-3.5 rounded-2xl bg-brand-primary text-white text-[15px] font-semibold hover:bg-brand-primary-hover active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2">
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating…</>
              ) : 'Create Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
