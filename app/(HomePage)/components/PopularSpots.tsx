'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import './PopularSpots.css';

const spots = [
  {
    name: 'El Guona',
    count: '10 Properties',
    image: '/assists/PopularSpots/ElGuona.png',
    className: 'spot-card--el-guona',
  },
  {
    name: 'Sahl Hasheesh',
    count: '10 Properties',
    image: '/assists/PopularSpots/ShalHasheesh.png',
    className: 'spot-card--sahl-hasheesh',
  },
  {
    name: 'Hurghada South',
    count: '10 Properties',
    image: '/assists/PopularSpots/Hurghada.png',
    className: 'spot-card--hurghada',
  },
  {
    name: 'Soma Bay',
    count: '10 Properties',
    image: '/assists/PopularSpots/SomaBay.png',
    className: 'spot-card--soma-bay',
  },
  {
    name: 'Makadi Heights',
    count: '10 Properties',
    image: '/assists/PopularSpots/Makadi.png',
    className: 'spot-card--makadi',
  },
];

const PopularSpots = () => {
  return (
    <section className="popular-spots-section overflow-hidden">
      <div className="popular-spots-container">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="popular-spots-header"
        >
          <span className="popular-spots-tag">Popular Spots</span>
          <h2 className="popular-spots-title">
            Explore Prime <span>Locations</span>
          </h2>
          <p className="popular-spots-subtitle">
            From the lagoons of El Gouna to the beaches of Sahl Hasheesh — find your perfect
            corner of the Red Sea.
          </p>
          <div className="popular-spots-accent-line" />
        </motion.div>

        {/* Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="popular-spots-grid"
        >
          {spots.map((spot) => (
            <motion.div 
              key={spot.name} 
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.7, ease: "easeOut" }
                }
              }}
              className={`spot-card ${spot.className}`}
            >
              <div className="spot-card-image-wrapper">
                <Image
                  src={spot.image}
                  alt={spot.name}
                  fill
                  className="spot-card-img"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="spot-card-overlay" />
              <div className="spot-card-info">
                <p className="spot-card-name">{spot.name}</p>
                <p className="spot-card-count">{spot.count}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PopularSpots;
