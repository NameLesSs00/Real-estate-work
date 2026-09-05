'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Check,
  CreditCard,
  Loader2,
  Pencil,
  RefreshCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { Project } from '@/lib/api/projects';
import {
  createProjectPaymentPlan,
  deleteProjectPaymentPlan,
  getProjectPaymentPlans,
  ProjectPaymentPlan,
  ProjectPaymentPlanStatus,
  ProjectPaymentType,
  updateProjectPaymentPlan,
} from '@/lib/api/projectPaymentPlans';

interface ProjectPaymentPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

type FormMode = 'create' | 'edit';

interface PaymentPlanForm {
  id: number | null;
  paymentType: ProjectPaymentType;
  installmentDownPayment: string;
  installmentYears: string;
  installmentMonths: string;
  commissionRate: string;
  status: ProjectPaymentPlanStatus;
}

const EMPTY_FORM: PaymentPlanForm = {
  id: null,
  paymentType: 'Installment',
  installmentDownPayment: '',
  installmentYears: '1',
  installmentMonths: '12',
  commissionRate: '',
  status: 0,
};

const PAYMENT_TYPES: ProjectPaymentType[] = ['Installment', 'Cash'];
const STATUS_OPTIONS: { label: string; value: ProjectPaymentPlanStatus }[] = [
  { label: 'Approved', value: 0 },
  { label: 'Sold', value: 1 },
];

const statusToValue = (status: string | number): ProjectPaymentPlanStatus => {
  if (status === 1 || String(status).toLowerCase() === 'sold') return 1;
  return 0;
};

const formatDate = (value?: string | null) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatCurrency = (value: number) => `EUR ${value.toLocaleString()}`;

export default function ProjectPaymentPlansModal({ isOpen, onClose, project }: ProjectPaymentPlansModalProps) {
  useBodyScrollLock(isOpen);
  useEscapeKey(onClose, isOpen);

  const [plans, setPlans] = useState<ProjectPaymentPlan[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<ProjectPaymentType | ''>('');
  const [statusFilter, setStatusFilter] = useState<ProjectPaymentPlanStatus | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [form, setForm] = useState<PaymentPlanForm>(EMPTY_FORM);
  const [error, setError] = useState('');

  const isCash = form.paymentType === 'Cash';

  const sortedPlans = useMemo(() => {
    return [...plans].sort((a, b) => b.id - a.id);
  }, [plans]);

  const resetForm = useCallback(() => {
    setForm(EMPTY_FORM);
    setFormMode('create');
    setError('');
  }, []);

  const fetchPlans = useCallback(async (page = pageNumber) => {
    if (!project?.id) return;
    setIsLoading(true);
    setError('');
    try {
      const data = await getProjectPaymentPlans(project.id, {
        pageNumber: page,
        pageSize: 8,
        searchTerm: searchTerm.trim(),
        paymentType: paymentTypeFilter,
        status: statusFilter,
      });
      setPlans(data.items);
      setPageNumber(data.pageNumber);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (err) {
      console.error('[ProjectPaymentPlansModal] Fetch error:', err);
      setError('Failed to load payment plans.');
    } finally {
      setIsLoading(false);
    }
  }, [pageNumber, paymentTypeFilter, project?.id, searchTerm, statusFilter]);

  useEffect(() => {
    if (!isOpen || !project?.id) return;
    resetForm();
    setConfirmDeleteId(null);
    setSearchTerm('');
    setPaymentTypeFilter('');
    setStatusFilter('');
    setPageNumber(1);
  }, [isOpen, project?.id, resetForm]);

  useEffect(() => {
    if (!isOpen || !project?.id) return;
    fetchPlans(1);
  }, [fetchPlans, isOpen, paymentTypeFilter, project?.id, searchTerm, statusFilter]);

  if (!isOpen || !project) return null;

  const updateForm = (patch: Partial<PaymentPlanForm>) => {
    setForm((current) => ({ ...current, ...patch }));
    setError('');
  };

  const handleEdit = (plan: ProjectPaymentPlan) => {
    const type = String(plan.paymentType).toLowerCase() === 'cash' ? 'Cash' : 'Installment';
    setForm({
      id: plan.id,
      paymentType: type,
      installmentDownPayment: String(plan.installmentDownPayment ?? 0),
      installmentYears: String(plan.installmentYears ?? Math.ceil((plan.installmentMonths || 0) / 12)),
      installmentMonths: String(plan.installmentMonths ?? 0),
      commissionRate: plan.commissionRate === null || plan.commissionRate === undefined ? '' : String(plan.commissionRate),
      status: statusToValue(plan.status),
    });
    setFormMode('edit');
    setConfirmDeleteId(null);
    setError('');
  };

  const buildPayload = () => {
    const commissionRate = form.commissionRate === '' ? null : Number(form.commissionRate);
    const installmentDownPayment = isCash ? 0 : Number(form.installmentDownPayment);
    const installmentYears = isCash ? 0 : Number(form.installmentYears);
    const installmentMonths = isCash ? 0 : Number(form.installmentMonths);

    if (commissionRate !== null && (!Number.isFinite(commissionRate) || commissionRate < 1 || commissionRate > 99)) {
      throw new Error('Commission rate must be empty or between 1 and 99.');
    }

    if (!isCash) {
      if (!Number.isFinite(installmentDownPayment) || installmentDownPayment < 0) {
        throw new Error('Down payment must be zero or higher.');
      }
      if (!Number.isInteger(installmentYears) || installmentYears < 0) {
        throw new Error('Installment years must be zero or higher.');
      }
      if (!Number.isInteger(installmentMonths) || installmentMonths < 1) {
        throw new Error('Installment months must be at least 1.');
      }
    }

    return {
      projectId: project.id,
      paymentType: form.paymentType,
      installmentDownPayment,
      installmentYears,
      installmentMonths,
      commissionRate,
      status: form.status,
    };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSaving(true);
    setError('');
    try {
      const payload = buildPayload();
      if (formMode === 'edit' && form.id) {
        await updateProjectPaymentPlan(project.id, form.id, { id: form.id, ...payload });
      } else {
        await createProjectPaymentPlan(project.id, payload);
      }
      resetForm();
      await fetchPlans(1);
    } catch (err) {
      console.error('[ProjectPaymentPlansModal] Save error:', err);
      setError(err instanceof Error ? err.message : 'Failed to save payment plan.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (plan: ProjectPaymentPlan) => {
    if (confirmDeleteId !== plan.id) {
      setConfirmDeleteId(plan.id);
      return;
    }

    setDeletingId(plan.id);
    setError('');
    try {
      await deleteProjectPaymentPlan(project.id, plan.id);
      if (form.id === plan.id) resetForm();
      setConfirmDeleteId(null);
      await fetchPlans(pageNumber);
    } catch (err) {
      console.error('[ProjectPaymentPlansModal] Delete error:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete payment plan.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 font-inter backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-[1120px] flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex shrink-0 items-center justify-between bg-brand-primary px-7 py-5">
          <div>
            <h2 className="text-[21px] font-bold text-white">Project Payment Plans</h2>
            <p className="mt-1 text-[13px] font-medium text-white/60">{project.name}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-white/70 transition hover:bg-white/10 hover:text-white">
            <X size={22} />
          </button>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-6 overflow-y-auto bg-admin-bg p-6 lg:grid-cols-[360px_1fr]">
          <form onSubmit={handleSubmit} className="h-fit rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary-soft text-brand-primary">
                  <CreditCard size={19} />
                </span>
                <div>
                  <h3 className="text-[17px] font-bold text-brand-primary">{formMode === 'edit' ? 'Edit Plan' : 'New Plan'}</h3>
                  <p className="text-[12px] font-medium text-gray-400">Amounts are shown in EUR</p>
                </div>
              </div>
              {formMode === 'edit' && (
                <button type="button" onClick={resetForm} className="rounded-lg px-3 py-1.5 text-[12px] font-bold text-brand-primary hover:bg-gray-50">
                  New
                </button>
              )}
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-brand-primary">Payment Type</label>
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-50 p-1.5">
                  {PAYMENT_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => updateForm({
                        paymentType: type,
                        installmentDownPayment: type === 'Cash' ? '0' : form.installmentDownPayment,
                        installmentYears: type === 'Cash' ? '0' : form.installmentYears,
                        installmentMonths: type === 'Cash' ? '0' : form.installmentMonths,
                      })}
                      className={`rounded-lg px-4 py-2.5 text-[13px] font-bold transition ${form.paymentType === type ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-primary hover:bg-white'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-brand-primary">Down Payment (EUR)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.installmentDownPayment}
                    disabled={isCash}
                    onChange={(event) => updateForm({ installmentDownPayment: event.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14px] font-semibold text-brand-primary outline-none transition focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/5 disabled:bg-gray-50 disabled:text-gray-400"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-brand-primary">Commission (%)</label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={form.commissionRate}
                    onChange={(event) => updateForm({ commissionRate: event.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14px] font-semibold text-brand-primary outline-none transition focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/5"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-brand-primary">Installment Years</label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={form.installmentYears}
                    disabled={isCash}
                    onChange={(event) => updateForm({ installmentYears: event.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14px] font-semibold text-brand-primary outline-none transition focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/5 disabled:bg-gray-50 disabled:text-gray-400"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-brand-primary">Installment Months</label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={form.installmentMonths}
                    disabled={isCash}
                    onChange={(event) => updateForm({ installmentMonths: event.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14px] font-semibold text-brand-primary outline-none transition focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/5 disabled:bg-gray-50 disabled:text-gray-400"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-brand-primary">Status</label>
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-50 p-1.5">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => updateForm({ status: status.value })}
                      className={`rounded-lg px-4 py-2.5 text-[13px] font-bold transition ${form.status === status.value ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-primary hover:bg-white'}`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-5 py-3.5 text-[14px] font-bold text-white shadow-lg shadow-brand-primary/15 transition hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving && <Loader2 size={17} className="animate-spin" />}
                {isSaving ? 'Saving...' : formMode === 'edit' ? 'Save Plan' : 'Create Plan'}
              </button>
            </div>
          </form>

          <div className="min-w-0 rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h3 className="text-[18px] font-bold text-brand-primary">Payment Plans</h3>
                <p className="mt-0.5 text-[13px] font-medium text-gray-400">{totalCount} plan{totalCount === 1 ? '' : 's'} total</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-9 py-2.5 text-[13px] font-semibold text-brand-primary outline-none focus:border-brand-primary/30 focus:bg-white sm:w-[190px]"
                    placeholder="Search"
                  />
                </div>
                <select
                  value={paymentTypeFilter}
                  onChange={(event) => setPaymentTypeFilter(event.target.value as ProjectPaymentType | '')}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-[13px] font-semibold text-brand-primary outline-none focus:border-brand-primary/30 focus:bg-white"
                >
                  <option value="">All types</option>
                  <option value="Cash">Cash</option>
                  <option value="Installment">Installment</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value === '' ? '' : Number(event.target.value) as ProjectPaymentPlanStatus)}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-[13px] font-semibold text-brand-primary outline-none focus:border-brand-primary/30 focus:bg-white"
                >
                  <option value="">All status</option>
                  {STATUS_OPTIONS.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                </select>
                <button type="button" onClick={() => fetchPlans(pageNumber)} disabled={isLoading} className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-3 py-2.5 text-brand-primary hover:bg-gray-50 disabled:opacity-50">
                  <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 size={32} className="animate-spin text-brand-primary" />
              </div>
            ) : sortedPlans.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
                <CreditCard size={30} className="mb-3 text-gray-300" />
                <p className="text-[14px] font-bold text-gray-400">No payment plans yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedPlans.map((plan) => {
                  const isPlanCash = String(plan.paymentType).toLowerCase() === 'cash';
                  const statusValue = statusToValue(plan.status);
                  const isConfirming = confirmDeleteId === plan.id;

                  return (
                    <div key={plan.id} className={`rounded-2xl border p-4 transition ${form.id === plan.id ? 'border-brand-primary bg-brand-primary-soft/40' : 'border-gray-100 bg-white hover:bg-gray-50'}`}>
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-5">
                          <div>
                            <p className="text-[11px] font-bold uppercase text-gray-400">Type</p>
                            <p className="mt-1 text-[14px] font-black text-brand-primary">{plan.paymentType}</p>
                          </div>
                          <div>
                            <p className="text-[11px] font-bold uppercase text-gray-400">Down Payment</p>
                            <p className="mt-1 text-[14px] font-black text-brand-primary">{formatCurrency(plan.installmentDownPayment)}</p>
                          </div>
                          <div>
                            <p className="text-[11px] font-bold uppercase text-gray-400">Duration</p>
                            <p className="mt-1 text-[14px] font-black text-brand-primary">{isPlanCash ? 'Cash' : `${plan.installmentMonths} mo`}</p>
                          </div>
                          <div>
                            <p className="text-[11px] font-bold uppercase text-gray-400">Commission</p>
                            <p className="mt-1 text-[14px] font-black text-brand-primary">{plan.commissionRate === null ? '-' : `${plan.commissionRate}%`}</p>
                          </div>
                          <div>
                            <p className="text-[11px] font-bold uppercase text-gray-400">Status</p>
                            <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-[11px] font-black ${statusValue === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                              {statusValue === 0 ? 'Approved' : 'Sold'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => handleEdit(plan)} className="rounded-xl border border-gray-200 p-2.5 text-brand-primary transition hover:bg-white" title="Edit plan">
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(plan)}
                            disabled={deletingId === plan.id}
                            className={`inline-flex items-center gap-2 rounded-xl p-2.5 text-[12px] font-bold transition disabled:opacity-50 ${isConfirming ? 'bg-red-600 px-3 text-white' : 'border border-red-100 text-red-500 hover:bg-red-50'}`}
                            title="Delete plan"
                          >
                            {deletingId === plan.id ? <Loader2 size={16} className="animate-spin" /> : isConfirming ? <Check size={16} /> : <Trash2 size={16} />}
                            {isConfirming && 'Confirm'}
                          </button>
                        </div>
                      </div>
                      <p className="mt-3 text-[11px] font-medium text-gray-400">Created {formatDate(plan.createdAt)} by {plan.createdBy || '-'}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                <p className="text-[13px] font-semibold text-gray-400">Page {pageNumber} of {totalPages}</p>
                <div className="flex gap-2">
                  <button type="button" disabled={pageNumber <= 1} onClick={() => fetchPlans(pageNumber - 1)} className="rounded-xl border border-gray-200 px-4 py-2 text-[13px] font-bold text-brand-primary disabled:opacity-40">Previous</button>
                  <button type="button" disabled={pageNumber >= totalPages} onClick={() => fetchPlans(pageNumber + 1)} className="rounded-xl border border-gray-200 px-4 py-2 text-[13px] font-bold text-brand-primary disabled:opacity-40">Next</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 justify-end border-t border-gray-100 bg-white px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-xl bg-brand-primary px-8 py-3 text-[14px] font-bold text-white transition hover:bg-brand-primary-hover">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
