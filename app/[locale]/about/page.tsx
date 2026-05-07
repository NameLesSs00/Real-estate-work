'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function AboutPage() {
  const { t, language } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-white pt-32 overflow-hidden">
      {/* Vision & Mission Section */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-20 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col gap-12"
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-[28px] md:text-[34px] font-radley text-[#1B2134]">{t('aboutPage.visionTitle')}</h2>
            <p className="text-[15px] md:text-[17px] text-[#555555] leading-relaxed font-poppins">
              {t('aboutPage.visionText')}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-[28px] md:text-[34px] font-radley text-[#1B2134]">{t('aboutPage.missionTitle')}</h2>
            <p className="text-[15px] md:text-[17px] text-[#555555] leading-relaxed font-poppins">
              {t('aboutPage.missionText')}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-[32px] md:text-[42px] font-radley text-[#1B2134] leading-tight">{t('aboutPage.journeyTitle')}</h2>
            <p className="text-[15px] md:text-[17px] text-[#555555] leading-relaxed font-poppins">
              {t('aboutPage.journeyText')}
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-[600px] aspect-[4/5]">
            <Image 
              src="/assists/aboutUs/aboutUS.png" 
              alt={t('aboutPage.visionTitle') as string} 
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>
      </section>

      {/* What We Offer? Section */}
      <section className="w-full px-6 md:px-12 py-24">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[38px] md:text-[52px] font-radley text-[#1B2134] text-center mb-16"
        >
          {t('aboutPage.offerTitle')}
        </motion.h2>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
        >
          {/* Card 1: Property Sales */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="bg-[#F8F5F080] rounded-[40px] px-8 py-12 flex flex-col items-center text-center gap-6"
          >
            <div className="w-28 h-28 bg-[#F8F5F080] rounded-full flex items-center justify-center">
              <Image src="/assists/aboutUs/money.png" alt={t('aboutPage.offers.sales.title') as string} width={64} height={64} />
            </div>
            <h3 className="text-[22px] md:text-[26px] font-semibold text-[#1B2134] font-poppins">{t('aboutPage.offers.sales.title')}</h3>
            <p className="text-[15px] md:text-[17px] text-[#666] leading-relaxed font-poppins max-w-[450px]">
              {t('aboutPage.offers.sales.text')}
            </p>
          </motion.div>

          {/* Card 2: Property Rentals */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="bg-[#F8F5F080] rounded-[40px] px-8 py-12 flex flex-col items-center text-center gap-6"
          >
            <div className="w-28 h-28 bg-[#F8F5F080] rounded-full flex items-center justify-center">
              <Image src="/assists/aboutUs/home.png" alt={t('aboutPage.offers.rentals.title') as string} width={64} height={64} />
            </div>
            <h3 className="text-[22px] md:text-[26px] font-semibold text-[#1B2134] font-poppins">{t('aboutPage.offers.rentals.title')}</h3>
            <p className="text-[15px] md:text-[17px] text-[#666] leading-relaxed font-poppins max-w-[450px]">
              {t('aboutPage.offers.rentals.text')}
            </p>
          </motion.div>

          {/* Card 3: Investment Opportunities */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="bg-[#F8F5F080] rounded-[40px] px-8 py-12 flex flex-col items-center text-center gap-6"
          >
            <div className="w-28 h-28 bg-[#F8F5F080] rounded-full flex items-center justify-center">
              <Image src="/assists/aboutUs/sun.png" alt={t('aboutPage.offers.investment.title') as string} width={64} height={64} />
            </div>
            <h3 className="text-[22px] md:text-[26px] font-semibold text-[#1B2134] font-poppins">{t('aboutPage.offers.investment.title')}</h3>
            <p className="text-[15px] md:text-[17px] text-[#666] leading-relaxed font-poppins max-w-[450px]">
              {t('aboutPage.offers.investment.text')}
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full h-[450px] md:h-[550px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{ 
              backgroundImage: 'url("/assists/aboutUs/image.jpg")',
            }}
          ></div>
          <div className="absolute inset-0 bg-[#1B2134B2]"></div>
        </div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-[1000px] mx-auto px-6 text-center text-white flex flex-col items-center gap-6"
        >
          <h2 className="text-[36px] md:text-[60px] font-bold font-poppins leading-tight">
            {t('aboutPage.ctaTitle')}
          </h2>
          <p className="text-[16px] md:text-[22px] font-poppins opacity-90 max-w-[750px]">
            {t('aboutPage.ctaSubtitle')}
          </p>
          <Link 
            href={`/${language}/#contact`} 
            className="mt-4 bg-white text-[#1B2134] px-14 py-4 rounded-full font-bold text-[18px] hover:bg-[#F8F5F0] transition-all transform hover:scale-105"
          >
            {t('aboutPage.contactBtn')}
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
