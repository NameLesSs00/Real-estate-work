'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import './FeatureProject.css';

const projectDetails = [
  {
    icon: '/assists/feature project/buildings-2.png',
    label: 'Total Units',
    value: '23 Exclusive Residences',
  },
  {
    icon: '/assists/feature project/story.png',
    label: 'Building Floors',
    value: '3 Low-Rise Design',
  },
  {
    icon: '/assists/feature project/calendar.png',
    label: 'Delivery Date',
    value: '01 • 04 • 2027',
  },
  {
    icon: '/assists/feature project/building-4.png',
    label: 'Status',
    value: 'Under Development',
  },
  {
    icon: '/assists/feature project/size.png',
    label: 'Spaces',
    value: '92 M² – 470 M²',
  },
];

const FeatureProject = () => {
  const [activeDot, setActiveDot] = useState(0);

  return (
    <section className="feature-project-section overflow-hidden">
      <div className="feature-project-container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="feature-project-header"
        >
          <span className="feature-project-tag">FEATURED PROJECTS</span>
          <h2 className="feature-project-title">Exceptional Properties, Carefully Selected for You</h2>
          <p className="feature-project-subtitle">
            Discover a curated selection of future-ready real estate projects in prime locations,
            designed for quality, innovation, and strong investment value offering a modern lifestyle
            and long-term growth.
          </p>
          <div className="feature-project-accent-line"></div>
        </motion.div>

        <div className="feature-project-content">
          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="project-visuals"
          >
            <div className="project-logos-container">
              <div className="project-logo">
                <Image 
                  src="/assists/feature project/Frame 1171276647.png" 
                  alt="Castello Logo" 
                  width={120} 
                  height={50} 
                />
              </div>
            </div>
            <Image 
              src="/assists/feature project/Frame 1171276546.png" 
              alt="Makadi Heights" 
              width={600} 
              height={600} 
              className="project-main-img"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="project-details-info"
          >
            <div className="project-price-tag">
              Price Start From <span>10,000,000 EGP</span>
            </div>
            <h3 className="project-name">Makadi Heights Residences</h3>
            <div className="project-location">
              <MapPin size={20} />
              <span>Red Sea Living, Hurghada</span>
            </div>
            <p className="project-desc">
              A Thoughtfully Designed Coastal Community Blending Modern Architecture With
              Resort-Style Living In One Of The Most Desirable Destinations On The Red Sea.
            </p>

            <h4 className="details-grid-title">Project Details</h4>
            <div className="details-cards-grid">
              {projectDetails.map((detail, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
                  className="detail-info-card"
                >
                  <Image 
                    src={detail.icon} 
                    alt={detail.label} 
                    width={32} 
                    height={32} 
                    className="detail-info-icon"
                  />
                  <span className="detail-info-label">{detail.label}</span>
                  <span className="detail-info-value">{detail.value}</span>
                </motion.div>
              ))}
            </div>

            <div className="project-actions">
              <button className="get-in-touch-btn">Get In Touch</button>
              <div className="pagination-dots">
                {[0, 1, 2, 3].map((index) => (
                  <span 
                    key={index}
                    className={`dot ${activeDot === index ? 'active' : ''}`}
                    onClick={() => setActiveDot(index)}
                  ></span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="show-more-projects-wrapper"
        >
          <button className="show-more-projects-btn">Show More Projects</button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureProject;
