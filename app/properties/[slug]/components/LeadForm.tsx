'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { createLead } from '@/lib/api/leads';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface LeadFormProps {
  unitId: number;
}

const icoSend = "/assists/PropertyDetails/send.png";

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
      <div className="bg-white border border-[#ECECEC] rounded-[14px] p-8 lg:p-10 shadow-sm flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
          <CheckCircle2 className="text-green-500" size={32} />
        </div>
        <h3 className="text-[20px] font-bold text-gray-900 font-poppins">{t('projectDetails.requestSent') as string}</h3>
        <p className="text-[14px] text-gray-500 font-poppins">
          {t('projectDetails.requestSentSubtitle') as string}
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="text-[#1B2134] font-semibold text-[14px] underline cursor-pointer"
        >
          {t('projectDetails.sendAnother') as string}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#ECECEC] rounded-[14px] p-8 lg:p-10 shadow-sm">
      <h3 className="text-[18px] font-bold text-gray-900 text-center mb-5 font-poppins">
        {t('projectDetails.getInTouch') as string}
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-[13px] font-medium text-gray-700 mb-1.5 block font-poppins">
            {t('projectDetails.fullName') as string} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder={t('projectDetails.fullName') as string}
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full border border-[#E0E0E0] rounded-[8px] px-3.5 py-2.5 text-[13px] font-poppins placeholder:text-gray-300 outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        <div>
          <label className="text-[13px] font-medium text-gray-700 mb-1.5 block font-poppins">
            {t('projectDetails.whatsappNumber') as string} <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            placeholder={t('projectDetails.whatsappNumber') as string}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full border border-[#E0E0E0] rounded-[8px] px-3.5 py-2.5 text-[13px] font-poppins placeholder:text-gray-300 outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        <div>
          <label className="text-[13px] font-medium text-gray-700 mb-1.5 block font-poppins">
            {t('projectDetails.email') as string}
          </label>
          <input
            type="email"
            placeholder={t('projectDetails.email') as string}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border border-[#E0E0E0] rounded-[8px] px-3.5 py-2.5 text-[13px] font-poppins placeholder:text-gray-300 outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        <div>
          <label className="text-[13px] font-medium text-gray-700 mb-1.5 block font-poppins">
            {t('projectDetails.message') as string}
          </label>
          <textarea
            placeholder={t('projectDetails.message') as string}
            rows={4}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full border border-[#E0E0E0] rounded-[8px] px-3.5 py-2.5 text-[13px] font-poppins placeholder:text-gray-300 outline-none focus:border-gray-400 transition-colors resize-none"
          />
        </div>

        {error && <p className="text-red-500 text-[12px] font-poppins">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1B2134] text-white rounded-full py-3 text-[14px] font-semibold font-poppins flex items-center justify-center gap-2 hover:bg-[#2d3555] transition-all mt-1 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              {t('contactPage.form.sending') as string}
            </>
          ) : (
            <>
              {t('projectDetails.bookVisit') as string}
              <Image src={icoSend} alt="Send" width={15} height={15} className="w-[15px] h-[15px] invert" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
