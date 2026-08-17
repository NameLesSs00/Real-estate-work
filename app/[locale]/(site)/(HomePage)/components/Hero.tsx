'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, ChevronDown } from "lucide-react";
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
  const router = useRouter();
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [unitType, setUnitType] = useState('Buy'); // Buy or Rent
  const [locationId, setLocationId] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);

  const { language } = useLanguage();

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
    router.push(`/${language}/properties?${params.toString()}`);
  };

  return (
    <section className="relative w-full min-h-[90vh] md:min-h-screen flex flex-col items-center pt-32 pb-16 overflow-hidden rounded-b-[40px] bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/assists/hero/bgimage.png')" }}>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center container mx-auto px-6 text-center mt-12 mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }} 
          className="text-[36px] sm:text-[50px] md:text-[72px] font-serif font-medium text-white leading-[1.15] max-w-4xl mx-auto drop-shadow-lg"
        >
          Discover Your Dream Home
        </motion.h1>
      </div>

      {/* Premium Search Form */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }} 
        className="relative z-20 w-full max-w-[950px] mx-auto px-4 mt-auto mb-[-60px] sm:mb-[-40px]"
      >
        <div className="bg-white p-3 rounded-[28px] shadow-[0_20px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl border border-white/50">
          
          {/* Tabs */}
          <div className="flex items-center gap-1 mb-3 px-2 pt-1">
            <button 
              onClick={() => setUnitType('Buy')} 
              className={`px-6 py-2 rounded-full font-bold text-[14px] transition-all duration-300 ${unitType === 'Buy' ? 'bg-[#000000] text-white shadow-md' : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-[#000000]'}`}
            >
              Buy
            </button>
            <button 
              onClick={() => setUnitType('Rent')} 
              className={`px-6 py-2 rounded-full font-bold text-[14px] transition-all duration-300 ${unitType === 'Rent' ? 'bg-[#000000] text-white shadow-md' : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-[#000000]'}`}
            >
              Rent
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-center gap-2">
            {/* Search Input */}
            <div className="flex-1 w-full bg-[#fbf9f6] rounded-[20px] flex items-center px-5 py-3.5 border border-transparent focus-within:border-[#A88849] focus-within:bg-white transition-all shadow-inner">
              <Search className="text-[#A88849] mr-3 shrink-0" size={20} />
              <input 
                type="text" 
                placeholder="Search locations, projects..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-transparent w-full outline-none text-[#000000] placeholder-gray-400 font-semibold text-[14px]"
              />
            </div>

            {/* Location Dropdown */}
            <div className="w-full lg:w-[200px] bg-[#fbf9f6] rounded-[20px] flex items-center px-5 py-3.5 border border-transparent focus-within:border-[#A88849] focus-within:bg-white transition-all shadow-inner relative shrink-0">
              <MapPin className="text-[#A88849] mr-3 shrink-0" size={20} />
              <select 
                value={locationId} 
                onChange={e => setLocationId(e.target.value)} 
                className="bg-transparent w-full outline-none text-[#000000] font-semibold text-[14px] appearance-none cursor-pointer pr-4"
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.district || loc.city}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>

            {/* Type Dropdown */}
            <div className="w-full lg:w-[180px] bg-[#fbf9f6] rounded-[20px] flex items-center px-5 py-3.5 border border-transparent focus-within:border-[#A88849] focus-within:bg-white transition-all shadow-inner relative shrink-0">
              <select 
                value={propertyType} 
                onChange={e => setPropertyType(e.target.value)} 
                className="bg-transparent w-full outline-none text-[#000000] font-semibold text-[14px] appearance-none cursor-pointer pr-4"
              >
                <option value="">All Types</option>
                {PROPERTY_TYPES.map(type => (
                  <option key={type.key} value={type.value}>{type.key.charAt(0).toUpperCase() + type.key.slice(1)}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>

            {/* Search Button */}
            <button type="submit" className="w-full lg:w-auto bg-[#A88849] text-white px-8 py-3.5 rounded-[20px] font-bold text-[15px] hover:bg-[#8f7239] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-[#A88849]/30 hover:-translate-y-0.5 whitespace-nowrap shrink-0">
              <span>Search</span>
            </button>
          </form>
        </div>
      </motion.div>

    </section>
  );
};

export default Hero;
