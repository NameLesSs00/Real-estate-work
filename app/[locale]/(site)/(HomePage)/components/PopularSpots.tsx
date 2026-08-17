'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getLocations, Location } from '@/lib/api/locations';
import { useLanguage } from '@/lib/contexts/LanguageContext';

const CURATED_SPOTS = [
  { name: 'El Gouna', id: 8, cityKeys: ['elgouna', 'gouna', 'elguona'], image: '/assists/PopularSpots/ElGuona.png' },
  { name: 'Sahl Hasheesh', id: 6, cityKeys: ['sahlhasheesh', 'shalhasheesh'], image: '/assists/PopularSpots/ShalHasheesh.png' },
  { name: 'Hurghada', id: 4, cityKeys: ['hurghada'], image: '/assists/PopularSpots/Hurghada.png' },
  { name: 'Soma Bay', id: 9, cityKeys: ['somabay'], image: '/assists/PopularSpots/SomaBay.png' },
  { name: 'Makadi Heights', id: 10, cityKeys: ['makadi', 'makadiheights'], image: '/assists/PopularSpots/Makadi.png' },
];

const PopularSpots = () => {
  const { t, language } = useLanguage();
  const [spots, setSpots] = useState<{ name: string; count: number; image: string; id: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getLocations(1);
        const items: Location[] = data.items ?? [];
        
        const cityCounts: Record<string, number> = {};
        items.forEach(loc => {
          if (!loc.city) return;
          const normalized = loc.city.toLowerCase().replace(/\s+/g, '');
          cityCounts[normalized] = (cityCounts[normalized] || 0) + 1;
        });

        const finalSpots = CURATED_SPOTS.map(spot => {
          const count = spot.cityKeys.reduce((total, key) => total + (cityCounts[key] || 0), 0);
          return {
            name: spot.name,
            count: count,
            image: spot.image,
            id: spot.id
          };
        });

        setSpots(finalSpots);
      } catch {
        setSpots(CURATED_SPOTS.map(spot => ({
          name: spot.name,
          count: 0,
          image: spot.image,
          id: spot.id
        })));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
            Discover Egypt&apos;s Finest
          </motion.h2>
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[#A88849] text-[40px] md:text-[56px] font-medium"
            style={{ fontFamily: 'var(--font-dancing-script)' }}
          >
            Destinations
          </motion.span>
        </div>

        {/* Bento Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[800px] md:h-[600px]">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className={`bg-gray-200 rounded-[24px] animate-pulse ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`} />
            ))}
          </div>
        ) : (
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
            {spots.map((spot, index) => {
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
                      <p className="text-[#A88849] font-semibold text-[15px] uppercase tracking-wider">
                        {spot.count > 0 
                          ? `${spot.count} ${spot.count === 1 ? t('popularSpots.property') : t('popularSpots.properties')}` 
                          : t('popularSpots.exploreArea')}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PopularSpots;
