'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import './HowItWorks.css';

const steps = [
  {
    icon: '/assists/HowItWorks/fluent_search-sparkle-16-filled.png',
    text: 'Explore curated properties that match your needs and budget.',
    direction: 'left',
  },
  {
    icon: '/assists/HowItWorks/ri_chat-ai-line.png',
    text: 'Connect with our experts for personalized guidance.',
    direction: 'bottom',
  },
  {
    icon: '/assists/HowItWorks/uil_calender.png',
    text: 'Book a visit and find your ideal property with ease.',
    direction: 'right',
  },
];

const HowItWorks = () => {
  return (
    <section className="how-it-works-section overflow-hidden">
      <div className="how-it-works-overlay"></div>
      
      <div className="how-it-works-container">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="how-it-works-header"
        >
          <span className="how-it-works-tag">HOW IT WORKS</span>
          <h2 className="how-it-works-title">A Simple Way to Find Your Perfect Property</h2>
          <div className="how-it-works-accent-line"></div>
        </motion.div>

        <div className="how-it-works-grid">
          {steps.map((step, index) => {
            const initialPos = 
              step.direction === 'left' ? { x: -60, opacity: 0 } :
              step.direction === 'right' ? { x: 60, opacity: 0 } :
              { y: 60, opacity: 0 };

            return (
              <motion.div 
                key={index}
                initial={initialPos}
                whileInView={{ x: 0, y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.2 + (index * 0.3), // 0.2, 0.5, 0.8
                  ease: "easeOut" 
                }}
                className="how-it-works-card"
              >
                <div className="how-it-works-icon-wrapper">
                  <Image 
                    src={step.icon} 
                    alt="Step Icon" 
                    width={64} 
                    height={64} 
                    className="how-it-works-icon"
                  />
                </div>
                <p className="how-it-works-text">{step.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
