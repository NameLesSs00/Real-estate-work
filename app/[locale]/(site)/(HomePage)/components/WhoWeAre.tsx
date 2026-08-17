'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import './WhoWeAre.css';

const WhoWeAre = () => {
  const { t, language } = useLanguage();

  return (
    <section id="about" className="who-we-are-section overflow-hidden">
      <Image 
        src="/assists/finestServices/Ellipse 1.png" 
        alt="Background Curve" 
        width={800} 
        height={800} 
        quality={100}
        unoptimized
        className="bg-ellipse-1"
      />
      <Image 
        src="/assists/finestServices/Ellipse 2.png" 
        alt="Background Curve" 
        width={800} 
        height={800} 
        quality={100}
        unoptimized
        className="bg-ellipse-2"
      />
      
      <div className="who-we-are-container">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="who-we-are-header"
        >
          <span className="who-we-are-tag">{t('whoWeAre.tag') as string}</span>
          <h2 className="who-we-are-title">{t('whoWeAre.title') as string}</h2>
          <p className="who-we-are-subtitle">
            {t('whoWeAre.subtitle') as string}
          </p>
          <div className="who-we-are-accent-line"></div>
        </motion.div>

        <div className="who-we-are-content">
          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="who-we-are-images"
          >
            <Image 
              src="/assists/finestServices/Group 4.png" 
              alt="Who We Are Images" 
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="who-we-are-main-img"
              priority
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="who-we-are-info-box"
          >
            <div className="info-item">
              <h3 className="info-item-title">{t('whoWeAre.visionTitle') as string}</h3>
              <p className="info-item-text">
                {t('whoWeAre.visionText') as string}
              </p>
            </div>

            <div className="info-item">
              <h3 className="info-item-title">{t('whoWeAre.missionTitle') as string}</h3>
              <p className="info-item-text">
                {t('whoWeAre.missionText') as string}
              </p>
            </div>

            <div className="view-more-btn-wrapper">
              <Link href={`/${language}/about`}>
                <button className="view-more-btn">{t('whoWeAre.viewMore') as string}</button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
