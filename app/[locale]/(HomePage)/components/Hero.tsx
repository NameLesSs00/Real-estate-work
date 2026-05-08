'use client';

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, Search, MapPin, ChevronDown } from "lucide-react";
import { getLocations, Location } from "@/lib/api/locations";
import { useLanguage } from '@/lib/contexts/LanguageContext';

const PROPERTY_TYPES = [
  { key: 'apartment', value: '0' },
  { key: 'villa', value: '1' },
  { key: 'townhouse', value: '2' },
  { key: 'studio', value: '3' },
  { key: 'penthouse', value: '4' },
];

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [unitType, setUnitType] = useState('Buy'); // Buy or Rent
  const [locationId, setLocationId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);

  const { t, language } = useLanguage();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
    const handleTimeUpdate = () => { if (video.currentTime >= 4) { video.currentTime = 0; video.play().catch(() => {}); } };
    video.addEventListener('timeupdate', handleTimeUpdate);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => { video.removeEventListener('timeupdate', handleTimeUpdate); window.removeEventListener('resize', checkMobile); };
  }, []);

  useEffect(() => {
    getLocations(1).then(data => {
      setLocations(data.items ?? []);
    }).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('searchTerm', searchTerm);
    if (propertyType) params.set('propertyType', propertyType);
    if (unitType) params.set('unitType', unitType);
    if (locationId) params.set('locationId', locationId);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    router.push(`/${language}/properties?${params.toString()}`);
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
          className="text-[28px] sm:text-[40px] md:text-[80px] font-work-sans font-bold text-white leading-[1.1] tracking-[-1.4px] max-w-5xl mx-auto"
          dangerouslySetInnerHTML={{ __html: t('hero.title') as string }}
        />
      </div>

      {/* Search Filter Card */}
      <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }} className="relative z-20 w-[calc(100%-32px)] md:w-[calc(100%-48px)] max-w-[1280px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[30px] shadow-2xl p-6 md:p-8 mb-5">
        <form onSubmit={handleSearch}>
          {/* Search Header Row */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-[14px] md:text-[16px] font-semibold text-[#1B2134]">{t('hero.searchLabel') as string}</label>
                <div className="relative flex items-center bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/40 shadow-sm">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder={t('hero.searchPlaceholder') as string}
                    className="w-full bg-transparent outline-none text-[#1B2134] placeholder:text-[#1B2134]/50 font-medium text-[16px] md:text-[18px]"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowFilters(!showFilters)} className="md:hidden flex-1 flex items-center justify-center gap-2 bg-white/20 border border-white/30 text-white rounded-lg px-4 py-3 font-semibold transition-all active:scale-95 cursor-pointer">
                  {showFilters ? <X size={18} /> : <Filter size={18} />}
                  <span className="text-[14px]">{showFilters ? t('hero.hide') as string : t('hero.filters') as string}</span>
                </button>
                <button type="submit" className="flex-1 md:flex-none h-[50px] md:h-[55px] flex items-center justify-center gap-3 bg-[#1B2134] text-white rounded-lg md:rounded-full px-6 md:px-12 font-poppins font-semibold text-[16px] md:text-[18px] transition-all duration-300 hover:scale-105 active:scale-95 group relative overflow-hidden cursor-pointer">
                  <span className="relative z-10 md:block hidden">{t('hero.search') as string}</span>
                  <div className="relative z-10 bg-white/20 p-2 rounded-full">
                    <Search size={18} className="text-white" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Filters Grid */}
          <AnimatePresence initial={false}>
            {(showFilters || !isMobile) && (
              <motion.div initial={isMobile ? { height: 0, opacity: 0, marginTop: 0 } : false} animate={{ height: "auto", opacity: 1, marginTop: 24 }} exit={{ height: 0, opacity: 0, marginTop: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* 1. Category (Buy/Rent) */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#1B2134]">{t('propertiesPage.sidebar.category') as string}</label>
                    <div className="relative">
                      <select 
                        value={unitType} 
                        onChange={e => setUnitType(e.target.value)} 
                        className="w-full bg-white/90 backdrop-blur-sm rounded-lg pl-4 pr-10 py-3 border border-white/40 text-[#1B2134] font-medium text-[15px] outline-none appearance-none cursor-pointer shadow-sm"
                      >
                        <option value="Buy">{t('header.buy') as string}</option>
                        <option value="Rent">{t('header.rent') as string}</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* 2. Property Type */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#1B2134]">{t('hero.propertyType') as string}</label>
                    <div className="relative">
                      <select 
                        value={propertyType} 
                        onChange={e => setPropertyType(e.target.value)} 
                        className="w-full bg-white/90 backdrop-blur-sm rounded-lg pl-4 pr-10 py-3 border border-white/40 text-[#1B2134] font-medium text-[15px] outline-none appearance-none cursor-pointer shadow-sm"
                      >
                        <option value="">{t('hero.allTypes') as string}</option>
                        {PROPERTY_TYPES.map(type => (
                          <option key={type.value} value={type.value}>
                            {t(`propertiesPage.sidebar.${type.key}`) as string}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* 2. Location */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#1B2134]">{t('hero.location') as string}</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <MapPin size={18} />
                      </div>
                      <select 
                        value={locationId} 
                        onChange={e => setLocationId(e.target.value)} 
                        className="w-full bg-white/90 backdrop-blur-sm rounded-lg pl-11 pr-10 py-3 border border-white/40 text-[#1B2134] font-medium text-[15px] outline-none appearance-none cursor-pointer shadow-sm"
                      >
                        <option value="">{t('hero.allLocations') as string}</option>
                        {locations.map(loc => (
                          <option key={loc.id} value={loc.id}>
                            {loc.city}{loc.district && loc.district !== '-' ? ` - ${loc.district}` : ''}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* 3. Starting Price */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#1B2134]">{t('hero.minPrice') as string}</label>
                    <input 
                      type="number" 
                      value={minPrice} 
                      onChange={e => setMinPrice(e.target.value)} 
                      placeholder={t('hero.noMin') as string} 
                      className="w-full bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/40 text-[#1B2134] placeholder:text-[#1B2134]/50 font-medium text-[15px] outline-none shadow-sm" 
                    />
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
