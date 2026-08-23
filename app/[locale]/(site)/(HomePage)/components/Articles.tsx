'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { getBlogs, BlogItem, getBlogImageUrl } from '@/lib/api/blogs';
import { ArrowRight } from 'lucide-react';
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
        const data = await getBlogs(1, 3, language);
        setBlogs(data.items || []);
      } catch (error) {
        console.warn('Failed to fetch latest blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatestBlogs();
  }, [language]);

  if (isLoading) {
    return (
      <section className="articles-section overflow-hidden">
        <div className="articles-container flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#000000] border-t-transparent rounded-full animate-spin"></div>
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
          <h2 className="articles-title font-radley text-[#000000] text-[48px] leading-[1.2] mb-6">{t('articles.title') as string}</h2>
          <p className="articles-subtitle text-[#666666]">
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
              transition: { staggerChildren: 0.2 }
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
                <Link href={blogUrl} className="group block bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative w-full aspect-[4/5] overflow-hidden">
                    <Image 
                      src={getBlogImageUrl(blog.imageUrl) || '/placeholder-image.png'} 
                      alt={blog.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      unoptimized
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-between h-[180px]">
                    <h3 className="font-radley text-[#000000] text-[22px] font-bold leading-snug line-clamp-2">
                      {blog.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-4 text-[#42A5F5] font-poppins font-semibold text-[15px] group-hover:text-[#2196F3] transition-colors">
                      {t('articles.readMore') as string}
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
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
