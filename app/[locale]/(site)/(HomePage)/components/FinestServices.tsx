'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';

const stats = [
  {
    image: '/assists/finestServices/1.png',
    value: '$100M',
    labelKey: 'finestServices.stats.currentListingVolume',
  },
  {
    image: '/assists/finestServices/2.png',
    value: '$400M',
    labelKey: 'finestServices.stats.totalSold',
  },
  {
    image: '/assists/finestServices/3.png',
    value: '$2B',
    labelKey: 'finestServices.stats.lifetimeSales',
  },
  {
    image: '/assists/finestServices/4.png',
    value: '$100M',
    labelKey: 'finestServices.stats.currentListingVolume',
  },
];

const FinestServices = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-6 relative z-10">
      <div className="container mx-auto max-w-[1280px]">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-[36px] md:text-[48px] font-serif text-[#000000] mb-6"
          >
            {t('finestServices.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-500 text-[15px] leading-relaxed"
          >
            {t('finestServices.subtitle')}
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-white rounded-[24px] p-8 flex flex-col items-center text-center shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="relative w-24 h-24 mb-6">
                <Image 
                  src={stat.image} 
                  alt={t(stat.labelKey)} 
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-[#000000] font-serif font-medium text-[40px] leading-none mb-3">
                {stat.value}
              </h3>
              <p className="text-[#000000]/60 text-[11px] font-bold uppercase tracking-wider">
                {t(stat.labelKey)}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FinestServices;
