'use client';

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime >= 4) {
        video.currentTime = 0;
        video.play();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center pt-28 pb-16 overflow-hidden">
      
      {/* ── Background Video ── */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2"
        >
          <source src="/assists/herobg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Visual Overlay */}
        <div
          className="absolute inset-0 mix-blend-screen z-10 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(217, 217, 217, 0) 0%, rgba(115, 115, 115, 0.7) 100%)' }}
        ></div>
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center container mx-auto px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-[50px] md:text-[80px] font-work-sans font-bold text-white leading-[1.1] tracking-[-1.4px] max-w-5xl mx-auto"
        >
          Discover Your Next <br /> Investment Property
        </motion.h1>
      </div>

      {/* Search Filter Card */}
      <motion.div 
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        className="relative z-10 w-[calc(100%-48px)] max-w-[1280px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[30px] shadow-2xl p-8 mb-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Top Row */}
          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-semibold text-[#1B2134]">Search by area, compound, or developer</label>
            <div className="relative flex items-center bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/40 shadow-sm">
              <input
                type="text"
                placeholder="Search by area, compound, or developer"
                className="w-full bg-transparent outline-none text-[#1B2134] placeholder:text-[#1B2134]/50 font-medium text-[18px]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-semibold text-[#1B2134]">Price</label>
            <select className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/40 text-[#1B2134] font-medium text-[18px] outline-none appearance-none cursor-pointer shadow-sm">
              <option className="text-[#1B2134]">All price</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-semibold text-[#1B2134]">Location</label>
            <select className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/40 text-[#1B2134] font-medium text-[18px] outline-none appearance-none cursor-pointer shadow-sm">
              <option className="text-[#1B2134]">All Locations</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6 items-end">
          {/* Bottom Row */}
          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-semibold text-[#1B2134]">Delivery Date</label>
            <input 
              type="text" 
              placeholder="MM/DD/YYYY" 
              className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/40 text-[#1B2134] placeholder:text-[#1B2134]/50 font-medium text-[18px] outline-none shadow-sm" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-semibold text-[#1B2134]">Bedrooms</label>
            <select className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/40 text-[#1B2134] font-medium text-[18px] outline-none appearance-none cursor-pointer shadow-sm">
              <option className="text-[#1B2134]">Bedrooms</option>
              <option className="text-[#1B2134]">1</option>
              <option className="text-[#1B2134]">2</option>
              <option className="text-[#1B2134]">3+</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-semibold text-[#1B2134]">Bathrooms</label>
            <select className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/40 text-[#1B2134] font-medium text-[18px] outline-none appearance-none cursor-pointer shadow-sm">
              <option className="text-[#1B2134]">Bathrooms</option>
              <option className="text-[#1B2134]">1</option>
              <option className="text-[#1B2134]">2</option>
              <option className="text-[#1B2134]">3+</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-semibold text-[#1B2134]">Unit Type</label>
            <select className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/40 text-[#1B2134] font-medium text-[18px] outline-none appearance-none cursor-pointer shadow-sm">
              <option className="text-[#1B2134]">All categories</option>
            </select>
          </div>

          <button className="h-[60px] flex items-center justify-center gap-3 bg-[#1B2134] text-white rounded-full px-12 font-poppins font-semibold text-[18px] transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_30px_rgba(27,33,52,0.4)] active:scale-95 group relative overflow-hidden">
            <span className="relative z-10">Search</span>
            <div className="relative z-10 bg-white/20 p-2 rounded-full group-hover:rotate-12 transition-transform">
              <Image src="/assists/hero/search-normal.png" alt="Search" width={20} height={20} className="brightness-0 invert" />
            </div>
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
