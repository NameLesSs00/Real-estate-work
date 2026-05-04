'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '../blogs.css';

const galleryImages = [
  '/assists/blogsSingle/img1.png',
  '/assists/blogsSingle/img2.png',
  '/assists/blogsSingle/img3.png',
];

export default function SingleBlogPage() {
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
          <Link href="/blogs" className="hover:text-brand-primary transition-colors">Blogs</Link>
          <span className="breadcrumb-separator">&gt;</span>
          <span className="current-crumb">Learn The Truth About Real Estate Industry</span>
        </nav>

        {/* Title */}
        <h1 className="single-blog-title">
          Learn The Truth About Real Estate Industry
        </h1>

        {/* Hero Image */}
        <div className="single-blog-hero">
          <Image 
            src="/assists/articles/img3.png" 
            alt="Hero Image" 
            fill 
            className="object-cover"
            priority
          />
        </div>

        {/* Metadata Bar */}
        <div className="blog-metadata-bar">
          <div className="meta-item">
            <Image src="/assists/blogsSingle/calendar.png" alt="Date" width={20} height={20} className="meta-icon" />
            <span>March 9, 2016</span>
          </div>
          <div className="meta-item">
            <Image src="/assists/blogsSingle/clock.png" alt="Read Time" width={20} height={20} className="meta-icon" />
            <span>30Min</span>
          </div>
          <div className="meta-item">
            <Image src="/assists/blogsSingle/edit-2.png" alt="Author" width={20} height={20} className="meta-icon" />
            <span>by Mike Moore</span>
          </div>
        </div>

        {/* Blog Content */}
        <article className="blog-post-content">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis et sem sed sollicitudin. 
            Donec non odio neque. Aliquam hendrerit sollicitudin purus, quis rutrum mi accumsan nec. 
            Quisque bibendum orci ac nibh facilisis, at malesuada orci congue. Nullam tempus sollicitudin cursus. 
            Ut et adipiscing erat. Curabitur this is a text link libero tempus congue. 
            Duis mattis laoreet neque, et ornare neque sollicitudin at. Proin sagittis dolor sed mi elementum pretium. 
            Donec et justo ante. Vivamus egestas sodales est, eu rhoncus urna semper eu. 
            Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. 
            Integer tristique elit lobortis purus bibendum, quis dictum metus mattis. 
            Phasellus posuere felis sed eros porttitor mattis. Curabitur massa magna, tempor in blandit id, 
            porta in ligula. Aliquam laoreet nisl massa, at interdum mauris sollicitudin et.
          </p>

          <h3>Quisque this is a link nibh facilisis at malesuada</h3>

          <p>
            Nullam tempus sollicitudin cursus. Nulla elit mauris, volutpat eu varius malesuada, pulvinar eu ligula. 
            Ut et adipiscing erat. Curabitur adipiscing erat vel libero tempus congue. Nam pharetra interdum vestibulum. 
            Aenean gravida mi non aliquet porttitor. Praesent dapibus, nisi a faucibus tincidunt, quam dolor condimentum metus, 
            in convallis libero ligula ut eros.
          </p>

          {/* Gallery */}
          <div className="blog-gallery-grid" style={{ gridTemplateColumns: `repeat(${galleryImages.length}, 1fr)` }}>
            {galleryImages.map((src, index) => (
              <div key={index} className="gallery-item">
                <Image 
                  src={src} 
                  alt={`Gallery Image ${index + 1}`} 
                  fill 
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Comments Section - Coming Soon */}
          <section className="comments-area">
            <div className="bg-[#F8F5F0] rounded-2xl p-12 text-center">
              <h2 className="comments-title mb-4">Comments Section</h2>
              <p className="text-gray-600 font-poppins text-lg">
                We are working on bringing a community discussion space here. 
                This feature is coming soon!
              </p>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
