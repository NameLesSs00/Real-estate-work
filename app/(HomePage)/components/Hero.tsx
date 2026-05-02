'use client';

import { useState, useEffect } from "react";
import Image from "next/image";

const HERO_IMAGES = [
  "/assists/hero/backgoundImage.png",
  "/assists/hero/hero2.png",
  "/assists/hero/hero3.png",
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-20 pb-20 overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        {HERO_IMAGES.map((src, index) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
            style={{ opacity: index === currentIndex ? 1 : 0, zIndex: index === currentIndex ? 1 : 0 }}
          >
            <Image
              src={src}
              alt={`Hero slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
        {/* Overlay */}
        <div
          className="absolute inset-0 mix-blend-screen"
          style={{ background: 'linear-gradient(180deg, rgba(217, 217, 217, 0) 0%, rgba(115, 115, 115, 0.7) 100%)', zIndex: 10 }}
        ></div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-[280px] left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-[4px] rounded-full transition-all duration-500 ${
              index === currentIndex ? "w-8 bg-white" : "w-4 bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6 text-center mb-20">
        <h1 className="text-[50px] md:text-[80px] font-work-sans font-bold text-white leading-[1.1] tracking-[-1.4px] max-w-5xl mx-auto">
          Discover Your Next <br /> Investment Property
        </h1>
      </div>

      {/* Search Filter Card */}
      <div className="relative z-10 w-[calc(100%-48px)] max-w-[1280px] bg-[#F8F5F0] rounded-[30px] shadow-2xl p-8 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Top Row */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-brand-primary opacity-60">Search by area, compound, or developer</label>
            <div className="relative flex items-center bg-white rounded-lg px-4 py-3 border border-brand-divider">
              <input
                type="text"
                placeholder="Search by area, compound, or developer"
                className="w-full bg-transparent outline-none text-brand-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-brand-primary opacity-60">Price</label>
            <select className="bg-white rounded-lg px-4 py-3 border border-brand-divider text-brand-primary outline-none appearance-none">
              <option>All price</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-brand-primary opacity-60">Location</label>
            <select className="bg-white rounded-lg px-4 py-3 border border-brand-divider text-brand-primary outline-none appearance-none">
              <option>All Locations</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-6 items-end">
          {/* Bottom Row */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-brand-primary opacity-60">Delivery Date</label>
            <input type="text" placeholder="MM/DD/YYYY" className="bg-white rounded-lg px-4 py-3 border border-brand-divider text-brand-primary outline-none" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-brand-primary opacity-60">Bed&Bath</label>
            <select className="bg-white rounded-lg px-4 py-3 border border-brand-divider text-brand-primary outline-none appearance-none">
              <option>Bed&bath</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-brand-primary opacity-60">Unit Type</label>
            <select className="bg-white rounded-lg px-4 py-3 border border-brand-divider text-brand-primary outline-none appearance-none">
              <option>All categories</option>
            </select>
          </div>

          <button className="flex items-center justify-center gap-3 bg-[#1B2134] text-white rounded-full py-4 px-10 font-poppins font-medium text-[20px] transition-all hover:bg-opacity-90">
            Search
            <Image src="/assists/hero/search-normal.png" alt="Search" width={24} height={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
