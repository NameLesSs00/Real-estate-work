'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { getBlogs, BlogItem, getBlogImageUrl } from '@/lib/api/blogs';
import './Articles.css';

// Helper to convert title to slug
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const Articles = () => {
  const { t, language } = useLanguage();
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const data = await getBlogs(1, 3);
        setBlogs(data.items || []);
      } catch (error) {
        console.error('Failed to fetch latest blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatestBlogs();
  }, []);

  if (isLoading) {
    return (
      <section className="articles-section overflow-hidden">
        <div className="articles-container flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#1B2134] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  // Hide section if no blogs exist
  if (blogs.length === 0) return null;

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
          <span className="articles-tag">{t('articles.tag') as string}</span>
          <h2 className="articles-title">{t('articles.title') as string}</h2>
          <p className="articles-subtitle">
            {t('articles.subtitle') as string}
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
          {blogs.map((blog) => {
            const blogUrl = `/${language}/blogs/${blog.id}-${generateSlug(blog.title)}`;
            return (
              <motion.div
                key={blog.id}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.7, ease: "easeOut" }
                  }
                }}
              >
                <Link href={blogUrl} className="article-card block">
                  <div className="article-image-wrapper">
                    <Image 
                      src={getBlogImageUrl(blog.imageUrl) || '/placeholder-image.png'} 
                      alt={blog.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="article-image"
                      unoptimized
                    />
                  </div>
                  <div className="article-overlay">
                    <h3 className="article-card-title">{blog.title}</h3>
                    <div className="read-more-btn">
                      {t('articles.readMore') as string}
                      <Image 
                        src="/assists/articles/arrow-right.png" 
                        alt="Arrow" 
                        width={18} 
                        height={18} 
                        className="read-more-arrow"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="show-more-blogs-wrapper"
        >
          <Link href={`/${language}/blogs`} className="show-more-blogs-button inline-block text-center">
            {t('articles.showMore') as string}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Articles;
