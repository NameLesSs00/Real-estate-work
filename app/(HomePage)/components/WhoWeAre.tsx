import React from 'react';
import Image from 'next/image';
import './WhoWeAre.css';

const WhoWeAre = () => {
  return (
    <section id="about" className="who-we-are-section">
      <Image 
        src="/assists/whoWeAre/Ellipse 1.png" 
        alt="Background Curve" 
        width={800} 
        height={800} 
        quality={100}
        unoptimized
        className="bg-ellipse-1"
      />
      <Image 
        src="/assists/whoWeAre/Ellipse 2.png" 
        alt="Background Curve" 
        width={800} 
        height={800} 
        quality={100}
        unoptimized
        className="bg-ellipse-2"
      />
      
      <div className="who-we-are-container">
        <div className="who-we-are-header">
          <span className="who-we-are-tag">WHO WE ARE</span>
          <h2 className="who-we-are-title">Your Trusted Real Estate Partner</h2>
          <p className="who-we-are-subtitle">
            We are committed to helping you discover exceptional properties in prime locations,
            combining quality, transparency, and a seamless experience tailored to your needs.
          </p>
          <div className="who-we-are-accent-line"></div>
        </div>

        <div className="who-we-are-content">
          <div className="who-we-are-images">
            <Image 
              src="/assists/whoWeAre/Group 4.png" 
              alt="Who We Are Images" 
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="who-we-are-main-img"
              priority
            />
          </div>

          <div className="who-we-are-info-box">
            <div className="info-item">
              <h3 className="info-item-title">Our Vision</h3>
              <p className="info-item-text">
                To redefine the real estate experience by making it more transparent, accessible,
                and tailored to modern lifestyles. We aim to connect people with spaces that
                truly inspire how they live, work, and grow.
              </p>
            </div>

            <div className="info-item">
              <h3 className="info-item-title">Our Mission</h3>
              <p className="info-item-text">
                To guide our clients through every step of their property journey with honesty,
                expertise, and care. We are committed to delivering exceptional service, curated
                property selections, and a seamless experience that builds long-term trust.
              </p>
            </div>

            <div className="view-more-btn-wrapper">
              <button className="view-more-btn">View More</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
