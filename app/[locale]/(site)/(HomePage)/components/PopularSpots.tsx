'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';

const CURATED_SPOTS = [
  { name: 'El Gouna', id: 4, image: '/assists/PopularSpots/ElGuona.png' },
  { name: 'Sahl Hasheesh', id: 5, image: '/assists/PopularSpots/ShalHasheesh.png' },
  { name: 'Hurghada', id: 6, image: '/assists/PopularSpots/Hurghada.png' },
  { name: 'Soma Bay', id: 7, image: '/assists/PopularSpots/SomaBay.png' },
  { name: 'Makadi Heights', id: 8, image: '/assists/PopularSpots/Makadi.png' },
];

const PopularSpots = () => {
  const { t, language } = useLanguage();

  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="container mx-auto max-w-[1280px]">
        
        {/* Header */}
        <div className="text-center mb-16 flex flex-col md:flex-row items-center justify-center gap-4">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-[36px] md:text-[48px] font-serif text-[#000000] leading-tight"
          >
            {t('popularSpots.headline')}
          </motion.h2>
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[#2196F3] text-[40px] md:text-[56px] font-medium"
            style={{ fontFamily: 'var(--font-dancing-script)' }}
          >
            {t('popularSpots.accent')}
          </motion.span>
        </div>

        {/* Bento Grid */}
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-50px" }} 
          variants={{ 
            hidden: { opacity: 0 }, 
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } } 
          }} 
          className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[1200px] md:h-[600px]"
        >
          {CURATED_SPOTS.map((spot, index) => {
            // First spot gets the large 2x2 area
            const isLarge = index === 0;
            return (
              <motion.div 
                key={spot.name} 
                variants={{ 
                  hidden: { opacity: 0, scale: 0.95 }, 
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } } 
                }} 
                className={`group relative overflow-hidden rounded-[24px] shadow-lg ${isLarge ? 'md:col-span-2 md:row-span-2' : 'col-span-1 row-span-1'}`}
              >
                <Link href={`/${language}/properties?locationId=${spot.id}`} className="block w-full h-full relative">
                  <Image 
                    src={spot.image} 
                    alt={spot.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute bottom-6 left-6 right-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-serif text-[28px] md:text-[36px] font-bold leading-tight mb-1 shadow-sm">
                      {spot.name}
                    </h3>
                    <p className="text-[#2196F3] font-semibold text-[15px] uppercase tracking-wider">
                      {t('popularSpots.exploreArea')}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default PopularSpots;
