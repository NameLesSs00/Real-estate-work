'use client';

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, Search } from "lucide-react";
import { getLocations } from "@/lib/api/locations";

const PROPERTY_TYPES = ['Apartment', 'Villa', 'Studio', 'Penthouse', 'Chalet', 'Town House', 'Twin House'];

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [unitType, setUnitType] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [locations, setLocations] = useState<string[]>([]);

  const { t } = useLanguage();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
    const handleTimeUpdate = () => { if (video.currentTime >= 4) { video.currentTime = 0; video.play(); } };
    video.addEventListener('timeupdate', handleTimeUpdate);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => { video.removeEventListener('timeupdate', handleTimeUpdate); window.removeEventListener('resize', checkMobile); };
  }, []);

  useEffect(() => {
    getLocations(1).then(data => {
      const cities = [...new Set((data.items ?? []).map((l: { city: string }) => l.city).filter(Boolean))];
      setLocations(cities);
    }).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (unitType) params.set('type', unitType);
    if (location) params.set('location', location);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center pt-28 pb-16 overflow-hidden">
      {/* Background Video */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} className="absolute inset-0 z-0 overflow-hidden">
        <video ref={videoRef} autoPlay muted loop playsInline preload="auto" className="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2">
          <source src="/assists/herobg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 mix-blend-screen z-10 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(217, 217, 217, 0) 0%, rgba(115, 115, 115, 0.7) 100%)' }} />
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center container mx-auto px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }} 
          className="text-[40px] md:text-[80px] font-work-sans font-bold text-white leading-[1.1] tracking-[-1.4px] max-w-5xl mx-auto"
          dangerouslySetInnerHTML={{ __html: t('hero.title') }}
        />
      </div>

      {/* Search Filter Card */}
      <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }} className="relative z-20 w-[calc(100%-32px)] md:w-[calc(100%-48px)] max-w-[1280px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[30px] shadow-2xl p-6 md:p-8 mb-5">
        <form onSubmit={handleSearch}>
          {/* Search Header Row */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-[14px] md:text-[16px] font-semibold text-[#1B2134]">{t('hero.searchLabel')}</label>
              <div className="relative flex items-center bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/40 shadow-sm">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder={t('hero.searchPlaceholder')}
                  className="w-full bg-transparent outline-none text-[#1B2134] placeholder:text-[#1B2134]/50 font-medium text-[16px] md:text-[18px]"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowFilters(!showFilters)} className="md:hidden flex-1 flex items-center justify-center gap-2 bg-white/20 border border-white/30 text-white rounded-lg px-4 py-3 font-semibold transition-all active:scale-95 cursor-pointer">
                {showFilters ? <X size={18} /> : <Filter size={18} />}
                <span className="text-[14px]">{showFilters ? t('hero.hide') : t('hero.filters')}</span>
              </button>
              <button type="submit" className="flex-1 md:flex-none h-[50px] md:h-[55px] flex items-center justify-center gap-3 bg-[#1B2134] text-white rounded-lg md:rounded-full px-6 md:px-12 font-poppins font-semibold text-[16px] md:text-[18px] transition-all duration-300 hover:scale-105 active:scale-95 group relative overflow-hidden cursor-pointer">
                <span className="relative z-10 md:block hidden">{t('hero.search')}</span>
                <div className="relative z-10 bg-white/20 p-2 rounded-full">
                  <Search size={18} className="text-white" />
                </div>
              </button>
            </div>
          </div>

          {/* Filters Grid */}
          <AnimatePresence initial={false}>
            {(showFilters || !isMobile) && (
              <motion.div initial={isMobile ? { height: 0, opacity: 0, marginTop: 0 } : false} animate={{ height: "auto", opacity: 1, marginTop: 24 }} exit={{ height: 0, opacity: 0, marginTop: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#1B2134]">{t('hero.propertyType')}</label>
                    <select value={unitType} onChange={e => setUnitType(e.target.value)} className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/40 text-[#1B2134] font-medium text-[15px] outline-none appearance-none cursor-pointer shadow-sm">
                      <option value="">{t('hero.allTypes')}</option>
                      {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#1B2134]">{t('hero.location')}</label>
                    <select value={location} onChange={e => setLocation(e.target.value)} className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/40 text-[#1B2134] font-medium text-[15px] outline-none appearance-none cursor-pointer shadow-sm">
                      <option value="">{t('hero.allLocations')}</option>
                      {locations.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#1B2134]">{t('hero.minPrice')}</label>
                    <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder={t('hero.noMin')} className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/40 text-[#1B2134] placeholder:text-[#1B2134]/50 font-medium text-[15px] outline-none shadow-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#1B2134]">{t('hero.maxPrice')}</label>
                    <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder={t('hero.noMax')} className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/40 text-[#1B2134] placeholder:text-[#1B2134]/50 font-medium text-[15px] outline-none shadow-sm" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </section>
  );
};

export default Hero;
