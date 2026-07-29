'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { createContact, ContactType, HearFrom } from "@/lib/api/contacts";
import { useLanguage } from "@/lib/contexts/LanguageContext";

const BASE = "/assists/contactUs";
const STARS_BASE = "/assists/Properties";

const infoCards = [
  { icon: `${BASE}/message.png`, titleKey: 'contactPage.info.email', content: "info@winners-realty.com", href: "mailto:info@winners-realty.com" },
  { icon: `${BASE}/phone.png`, titleKey: 'contactPage.info.phone', content: "+20 102 111 1666", href: "tel:+201021111666" },
  { icon: `${BASE}/locatoin.png`, titleKey: 'contactPage.info.address', content: "Al-Kawsar, Hurghada — above El Khedawy Restaurant", href: "https://maps.google.com" },
  { icon: `${BASE}/fire.png`, titleKey: 'contactPage.info.follow', socials: [
    { label: "Instagram", href: "https://www.instagram.com/p/DXu6hy4l3E1/?igsh=eHVwa3A4YmlyM2sw" },
    { label: "Facebook", href: "https://www.facebook.com/share/1Cjkb7qK75/?mibextid=wwXIfr" },
    { label: "WhatsApp", href: "https://wa.me/message/2CFJ7MIUOG3AM1" },
  ]},
];

export default function ContactPage() {
  const { t, language } = useLanguage();
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
    <main className="min-h-screen font-poppins overflow-hidden">
      {/* Hero + Info Cards */}
      <section className="bg-white pt-24 md:pt-36 pb-20 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <motion.h1 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-[28px] sm:text-[36px] md:text-[48px] font-bold text-[#1B2134] mb-4 leading-tight">
            {t('contactPage.title') as string}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="text-[16px] text-gray-500 max-w-2xl leading-relaxed mb-14">
            {t('contactPage.subtitle') as string}
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {infoCards.map((card) => {
              const translatedTitle = t(card.titleKey) as string;
              return (
                <motion.div key={card.titleKey} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} whileHover={{ y: -8, transition: { duration: 0.2 } }} className="relative bg-[#F8F5F0] border border-[#ECECEC] rounded-[14px] p-10 flex flex-col items-center justify-center gap-6 shadow-sm hover:shadow-xl transition-all duration-300 group min-h-[220px]">
                  <div className="absolute top-6 right-6 opacity-60 group-hover:opacity-100 transition-opacity"><Image src={`${BASE}/link.png`} alt="link" width={22} height={22} /></div>
                  <div className="flex items-center justify-center"><Image src={card.icon} alt={translatedTitle} width={80} height={80} className="object-contain" /></div>
                  <div className="text-center">
                    {card.socials ? (
                    <div className="flex flex-wrap justify-center gap-3">
                      {card.socials.map((s) => <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-[15px] font-semibold text-[#1B2134] underline hover:text-[#D59E52] transition-colors">{s.label}</a>)}
                    </div>
                  ) : (
                    <a href={card.href} target={card.href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-[16px] font-bold text-[#1B2134] hover:text-[#D59E52] transition-colors leading-snug">{card.content}</a>
                  )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex items-end gap-2 mb-3">
            <Image src={`${STARS_BASE}/star1.png`} alt="star" width={24} height={24} />
            <Image src={`${STARS_BASE}/star2.png`} alt="star" width={18} height={18} className="mb-0.5" />
            <Image src={`${STARS_BASE}/star3.png`} alt="star" width={12} height={12} className="mb-1" />
          </motion.div>
          {success && (
            <div className="mb-6 p-5 bg-green-50 border border-green-100 rounded-2xl text-green-700 font-semibold text-[15px]">
              ✅ {t('contactPage.form.success') as string}
            </div>
          )}
          {error && (
            <div className="mb-6 p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[14px]">{error}</div>
          )}

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="bg-[#F0EBE3] rounded-[20px] p-6 sm:p-8 md:p-12 shadow-sm">
            <h2 className="text-[24px] sm:text-[32px] md:text-[40px] font-bold text-[#1B2134] mb-2">{t('contactPage.form.title') as string}</h2>
            <p className="text-[15px] text-gray-500 mb-8">{t('contactPage.form.subtitle') as string}</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#1B2134]">{t('contactPage.form.firstName') as string} <span className="text-red-400">*</span></label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} type="text" placeholder={t('contactPage.form.placeholderFirstName') as string} required className="bg-white border border-[#E0E0E0] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:border-[#1B2134] transition-colors placeholder:text-gray-300" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#1B2134]">{t('contactPage.form.lastName') as string} <span className="text-red-400">*</span></label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} type="text" placeholder={t('contactPage.form.placeholderLastName') as string} required className="bg-white border border-[#E0E0E0] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:border-[#1B2134] transition-colors placeholder:text-gray-300" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#1B2134]">{t('contactPage.form.email') as string} <span className="text-red-400">*</span></label>
                  <input name="email" value={form.email} onChange={handleChange} type="email" placeholder={t('contactPage.form.placeholderEmail') as string} required className="bg-white border border-[#E0E0E0] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:border-[#1B2134] transition-colors placeholder:text-gray-300" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#1B2134]">{t('contactPage.form.phone') as string} <span className="text-red-400">*</span></label>
                  <input name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder={t('contactPage.form.placeholderPhone') as string} required className="bg-white border border-[#E0E0E0] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:border-[#1B2134] transition-colors placeholder:text-gray-300" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#1B2134]">{t('contactPage.form.inquiryType') as string} <span className="text-red-400">*</span></label>
                  <select name="inquiryType" value={form.inquiryType} onChange={handleChange} required className="bg-white border border-[#E0E0E0] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:border-[#1B2134] transition-colors text-[#1B2134] appearance-none cursor-pointer">
                    <option value="">{t('contactPage.form.inquiryType') as string}</option>
                    <option value="BuyUnit">{t('contactPage.form.inquiryOptions.buy') as string}</option>
                    <option value="SellUnit">{t('contactPage.form.inquiryOptions.sell') as string}</option>
                    <option value="RentUnit">{t('contactPage.form.inquiryOptions.rent') as string}</option>
                    <option value="Other">{t('contactPage.form.inquiryOptions.other') as string}</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#1B2134]">{t('contactPage.form.source') as string} <span className="text-red-400">*</span></label>
                  <select name="source" value={form.source} onChange={handleChange} required className="bg-white border border-[#E0E0E0] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:border-[#1B2134] transition-colors text-[#1B2134] appearance-none cursor-pointer">
                    <option value="">{t('contactPage.form.source') as string}</option>
                    <option value="SocialMedia">{t('contactPage.form.sourceOptions.social') as string}</option>
                    <option value="Friend">{t('contactPage.form.sourceOptions.referral') as string}</option>
                    <option value="SearchEngine">{t('contactPage.form.sourceOptions.search') as string}</option>
                    <option value="Advertisement">{t('contactPage.form.sourceOptions.ads') as string}</option>
                    <option value="SEO">{t('contactPage.form.sourceOptions.seo') as string}</option>
                    <option value="Other">{t('contactPage.form.sourceOptions.other') as string}</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#1B2134]">{t('contactPage.form.message') as string} <span className="text-red-400">*</span></label>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder={t('contactPage.form.placeholderMessage') as string} rows={6} required className="bg-white border border-[#E0E0E0] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:border-[#1B2134] transition-colors resize-none placeholder:text-gray-300" />
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input name="agreed" type="checkbox" checked={form.agreed} onChange={handleChange} required className="w-4 h-4 rounded border-gray-300 accent-[#1B2134] cursor-pointer" />
                  <span className="text-[13px] text-gray-500">{t('contactPage.form.agreed') as string}</span>
                </label>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" disabled={loading} className="flex items-center gap-3 bg-[#1B2134] text-white px-8 py-3.5 rounded-full font-semibold text-[15px] hover:bg-[#2d3555] shadow-lg transition-all duration-300 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
                  {loading ? t('contactPage.form.sending') as string : t('contactPage.form.submit') as string}
                  {!loading && <Image src={`${BASE}/send.png`} alt="Send" width={16} height={16} className="brightness-0 invert" />}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-white py-24 px-6 overflow-hidden text-center">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 0.4 }} viewport={{ once: true }} transition={{ duration: 1.5 }} className="absolute inset-0 pointer-events-none">
          <Image src={`${BASE}/bgImage.png`} alt="background pattern" fill className="object-cover" />
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="relative z-10 max-w-[1200px] mx-auto pt-16 px-4">
          <h2 className="text-[26px] sm:text-[36px] md:text-[52px] font-bold text-[#1B2134] leading-tight mb-6">
            {t('contactPage.cta.title') as string}
          </h2>
          <p className="text-[16px] text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
            {t('contactPage.cta.subtitle') as string}
          </p>
          <Link href={`/${language}/properties`} className="inline-block bg-[#1B2134] text-white font-bold px-10 py-4 rounded-full text-[16px] hover:bg-[#D59E52] transition-all duration-300 shadow-xl hover:scale-110 active:scale-95">
            {t('contactPage.cta.btn') as string}
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
