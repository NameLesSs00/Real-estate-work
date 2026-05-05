import React, { useState } from 'react';
import { UnitDetail } from '@/lib/api/projects';
import { PaymentPlan, createPaymentPlan, deletePaymentPlan } from '@/lib/api/paymentPlans';

interface UnitPaymentPlansProps {
  unit: UnitDetail;
  extraPlans: PaymentPlan[];
  fetchUnit: () => Promise<void>;
  setError: (err: string) => void;
}

export default function UnitPaymentPlans({ unit, extraPlans, fetchUnit, setError }: UnitPaymentPlansProps) {
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [newPlan, setNewPlan] = useState({
    paymentType: 'Installment',
    installmentMonths: 12,
    installmentDownPayment: 10
  });
  const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);

  const handleAddPlan = async () => {
    setIsSubmittingPlan(true);
    try {
      const id = unit.Id || unit.id;
      if (!id) throw new Error('Unit ID not found');
      await createPaymentPlan({
        unitId: id,
        paymentType: newPlan.paymentType,
        installmentDownPayment: newPlan.installmentDownPayment,
        installmentYears: Math.ceil(newPlan.installmentMonths / 12),
        installmentMonths: newPlan.installmentMonths
      });
      await fetchUnit();
      setIsAddingPlan(false);
      setNewPlan({ paymentType: 'Installment', installmentMonths: 12, installmentDownPayment: 10 });
    } catch (err) {
      console.error('[UnitPaymentPlans] Add plan error:', err);
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
      console.error('[UnitPaymentPlans] Delete plan error:', err);
      setError('Failed to delete payment plan.');
    }
  };

  const combinedPlans = [
    ...(unit.paymentPlans || []),
    ...extraPlans
  ];
  
  // Deduplicate by ID if both sources return same plans
  const uniquePlans = Array.from(new Map(combinedPlans.map(p => [p.id || `${p.paymentType}-${p.installmentMonths}-${p.installmentDownPayment}`, p])).values());

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[17px] font-bold text-[#16273B]">Payment Plans</h4>
        <button 
          onClick={() => setIsAddingPlan(!isAddingPlan)}
          className="text-[13px] font-semibold text-[#16273B] bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
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
            className="w-full bg-[#16273B] text-white font-bold py-2.5 rounded-xl text-[14px] hover:bg-[#1a304a] transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmittingPlan ? 'Adding...' : 'Confirm Add Plan'}
          </button>
        </div>
      )}

      {uniquePlans.length === 0 && !isAddingPlan ? (
        <p className="text-[14px] text-gray-400 italic">No payment plans defined for this unit.</p>
      ) : (
        <div className="space-y-3">
          {uniquePlans.map((plan, i) => {
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
                    <p className="text-[#16273B] font-bold">{unit.currencyCode || unit.CurrencyCode || 'EGP'} {downPayment.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-gray-400">Status</p>
                    <p className="text-[#16273B] font-bold">{status}</p>
                  </div>
                </div>
                {planId && (
                  <button 
                    onClick={() => handleDeletePlan(planId)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:bg-red-50 p-2 rounded-lg cursor-pointer"
                    title="Delete Plan"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
