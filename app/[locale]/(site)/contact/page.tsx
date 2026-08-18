'use client';

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { createContact, ContactType, HearFrom } from "@/lib/api/contacts";
import { useLanguage } from "@/lib/contexts/LanguageContext";

const BASE = "/assists/contactUs";

const infoCards = [
  { icon: `${BASE}/message.png`, titleKey: 'contactPage.info.email', content: "info@luxe-estate.com", href: "mailto:info@luxe-estate.com" },
  { icon: `${BASE}/phone.png`, titleKey: 'contactPage.info.phone', content: "+20 102 111 1666", href: "tel:+201021111666" },
  { icon: `${BASE}/locatoin.png`, titleKey: 'contactPage.info.address', content: "Al-Kawsar, Hurghada", href: "https://maps.google.com" },
  { icon: `${BASE}/fire.png`, titleKey: 'contactPage.info.follow', socials: [
    { label: "Instagram", href: "https://www.instagram.com/p/DXu6hy4l3E1/?igsh=eHVwa3A4YmlyM2sw" },
    { label: "Facebook", href: "https://www.facebook.com/share/1Cjkb7qK75/?mibextid=wwXIfr" },
    { label: "WhatsApp", href: "https://wa.me/18005551234" },
  ]},
];

export default function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', inquiryType: '', source: '', message: '', agreed: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreed) { setError(t('contactPage.form.errorAgreed') as string); return; }
    if (!form.firstName || !form.email || !form.phone) { setError(t('contactPage.form.errorRequired') as string); return; }
    setLoading(true);
    setError('');
    try {
      await createContact({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        type: (form.inquiryType as ContactType) || 'GeneralInquiry',
        hearFrom: (form.source as HearFrom) || 'Other',
        notes: form.message,
      });
      setSuccess(true);
      setForm({ firstName: '', lastName: '', email: '', phone: '', inquiryType: '', source: '', message: '', agreed: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send your inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen font-poppins overflow-hidden bg-[#E3F2FD]">
      {/* Parallax Hero Banner */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={`${BASE}/bgImage.png`} 
            alt="Contact Us" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 text-center px-6 mt-12">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }} 
            className="text-[48px] md:text-[64px] font-radley text-white leading-tight"
          >
            {t('contactPage.title') as string}
          </motion.h1>
        </div>
      </section>

      {/* Split Content Section */}
      <section className="relative z-20 -mt-24 px-6 pb-24">
        <div className="max-w-[1440px] mx-auto bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col lg:flex-row">
          
          {/* Left Column: Contact Info */}
          <div className="lg:w-2/5 bg-[#1565C0] text-white p-10 md:p-14 flex flex-col justify-between">
            <div>
              <h2 className="text-[36px] font-radley mb-10 leading-tight">Get In Touch</h2>
              
              <div className="flex flex-col gap-10">
                {infoCards.map((card) => (
                  <motion.div 
                    key={card.titleKey} 
                    whileHover={{ x: 5 }} 
                    className="flex items-start gap-5 group"
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#42A5F5] transition-colors mt-1">
                      <Image src={card.icon} alt="Icon" width={24} height={24} className="brightness-0 invert" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[14px] text-gray-400 mb-2">{t(card.titleKey) as string}</h3>
                      {card.socials ? (
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                          {card.socials.map((s) => (
                            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-[15px] font-semibold text-white hover:text-[#42A5F5] transition-colors block">{s.label}</a>
                          ))}
                        </div>
                      ) : (
                        <a href={card.href} target={card.href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-[16px] font-bold text-white hover:text-[#42A5F5] transition-colors block leading-relaxed break-words">
                          {card.content}
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:w-3/5 p-10 md:p-14 bg-white">
            <h2 className="text-[32px] font-radley text-[#0D47A1] mb-8">{t('contactPage.form.title') as string}</h2>
            
            {success && (
              <div className="mb-8 p-5 bg-green-50 border border-green-100 rounded-2xl text-green-700 font-semibold text-[15px]">
                ✅ {t('contactPage.form.success') as string}
              </div>
            )}
            {error && (
              <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[14px]">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-gray-500">{t('contactPage.form.firstName') as string} *</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} type="text" placeholder={t('contactPage.form.placeholderFirstName') as string} required className="w-full border-b-2 border-[#BBDEFB] py-3 text-[15px] text-[#0D47A1] outline-none focus:border-[#2196F3] transition-colors placeholder:text-[#90CAF9]" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-gray-500">{t('contactPage.form.lastName') as string} *</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} type="text" placeholder={t('contactPage.form.placeholderLastName') as string} required className="w-full border-b-2 border-[#BBDEFB] py-3 text-[15px] text-[#0D47A1] outline-none focus:border-[#2196F3] transition-colors placeholder:text-[#90CAF9]" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-gray-500">{t('contactPage.form.email') as string} *</label>
                  <input name="email" value={form.email} onChange={handleChange} type="email" placeholder={t('contactPage.form.placeholderEmail') as string} required className="w-full border-b-2 border-[#BBDEFB] py-3 text-[15px] text-[#0D47A1] outline-none focus:border-[#2196F3] transition-colors placeholder:text-[#90CAF9]" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-gray-500">{t('contactPage.form.phone') as string} *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder={t('contactPage.form.placeholderPhone') as string} required className="w-full border-b-2 border-[#BBDEFB] py-3 text-[15px] text-[#0D47A1] outline-none focus:border-[#2196F3] transition-colors placeholder:text-[#90CAF9]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-gray-500">{t('contactPage.form.inquiryType') as string} *</label>
                  <select name="inquiryType" value={form.inquiryType} onChange={handleChange} required className="w-full border-b-2 border-[#BBDEFB] py-3 text-[15px] text-[#0D47A1] outline-none focus:border-[#2196F3] transition-colors appearance-none cursor-pointer">
                    <option value="" disabled>{t('contactPage.form.inquiryType') as string}</option>
                    <option value="BuyUnit">{t('contactPage.form.inquiryOptions.buy') as string}</option>
                    <option value="SellUnit">{t('contactPage.form.inquiryOptions.sell') as string}</option>
                    <option value="RentUnit">{t('contactPage.form.inquiryOptions.rent') as string}</option>
                    <option value="Other">{t('contactPage.form.inquiryOptions.other') as string}</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-gray-500">{t('contactPage.form.source') as string} *</label>
                  <select name="source" value={form.source} onChange={handleChange} required className="w-full border-b-2 border-[#BBDEFB] py-3 text-[15px] text-[#0D47A1] outline-none focus:border-[#2196F3] transition-colors appearance-none cursor-pointer">
                    <option value="" disabled>{t('contactPage.form.source') as string}</option>
                    <option value="SocialMedia">{t('contactPage.form.sourceOptions.social') as string}</option>
                    <option value="Friend">{t('contactPage.form.sourceOptions.referral') as string}</option>
                    <option value="SearchEngine">{t('contactPage.form.sourceOptions.search') as string}</option>
                    <option value="Advertisement">{t('contactPage.form.sourceOptions.ads') as string}</option>
                    <option value="SEO">{t('contactPage.form.sourceOptions.seo') as string}</option>
                    <option value="Other">{t('contactPage.form.sourceOptions.other') as string}</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <label className="text-[13px] font-semibold text-gray-500">{t('contactPage.form.message') as string} *</label>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder={t('contactPage.form.placeholderMessage') as string} rows={4} required className="w-full border-b-2 border-[#BBDEFB] py-3 text-[15px] text-[#0D47A1] outline-none focus:border-[#2196F3] transition-colors resize-none placeholder:text-[#90CAF9]" />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input name="agreed" type="checkbox" checked={form.agreed} onChange={handleChange} required className="w-5 h-5 rounded border-gray-300 accent-[#2196F3] cursor-pointer" />
                  <span className="text-[13px] text-gray-500 max-w-xs leading-snug">{t('contactPage.form.agreed') as string}</span>
                </label>
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  type="submit" 
                  disabled={loading} 
                  className="bg-[#1565C0] text-white px-10 py-4 rounded-full font-bold text-[15px] hover:bg-[#2196F3] shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? t('contactPage.form.sending') as string : t('contactPage.form.submit') as string}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
