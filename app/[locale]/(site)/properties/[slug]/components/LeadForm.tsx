'use client';

import React, { useState } from 'react';

import { createLead } from '@/lib/api/leads';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface LeadFormProps {
  unitId: number;
}



export default function LeadForm({ unitId }: LeadFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await createLead({
        ...formData,
        unitId: unitId
      });
      setSuccess(true);
      setFormData({ fullName: '', email: '', phone: '', notes: '' });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white border border-brand-divider rounded-[14px] p-8 lg:p-10 shadow-sm flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
          <CheckCircle2 className="text-green-500" size={32} />
        </div>
        <h3 className="text-[20px] font-bold text-gray-900 font-poppins">{t('projectDetails.requestSent') as string}</h3>
        <p className="text-[14px] text-gray-500 font-poppins">
          {t('projectDetails.requestSentSubtitle') as string}
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="text-brand-primary font-semibold text-[14px] underline cursor-pointer"
        >
          {t('projectDetails.sendAnother') as string}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-brand-divider rounded-[14px] p-6 lg:p-10 shadow-sm">
      <h3 className="text-[18px] font-bold text-gray-900 text-center mb-5 font-poppins">
        {t('projectDetails.getInTouch') as string}
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-brand-primary">
            {t('projectDetails.fullName') as string} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder={t('projectDetails.fullName') as string}
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full border border-brand-divider rounded-[10px] px-4 py-3 text-[14px] placeholder:text-brand-muted-light outline-none focus:border-brand-secondary transition-colors font-poppins"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-brand-primary">
            {t('projectDetails.phoneNumber') as string} <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            placeholder={t('projectDetails.phoneNumber') as string}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full border border-brand-divider rounded-[10px] px-4 py-3 text-[14px] placeholder:text-brand-muted-light outline-none focus:border-brand-secondary transition-colors font-poppins"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-brand-primary">
            {t('projectDetails.email') as string} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            placeholder={t('projectDetails.email') as string}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border border-brand-divider rounded-[10px] px-4 py-3 text-[14px] placeholder:text-brand-muted-light outline-none focus:border-brand-secondary transition-colors font-poppins"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-brand-primary">
            {t('projectDetails.message') as string} <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder={t('projectDetails.message') as string}
            required
            rows={4}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full border border-brand-divider rounded-[10px] px-4 py-3 text-[14px] placeholder:text-brand-muted-light outline-none focus:border-brand-secondary transition-colors resize-none font-poppins"
          />
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            required
            className="mt-0.5 w-4 h-4 accent-brand-secondary cursor-pointer flex-shrink-0"
          />
          <label htmlFor="terms" className="text-[13px] text-brand-muted leading-snug cursor-pointer font-poppins">
            {t('projectDetails.agreeTerms') as string}
          </label>
        </div>

        {error && <p className="text-red-500 text-[12px] font-poppins">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-primary text-white rounded-full py-4 text-[15px] font-semibold flex items-center justify-center gap-3 hover:bg-brand-primary transition-all mt-1 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              {t('contactPage.form.sending') as string}
            </>
          ) : (
            <>
              {t('projectDetails.bookVisit') as string}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </form>

    </div>
  );
}
