import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './Articles.css';

const articles = [
  {
    title: 'How to Choose the Perfect Property for Your Lifestyle',
    image: '/assists/articles/img1.jpg',
  },
  {
    title: 'How to Choose the Perfect Property for Your Lifestyle',
    image: '/assists/articles/img2.png',
  },
  {
    title: 'How to Choose the Perfect Property for Your Lifestyle',
    image: '/assists/articles/img3.png',
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
              <div className="article-image-wrapper">
                <Image 
                  src={article.image} 
                  alt={article.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="article-image"
                />
              </div>
              <div className="article-overlay">
                <h3 className="article-card-title">{article.title}</h3>
                <Link href="/blogs/how-to-choose-property" className="read-more-btn">
                  Read More
                  <Image 
                    src="/assists/articles/arrow-right.png" 
                    alt="Arrow" 
                    width={18} 
                    height={18} 
                    className="read-more-arrow"
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="show-more-blogs-wrapper">
          <Link href="/blogs" className="show-more-blogs-button inline-block text-center">
            Show More Blogs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Articles;
