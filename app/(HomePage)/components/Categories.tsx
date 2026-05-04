'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
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
    <section className="categories-section overflow-hidden">
      <div className="categories-container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="categories-header"
        >
          <span className="categories-tag">FEATURED LISTINGS</span>
          <h2 className="categories-title">
            Browse Properties by <span>Category</span>
          </h2>
          <p className="categories-subtitle">
            Present homes in clear, organized categories so visitors can quickly explore the
            types of properties that match their needs, interests, and buying goals.
          </p>
          <div className="categories-accent-line"></div>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          className="categories-grid"
        >
          {categories.map((category, index) => (
            <motion.div 
              key={index} 
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { duration: 0.6, ease: "easeOut" }
                }
              }}
              whileHover={{ 
                y: -12,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              className="category-card"
            >
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
