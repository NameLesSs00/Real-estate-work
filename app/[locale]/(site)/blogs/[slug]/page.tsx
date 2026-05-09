'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getBlogById, BlogItem, getBlogImageUrl } from '@/lib/api/blogs';
import '../blogs.css';

export default function SingleBlogPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!params.slug) return;
      
      try {
        setIsLoading(true);
        // The slug format is "101-title", so we parse the integer ID from the beginning
        const slugStr = Array.isArray(params.slug) ? params.slug[0] : params.slug;
        const id = parseInt(slugStr, 10);
        
        if (isNaN(id)) {
          throw new Error('Invalid blog ID');
        }

        const data = await getBlogById(id);
        setBlog(data);
      } catch (error) {
        console.error('Failed to load blog:', error);
        router.push('/blogs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [params.slug, router]);

  if (isLoading) {
    return (
      <div className="pt-32 pb-32 flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-[#1B2134] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) return null;

  // Sort sections by sectionNumber to ensure correct order
  const sortedSections = [...blog.sections].sort((a, b) => a.sectionNumber - b.sectionNumber);

  return (
    <main className="single-blog-page pt-32">
      <div className="single-blog-container">
        {/* Breadcrumbs */}
        <nav className="blog-breadcrumbs">
          <Image 
            src="/assists/blogsSingle/bookmark.png" 
            alt="Blogs" 
            width={16} 
            height={16} 
            className="breadcrumb-icon"
          />
          <Link href="/blogs" className="hover:text-[#1B2134] transition-colors">Blogs</Link>
          <span className="breadcrumb-separator">&gt;</span>
          <span className="current-crumb">{blog.title}</span>
        </nav>

        {/* Title */}
        <h1 className="single-blog-title">
          {blog.title}
        </h1>

        {/* Hero Image */}
        <div className="single-blog-hero">
          <Image 
            src={getBlogImageUrl(blog.imageUrl) || '/placeholder-image.png'} 
            alt={blog.title} 
            fill 
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        {/* Blog Content - Dynamic Sections */}
        <article className="blog-post-content mt-12">
          {sortedSections.length === 0 ? (
            <p className="text-gray-500 italic">This blog has no content yet.</p>
          ) : (
            sortedSections.map((section) => (
              <section key={section.id} className="blog-section">
                {section.tittle && <h2>{section.tittle}</h2>}
                
                <p>{section.content}</p>

                {section.imageUrl && (
                  <div className="blog-section-image">
                    <Image 
                      src={getBlogImageUrl(section.imageUrl)!} 
                      alt={section.tittle || `Section ${section.sectionNumber}`} 
                      fill 
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </section>
            ))
          )}
        </article>
      </div>
    </main>
  );
}
