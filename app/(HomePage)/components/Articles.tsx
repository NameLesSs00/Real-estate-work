'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
  const { t } = useLanguage();

  return (
    <section className="articles-section overflow-hidden">
      <div className="articles-container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="articles-header"
        >
          <span className="articles-tag">{t('articles.tag')}</span>
          <h2 className="articles-title">{t('articles.title')}</h2>
          <p className="articles-subtitle">
            {t('articles.subtitle')}
          </p>
          <div className="articles-accent-line"></div>
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
                staggerChildren: 0.2
              }
            }
          }}
          className="articles-grid"
        >
          {articles.map((article, index) => (
            <motion.div 
              key={index} 
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.7, ease: "easeOut" }
                }
              }}
              className="article-card"
            >
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
                  {t('articles.readMore')}
                  <Image 
                    src="/assists/articles/arrow-right.png" 
                    alt="Arrow" 
                    width={18} 
                    height={18} 
                    className="read-more-arrow"
                  />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="show-more-blogs-wrapper"
        >
          <Link href="/blogs" className="show-more-blogs-button inline-block text-center">
            {t('articles.showMore')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Articles;
