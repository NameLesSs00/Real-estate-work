'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogs, BlogItem, getBlogImageUrl } from '@/lib/api/blogs';
import './blogs.css';

// Helper to convert title to slug
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    const fetchInitialBlogs = async () => {
      try {
        setIsLoading(true);
        const data = await getBlogs(1, 6);
        setBlogs(data?.items || []);
        setHasNextPage(data?.hasNextPage || false);
      } catch (error) {
        console.error('Failed to fetch blogs', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialBlogs();
  }, []);

  const handleLoadMore = async () => {
    try {
      const nextPage = pageNumber + 1;
      const data = await getBlogs(nextPage, 6);
      setBlogs(prev => [...prev, ...(data?.items || [])]);
      setPageNumber(nextPage);
      setHasNextPage(data?.hasNextPage || false);
    } catch (error) {
      console.error('Failed to load more blogs', error);
    }
  };

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

      {/* Main Content: Grid */}
      <main className="blogs-main-content mt-12">
        <div className="articles-area">
          <h2 className="section-label text-center md:text-left">Last Articles</h2>
          
          {isLoading && blogs.length === 0 ? (
            <div className="py-16 flex justify-center items-center">
              <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16 text-gray-500 font-poppins">
              No articles have been published yet. Check back later!
            </div>
          ) : (
            <>
              <div className="blogs-grid">
                {blogs.map((blog) => (
                  <Link 
                    key={blog.id} 
                    href={`/blogs/${blog.id}-${generateSlug(blog.title)}`} 
                    className="blog-item-card"
                  >
                    <Image 
                      src={getBlogImageUrl(blog.imageUrl) || '/placeholder-image.png'} 
                      alt={blog.title} 
                      fill 
                      className="blog-item-image"
                      unoptimized
                    />
                    <div className="blog-item-overlay">
                      <h3 className="blog-item-title">{blog.title}</h3>
                      <div className="blog-item-read-more">
                        Read More
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {hasNextPage && (
                <div className="load-more-container">
                  <button onClick={handleLoadMore} className="load-more-btn">
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
