import React from 'react';
import Image from 'next/image';
import './Categories.css';

const categories = [
  {
    name: 'Apartments',
    count: '10 Listings',
    image: '/assists/categoriesHome/appartment.png',
  },
  {
    name: 'Houses',
    count: '12 Listings',
    image: '/assists/categoriesHome/home.png',
  },
  {
    name: 'Vails',
    count: '9 Listings',
    image: '/assists/categoriesHome/vails.png',
  },
  {
    name: 'Studio',
    count: '7 Listings',
    image: '/assists/categoriesHome/studio.png',
  },
];

const Categories = () => {
  return (
    <section className="categories-section">
      <div className="categories-container">
        <div className="categories-header">
          <span className="categories-tag">FEATURED LISTINGS</span>
          <h2 className="categories-title">
            Browse Properties by <span>Category</span>
          </h2>
          <p className="categories-subtitle">
            Present homes in clear, organized categories so visitors can quickly explore the
            types of properties that match their needs, interests, and buying goals.
          </p>
          <div className="categories-accent-line"></div>
        </div>

        <div className="categories-grid">
          {categories.map((category, index) => (
            <div key={index} className="category-card">
              <div className="category-image-wrapper">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="category-image"
                />
              </div>
              <div className="category-content">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-count">{category.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
