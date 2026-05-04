'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getLocations, Location } from '@/lib/api/locations';
import './PopularSpots.css';

// Fallback images for known locations
const SPOT_IMAGES: Record<string, string> = {
  'El Gouna': '/assists/PopularSpots/ElGuona.png',
  'El Guona': '/assists/PopularSpots/ElGuona.png',
  'Sahl Hasheesh': '/assists/PopularSpots/ShalHasheesh.png',
  'Hurghada': '/assists/PopularSpots/Hurghada.png',
  'Soma Bay': '/assists/PopularSpots/SomaBay.png',
  'Makadi': '/assists/PopularSpots/Makadi.png',
  'Makadi Heights': '/assists/PopularSpots/Makadi.png',
};

const DEFAULT_SPOT_IMAGE = '/assists/PopularSpots/Hurghada.png';

const SPOT_CLASSES = [
  'spot-card--el-guona',
  'spot-card--sahl-hasheesh',
  'spot-card--hurghada',
  'spot-card--soma-bay',
  'spot-card--makadi',
];

const PopularSpots = () => {
  const [spots, setSpots] = useState<{ name: string; district: string; count: number; image: string; className: string; city: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getLocations(1);
        const items: Location[] = data.items ?? [];
        // Group by city and get unique cities
        const cityMap: Record<string, { district: string; count: number }> = {};
        items.forEach(loc => {
          const city = loc.city;
          if (!city) return;
          if (!cityMap[city]) cityMap[city] = { district: loc.district || '', count: 0 };
          cityMap[city].count++;
        });
        const cities = Object.entries(cityMap).slice(0, 5).map(([city, info], idx) => ({
          name: city,
          district: info.district,
          count: info.count,
          city,
          image: SPOT_IMAGES[city] || DEFAULT_SPOT_IMAGE,
          className: SPOT_CLASSES[idx % SPOT_CLASSES.length],
        }));
        // If API has no locations yet, use static fallback
        if (cities.length === 0) {
          setSpots([
            { name: 'El Gouna', district: '', count: 0, city: 'El Gouna', image: '/assists/PopularSpots/ElGuona.png', className: 'spot-card--el-guona' },
            { name: 'Sahl Hasheesh', district: '', count: 0, city: 'Sahl Hasheesh', image: '/assists/PopularSpots/ShalHasheesh.png', className: 'spot-card--sahl-hasheesh' },
            { name: 'Hurghada', district: '', count: 0, city: 'Hurghada', image: '/assists/PopularSpots/Hurghada.png', className: 'spot-card--hurghada' },
            { name: 'Soma Bay', district: '', count: 0, city: 'Soma Bay', image: '/assists/PopularSpots/SomaBay.png', className: 'spot-card--soma-bay' },
            { name: 'Makadi Heights', district: '', count: 0, city: 'Makadi Heights', image: '/assists/PopularSpots/Makadi.png', className: 'spot-card--makadi' },
          ]);
        } else {
          setSpots(cities);
        }
      } catch {
        // Static fallback on error
        setSpots([
          { name: 'El Gouna', district: '', count: 0, city: 'El Gouna', image: '/assists/PopularSpots/ElGuona.png', className: 'spot-card--el-guona' },
          { name: 'Sahl Hasheesh', district: '', count: 0, city: 'Sahl Hasheesh', image: '/assists/PopularSpots/ShalHasheesh.png', className: 'spot-card--sahl-hasheesh' },
          { name: 'Hurghada', district: '', count: 0, city: 'Hurghada', image: '/assists/PopularSpots/Hurghada.png', className: 'spot-card--hurghada' },
          { name: 'Soma Bay', district: '', count: 0, city: 'Soma Bay', image: '/assists/PopularSpots/SomaBay.png', className: 'spot-card--soma-bay' },
          { name: 'Makadi Heights', district: '', count: 0, city: 'Makadi Heights', image: '/assists/PopularSpots/Makadi.png', className: 'spot-card--makadi' },
        ]);
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
          <span className="popular-spots-tag">Popular Spots</span>
          <h2 className="popular-spots-title">Explore Prime <span>Locations</span></h2>
          <p className="popular-spots-subtitle">From the lagoons of El Gouna to the beaches of Sahl Hasheesh — find your perfect corner of the Red Sea.</p>
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
                <Link href={`/search?location=${encodeURIComponent(spot.city)}`} className="block w-full h-full">
                  <div className="spot-card-image-wrapper">
                    <Image src={spot.image} alt={spot.name} fill className="spot-card-img" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  </div>
                  <div className="spot-card-overlay" />
                  <div className="spot-card-info">
                    <p className="spot-card-name">{spot.name}</p>
                    <p className="spot-card-count">{spot.count > 0 ? `${spot.count} Propert${spot.count === 1 ? 'y' : 'ies'}` : 'Explore Area'}</p>
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
