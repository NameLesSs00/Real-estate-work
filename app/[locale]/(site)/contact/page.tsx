'use client';

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { createContact, ContactType, HearFrom } from "@/lib/api/contacts";
import { useKeyValues } from "@/lib/contexts/KeyValuesContext";
import { useLanguage } from "@/lib/contexts/LanguageContext";

const BASE = "/assists/contactUs";

export default function ContactPage() {
  const { t } = useLanguage();
  const { get, getWhatsAppUrl } = useKeyValues();
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

  // Dynamic contact info from API
  const phoneVal = get('phone');
  const whatsappVal = get('whatsapp');
  const emailVal = get('email');
  const facebookVal = get('facebook');
  const whatsappUrl = whatsappVal ? getWhatsAppUrl(whatsappVal) : null;

  const infoCards = [
    ...(emailVal ? [{ icon: `${BASE}/message.png`, titleKey: 'contactPage.info.email', content: emailVal, href: `mailto:${emailVal}` }] : []),
    ...((phoneVal || whatsappVal) ? [{ icon: `${BASE}/phone.png`, titleKey: 'contactPage.info.phone', content: phoneVal || whatsappVal!, href: whatsappUrl || '#' }] : []),
    { icon: `${BASE}/phone.png`, titleKey: 'contactPage.info.phone', content: '+20 12 27978091', href: 'https://wa.me/201227978091' },
    { icon: `${BASE}/locatoin.png`, titleKey: 'contactPage.info.address', content: 'Hurghada, El Kawther', href: 'https://maps.google.com' },
    ...((facebookVal || whatsappUrl) ? [{
      icon: `${BASE}/fire.png`,
      titleKey: 'contactPage.info.follow',
      socials: [
        ...(facebookVal ? [{ label: 'Facebook', href: facebookVal }] : []),
        ...(whatsappUrl ? [{ label: 'WhatsApp', href: whatsappUrl }] : []),
      ]
    }] : []),
  ];

  return (
    <main className="min-h-screen font-poppins overflow-hidden bg-brand-bg">
      {/* Parallax Hero Banner */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={`${BASE}/bgImage.png`}
            alt={t('contactPage.title') as string}
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
          <div className="lg:w-2/5 bg-brand-primary text-white p-10 md:p-14 flex flex-col justify-between">
            <div>
              <h2 className="text-[36px] font-radley mb-10 leading-tight">{t('projectDetails.getInTouch') as string}</h2>

              <div className="flex flex-col gap-10">
                {infoCards.map((card, index) => (
                  <motion.div
                    key={`${card.titleKey}-${index}`}
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-5 group"
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-brand-secondary transition-colors mt-1">
                      <Image src={card.icon} alt="Icon" width={24} height={24} className="brightness-0 invert" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[14px] text-gray-400 mb-2">{t(card.titleKey) as string}</h3>
                      {'socials' in card ? (
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                          {card.socials!.map((s) => (
                            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-[15px] font-semibold text-white hover:text-brand-secondary transition-colors block">{s.label}</a>
                          ))}
                        </div>
                      ) : (
                        <a href={card.href} target={card.href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-[16px] font-bold text-white hover:text-brand-secondary transition-colors block leading-relaxed break-words">
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
            <h2 className="text-[32px] font-radley text-brand-primary mb-8">{t('contactPage.form.title') as string}</h2>

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl font-medium"
              >
                {t('contactPage.form.successMessage') as string}
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl font-medium"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-brand-primary ml-1">{t('contactPage.form.firstName') as string} *</label>
                  <input
                    name="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder={t('contactPage.form.firstNamePlaceholder') as string}
                    className="w-full bg-brand-bg border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all font-medium text-brand-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-brand-primary ml-1">{t('contactPage.form.lastName') as string}</label>
                  <input
                    name="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder={t('contactPage.form.lastNamePlaceholder') as string}
                    className="w-full bg-brand-bg border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all font-medium text-brand-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-brand-primary ml-1">{t('contactPage.form.email') as string} *</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={t('contactPage.form.emailPlaceholder') as string}
                    className="w-full bg-brand-bg border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all font-medium text-brand-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-brand-primary ml-1">{t('contactPage.form.phone') as string} *</label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder={t('contactPage.form.phonePlaceholder') as string}
                    className="w-full bg-brand-bg border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all font-medium text-brand-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-brand-primary ml-1">{t('contactPage.form.inquiryType') as string}</label>
                  <select
                    name="inquiryType"
                    value={form.inquiryType}
                    onChange={handleChange}
                    className="w-full bg-brand-bg border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all font-medium text-brand-primary"
                  >
                    <option value="">{t('contactPage.form.selectType') as string}</option>
                    <option value="GeneralInquiry">{t('contactPage.form.generalInquiry') as string}</option>
                    <option value="Buying">{t('contactPage.form.buying') as string}</option>
                    <option value="Selling">{t('contactPage.form.selling') as string}</option>
                    <option value="Renting">{t('contactPage.form.renting') as string}</option>
                    <option value="Investment">{t('contactPage.form.investment') as string}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-brand-primary ml-1">{t('contactPage.form.hearFrom') as string}</label>
                  <select
                    name="source"
                    value={form.source}
                    onChange={handleChange}
                    className="w-full bg-brand-bg border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all font-medium text-brand-primary"
                  >
                    <option value="">{t('contactPage.form.selectSource') as string}</option>
                    <option value="SocialMedia">{t('contactPage.form.socialMedia') as string}</option>
                    <option value="Friend">{t('contactPage.form.friend') as string}</option>
                    <option value="Advertisement">{t('contactPage.form.advertisement') as string}</option>
                    <option value="Other">{t('contactPage.form.other') as string}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[14px] font-bold text-brand-primary ml-1">{t('contactPage.form.message') as string}</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder={t('contactPage.form.messagePlaceholder') as string}
                  className="w-full bg-brand-bg border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all font-medium text-brand-primary resize-none"
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  name="agreed"
                  id="agreed"
                  type="checkbox"
                  checked={form.agreed}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 accent-brand-primary cursor-pointer"
                />
                <label htmlFor="agreed" className="text-[14px] text-brand-primary/70 font-medium cursor-pointer leading-relaxed">
                  {t('contactPage.form.agreeText') as string}
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-primary text-white py-4 rounded-2xl font-bold text-[16px] shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
              >
                {loading && (
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                )}
                {t('contactPage.form.submit') as string}
              </button>
            </form>
          </div>

        </div>
      </section>
    </main>
  );
}
