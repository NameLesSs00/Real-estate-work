'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Handshake } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/LanguageContext';

const steps = [
  {
    icon: Home,
    titleKey: 'howItWorks.cards.sell.title',
    descKey: 'howItWorks.cards.sell.desc',
    link: '/contact',
  },
  {
    icon: Handshake,
    titleKey: 'howItWorks.cards.buy.title',
    descKey: 'howItWorks.cards.buy.desc',
    link: '/properties?unitType=Buy',
  },
];

const HowItWorks = () => {
  const { t, language } = useLanguage();

  return (
    <section 
      className="relative w-full py-24 bg-fixed bg-cover bg-center" 
      style={{ backgroundImage: "url('/assists/HowItWorks/313198c8ba26169d67a012922bcfbbbcaf9f85c1.png')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 max-w-[1280px]">
        
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-[36px] md:text-[56px] font-serif text-white leading-tight"
          >
            {t('howItWorks.headlineTop')}
            <br />
            {t('howItWorks.headlineBottom')}
          </motion.h2>
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-brand-secondary text-[40px] md:text-[56px] font-medium ml-32 md:ml-64 -mt-4 md:-mt-8"
            style={{ fontFamily: 'var(--font-dancing-script)' }}
          >
            {t('howItWorks.accent')}
          </motion.span>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-[24px] p-8 flex flex-col items-center text-center shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-brand-secondary flex items-center justify-center text-white mb-6">
                <step.icon size={28} />
              </div>
              <h3 className="text-brand-primary font-bold text-[22px] mb-4">{t(step.titleKey)}</h3>
              <p className="text-gray-500 text-[15px] leading-relaxed mb-6">
                {t(step.descKey)}
              </p>
              <Link 
                href={`/${language}${step.link}`}
                className="text-brand-primary font-semibold text-[14px] hover:text-brand-secondary transition-colors mt-auto flex items-center gap-2"
              >
                {t('howItWorks.readMore')} &rarr;
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
