'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getLocations, Location } from '@/lib/api/locations';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import './PopularSpots.css';

const CURATED_SPOTS = [
  { name: 'El Gouna', id: 8, cityKeys: ['elgouna', 'gouna', 'elguona'], image: '/assists/PopularSpots/ElGuona.png', className: 'spot-card--el-guona' },
  { name: 'Sahl Hasheesh', id: 6, cityKeys: ['sahlhasheesh', 'shalhasheesh'], image: '/assists/PopularSpots/ShalHasheesh.png', className: 'spot-card--sahl-hasheesh' },
  { name: 'Hurghada', id: 4, cityKeys: ['hurghada'], image: '/assists/PopularSpots/Hurghada.png', className: 'spot-card--hurghada' },
  { name: 'Soma Bay', id: 9, cityKeys: ['somabay'], image: '/assists/PopularSpots/SomaBay.png', className: 'spot-card--soma-bay' },
  { name: 'Makadi Heights', id: 10, cityKeys: ['makadi', 'makadiheights'], image: '/assists/PopularSpots/Makadi.png', className: 'spot-card--makadi' },
];

const PopularSpots = () => {
  const { t, language } = useLanguage();
  const [spots, setSpots] = useState<{ name: string; count: number; image: string; className: string; id: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getLocations(1);
        const items: Location[] = data.items ?? [];
        
        // Count properties per normalized city name
        const cityCounts: Record<string, number> = {};
        items.forEach(loc => {
          if (!loc.city) return;
          const normalized = loc.city.toLowerCase().replace(/\s+/g, '');
          cityCounts[normalized] = (cityCounts[normalized] || 0) + 1;
        });

        // Build the final spots array based purely on the curated list
        const finalSpots = CURATED_SPOTS.map(spot => {
          // Find the total count by checking all possible keys for this city
          const count = spot.cityKeys.reduce((total, key) => total + (cityCounts[key] || 0), 0);
          return {
            name: spot.name,
            count: count,
            image: spot.image,
            className: spot.className,
            id: spot.id
          };
        });

        setSpots(finalSpots);
      } catch {
        // Fallback to 0 counts on error
        setSpots(CURATED_SPOTS.map(spot => ({
          name: spot.name,
          count: 0,
          image: spot.image,
          className: spot.className,
          id: spot.id
        })));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <section className="popular-spots-section overflow-hidden">
      <div className="popular-spots-container">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: "easeOut" }} className="popular-spots-header">
          <span className="popular-spots-tag">{t('popularSpots.tag')}</span>
          <h2 className="popular-spots-title" dangerouslySetInnerHTML={{ __html: t('popularSpots.title') as string }} />
          <p className="popular-spots-subtitle">{t('popularSpots.subtitle')}</p>
          <div className="popular-spots-accent-line" />
        </motion.div>

        {loading ? (
          <div className="popular-spots-grid">
            {Array(5).fill(0).map((_, i) => <div key={i} className="bg-gray-200 rounded-[20px] animate-pulse h-[220px]" />)}
          </div>
        ) : (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="popular-spots-grid">
            {spots.map((spot) => (
              <motion.div key={spot.name} variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }} className={`spot-card ${spot.className}`}>
                <Link href={`/${language}/properties?locationId=${spot.id}`} className="block w-full h-full">
                  <div className="spot-card-image-wrapper">
                    <Image src={spot.image} alt={spot.name} fill className="spot-card-img" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  </div>
                  <div className="spot-card-overlay" />
                  <div className="spot-card-info">
                    <p className="spot-card-name">{spot.name}</p>
                    <p className="spot-card-count">
                      {spot.count > 0 
                        ? `${spot.count} ${spot.count === 1 ? t('popularSpots.property') : t('popularSpots.properties')}` 
                        : t('popularSpots.exploreArea')}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PopularSpots;
