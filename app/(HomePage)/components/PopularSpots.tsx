import React from 'react';
import Image from 'next/image';
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
    <section className="popular-spots-section">
      <div className="popular-spots-container">
        {/* Header */}
        <div className="popular-spots-header">
          <span className="popular-spots-tag">Popular Spots</span>
          <h2 className="popular-spots-title">
            Explore Prime <span>Locations</span>
          </h2>
          <p className="popular-spots-subtitle">
            From the lagoons of El Gouna to the beaches of Sahl Hasheesh — find your perfect
            corner of the Red Sea.
          </p>
          <div className="popular-spots-accent-line" />
        </div>

        {/* Grid */}
        <div className="popular-spots-grid">
          {spots.map((spot) => (
            <div key={spot.name} className={`spot-card ${spot.className}`}>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularSpots;
