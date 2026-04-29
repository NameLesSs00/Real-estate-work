import React from 'react';
import Image from 'next/image';
import './Articles.css';

const articles = [
  {
    title: 'How to Choose the Perfect Property for Your Lifestyle',
    image: '/assists/articles/Subtract.png',
  },
  {
    title: 'How to Choose the Perfect Property for Your Lifestyle',
    image: '/assists/articles/Subtract (1).png',
  },
  {
    title: 'How to Choose the Perfect Property for Your Lifestyle',
    image: '/assists/articles/Subtract (2).png',
  },
];

const Articles = () => {
  return (
    <section className="articles-section">
      <div className="articles-container">
        <div className="articles-header">
          <span className="articles-tag">LATEST ARTICLES</span>
          <h2 className="articles-title">Insights & Inspiration</h2>
          <p className="articles-subtitle">
            Explore expert insights, real estate trends, and practical tips to help you make
            informed decisions and find the perfect property with confidence.
          </p>
          <div className="articles-accent-line"></div>
        </div>

        <div className="articles-grid">
          {articles.map((article, index) => (
            <div key={index} className="article-card">
              <Image 
                src={article.image} 
                alt={article.title} 
                fill 
                className="article-image"
              />
              <div className="article-overlay">
                <h3 className="article-card-title">{article.title}</h3>
              </div>
              <a href="#" className="read-more-btn">
                Read More
                <Image 
                  src="/assists/articles/arrow-right.png" 
                  alt="Arrow" 
                  width={20} 
                  height={20} 
                  className="read-more-arrow"
                />
              </a>
            </div>
          ))}
        </div>

        <div className="show-more-blogs-wrapper">
          <button className="show-more-blogs-button">Show More Blogs</button>
        </div>
      </div>
    </section>
  );
};

export default Articles;
