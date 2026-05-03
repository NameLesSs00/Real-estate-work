'use client';

import { useRef, useEffect } from "react";
import Image from "next/image";

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // Loop back to start if it hits 4 seconds
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
      <div className="absolute inset-0 z-0 overflow-hidden">
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
      </div>

      {/* Hero Content - Centered in remaining space */}
      <div className="relative z-10 flex-1 flex flex-col justify-center container mx-auto px-6 text-center">
        <h1 className="text-[50px] md:text-[80px] font-work-sans font-bold text-white leading-[1.1] tracking-[-1.4px] max-w-5xl mx-auto">
          Discover Your Next <br /> Investment Property
        </h1>
      </div>

      {/* Search Filter Card */}
      <div className="relative z-10 w-[calc(100%-48px)] max-w-[1280px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[30px] shadow-2xl p-8 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Top Row */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-white opacity-80">Search by area, compound, or developer</label>
            <div className="relative flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
              <input
                type="text"
                placeholder="Search by area, compound, or developer"
                className="w-full bg-transparent outline-none text-white placeholder:text-white/60"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-white opacity-80">Price</label>
            <select className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20 text-white outline-none appearance-none cursor-pointer">
              <option className="text-black">All price</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-white opacity-80">Location</label>
            <select className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20 text-white outline-none appearance-none cursor-pointer">
              <option className="text-black">All Locations</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-6 items-end">
          {/* Bottom Row */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-white opacity-80">Delivery Date</label>
            <input 
              type="text" 
              placeholder="MM/DD/YYYY" 
              className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20 text-white outline-none placeholder:text-white/60" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-white opacity-80">Bed&Bath</label>
            <select className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20 text-white outline-none appearance-none cursor-pointer">
              <option className="text-black">Bed&bath</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-white opacity-80">Unit Type</label>
            <select className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20 text-white outline-none appearance-none cursor-pointer">
              <option className="text-black">All categories</option>
            </select>
          </div>

          <button className="h-[60px] flex items-center justify-center gap-3 bg-gradient-to-r from-[#1B2134] to-[#2C3E50] text-white rounded-full px-12 font-poppins font-semibold text-[20px] transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_30px_rgba(27,33,52,0.4)] active:scale-95 group relative overflow-hidden">
            <span className="relative z-10">Search</span>
            <div className="relative z-10 bg-white/20 p-2 rounded-full group-hover:rotate-12 transition-transform">
              <Image src="/assists/hero/search-normal.png" alt="Search" width={20} height={20} className="brightness-0 invert" />
            </div>
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
