import React from 'react';
import Image from 'next/image';
import './HowItWorks.css';

const steps = [
  {
    icon: '/assists/HowItWorks/fluent_search-sparkle-16-filled.png',
    text: 'Explore curated properties that match your needs and budget.',
  },
  {
    icon: '/assists/HowItWorks/ri_chat-ai-line.png',
    text: 'Connect with our experts for personalized guidance.',
  },
  {
    icon: '/assists/HowItWorks/uil_calender.png',
    text: 'Book a visit and find your ideal property with ease.',
  },
];

const HowItWorks = () => {
  return (
    <section className="how-it-works-section">
      <div className="how-it-works-overlay"></div>
      
      <div className="how-it-works-container">
        <div className="how-it-works-header">
          <span className="how-it-works-tag">HOW IT WORKS</span>
          <h2 className="how-it-works-title">A Simple Way to Find Your Perfect Property</h2>
          <div className="how-it-works-accent-line"></div>
        </div>

        <div className="how-it-works-grid">
          {steps.map((step, index) => (
            <div key={index} className="how-it-works-card">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
