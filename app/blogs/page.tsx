'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './blogs.css';

const categories = [
  { name: 'Commerce', count: 6 },
  { name: 'Offices', count: 6 },
  { name: 'Residential', count: 6 },
  { name: 'Warehouse', count: 6 },
  { name: 'Lands', count: 6 },
  { name: 'Latest Development', count: 6 },
];

const filterOptions = [
  'All articles',
  'Investment',
  'Buying Guide',
  'Lifestyle',
  'Market News',
];

const articles = [
  {
    id: 1,
    title: '10 Quick Tips About Business Development',
    image: '/assists/articles/img1.jpg',
    category: 'Lifestyle',
  },
  {
    id: 2,
    title: 'How to Choose the Perfect Property for Your Lifestyle',
    image: '/assists/articles/img2.png',
    category: 'Buying Guide',
  },
  {
    id: 3,
    title: 'Learn The Truth About Real Estate Industry',
    image: '/assists/articles/img3.png',
    category: 'Market News',
  },
];

export default function BlogsPage() {
  const [activeFilter, setActiveFilter] = useState('All articles');

  return (
    <div className="blogs-page pt-32">
      {/* Hero Section */}
      <section className="blogs-hero">
        <Image 
          src="/assists/articles/heroBlogs.jpg" 
          alt="Blogs Hero" 
          fill 
          priority
          className="blogs-hero-image"
        />
      </section>

      {/* Controls: Search & Filters */}
      <div className="blogs-controls">
        <div className="blogs-search-wrapper">
          <div className="blogs-search-input-container">
            <div className="blogs-search-icon">
              <Image 
                src="/assists/hero/search-normal.png" 
                alt="Search" 
                width={24} 
                height={24}
              />
            </div>
            <input 
              type="text" 
              placeholder="Search by area, compound, or developer" 
              className="blogs-search-input"
            />
          </div>
          <button className="blogs-search-button">Search</button>
        </div>

        <div className="blogs-filters">
          <div className="filter-chips">
            {filterOptions.map((option) => (
              <button 
                key={option}
                className={`filter-chip ${activeFilter === option ? 'active' : ''}`}
                onClick={() => setActiveFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="results-count">
            {articles.length + 1} Results
          </div>
        </div>
      </div>

      {/* Featured Article + Sidebar Section */}
      <section className="featured-section">
        <div className="featured-card">
          <div className="featured-image-wrapper">
            <Image 
              src="/assists/articles/img3.png" 
              alt="Featured Article" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="featured-content">
            <span className="featured-tag">Investment</span>
            <h1 className="featured-title">Top 7 Real Estate Investment Trends for 2024</h1>
            <p className="featured-description">
              Discover the top seven real estate investment trends that are shaping the market in 2024, 
              from sustainable properties to tech-driven solutions...
            </p>
            <Link href="/blogs/top-7-investment-trends" className="read-more-link">
              Read More
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>

        <aside className="blogs-sidebar">
          <div className="sidebar-widget">
            <h3 className="widget-title">Categories</h3>
            <div className="category-list">
              {categories.map((cat) => (
                <div key={cat.name} className="category-item">
                  <span className="category-name">{cat.name}</span>
                  <span className="category-count">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {/* Main Content: Grid */}
      <main className="blogs-main-content">
        <div className="articles-area">
          <h2 className="section-label">Last Articles</h2>
          <div className="blogs-grid">
            {articles.map((article) => (
              <div key={article.id} className="blog-item-card">
                <Image 
                  src={article.image} 
                  alt={article.title} 
                  fill 
                  className="blog-item-image"
                />
                <div className="blog-item-overlay">
                  <h3 className="blog-item-title">{article.title}</h3>
                  <Link href={`/blogs/${article.id}`} className="blog-item-read-more">
                    Read More
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="load-more-container">
            <button className="load-more-btn">Load More</button>
          </div>
        </div>
      </main>
    </div>
  );
}
