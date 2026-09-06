'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, ChevronDown, CircleDollarSign, MapPin, Search } from "lucide-react";
import { getLocations, Location } from "@/lib/api/locations";
import { getProjectTypes, ProjectType } from "@/lib/api/projectTypes";
import { useLanguage } from '@/lib/contexts/LanguageContext';

const CURRENCIES = ['USD', 'EGP', 'EUR', 'GBP'];

const getLocationLabel = (location: Location) => {
  return [
    location.mainLocation || location.city,
    location.subLocation || location.district,
  ].filter(Boolean).join(' - ') || `#${location.id}`;
};

const Hero = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [projectTypeId, setProjectTypeId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [minimumPrice, setMinimumPrice] = useState('');
  const [maximumPrice, setMaximumPrice] = useState('');
  const [priceCurrency, setPriceCurrency] = useState('');
  const [priceError, setPriceError] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);

  const { t, language, getLocalized } = useLanguage();

  useEffect(() => {
    Promise.all([
      getLocations({ pageNumber: 1, pageSize: 100 }),
      getProjectTypes({ pageNumber: 1, pageSize: 10 }),
    ]).then(([locationsPage, projectTypesPage]) => {
      setLocations(locationsPage.items ?? []);
      setProjectTypes(projectTypesPage.items ?? []);
    }).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const min = minimumPrice ? Number(minimumPrice) : null;
    const max = maximumPrice ? Number(maximumPrice) : null;

    if (min !== null && max !== null && min > max) {
      setPriceError(t('hero.priceOrderError'));
      return;
    }

    setPriceError('');
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('searchTerm', searchTerm.trim());
    if (projectTypeId) params.set('projectTypeId', projectTypeId);
    if (locationId) params.set('locationId', locationId);
    if (minimumPrice) params.set('minimumPrice', minimumPrice);
    if (maximumPrice) params.set('maximumPrice', maximumPrice);
    if (priceCurrency) params.set('priceCurrency', priceCurrency);
    router.push(`/${language}/projects${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const fieldClass = "relative flex min-h-[58px] items-center rounded-[16px] border border-brand-divider/50 bg-brand-bg px-4 transition-all focus-within:border-brand-secondary focus-within:bg-white focus-within:shadow-sm";
  const inputClass = "min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-brand-primary outline-none placeholder:text-brand-muted-light";
  const selectClass = "min-w-0 flex-1 cursor-pointer appearance-none bg-transparent pr-8 text-[15px] font-semibold text-brand-primary outline-none";

  return (
    <section className="relative flex min-h-[760px] w-full flex-col items-center overflow-hidden rounded-b-[36px] bg-cover bg-center px-4 pb-10 pt-28 sm:min-h-[780px] md:min-h-[calc(100vh-24px)] md:pb-14 md:pt-32" style={{ backgroundImage: "url('/assists/hero/bgimage.png')" }}>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/45 z-0 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-1 flex-col justify-center text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }} 
          className="mx-auto max-w-4xl text-[38px] font-serif font-medium leading-[1.12] text-white drop-shadow-lg sm:text-[52px] md:text-[72px]"
        >
          <span dangerouslySetInnerHTML={{ __html: t('hero.title') }} />
        </motion.h1>
      </div>

      {/* Premium Search Form */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }} 
        className="relative z-20 mx-auto mt-auto w-full max-w-[1180px]"
      >
        <div className="rounded-[24px] border border-white/60 bg-white p-3 shadow-[0_22px_50px_rgba(7,44,62,0.18)] backdrop-blur-xl sm:p-4">
          
          <form onSubmit={handleSearch} className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-12">
            {/* Search Input */}
            <div className={`${fieldClass} md:col-span-2 xl:col-span-4`}>
              <Search className="text-brand-secondary mr-3 shrink-0" size={20} />
              <input 
                type="text" 
                placeholder={t('hero.searchPlaceholder')} 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Location Dropdown */}
            <div className={`${fieldClass} xl:col-span-3`}>
              <MapPin className="text-brand-secondary mr-3 shrink-0" size={20} />
              <select 
                value={locationId} 
                onChange={e => setLocationId(e.target.value)} 
                className={selectClass}
              >
                <option value="">{t('hero.allLocations')}</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{getLocationLabel(loc)}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>

            {/* Type Dropdown */}
            <div className={`${fieldClass} xl:col-span-3`}>
              <Building2 className="text-brand-secondary mr-3 shrink-0" size={20} />
              <select 
                value={projectTypeId} 
                onChange={e => setProjectTypeId(e.target.value)} 
                className={selectClass}
              >
                <option value="">{t('hero.allTypes')}</option>
                {projectTypes.map(type => (
                  <option key={type.id} value={type.id}>{getLocalized(type.name) || `#${type.id}`}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>

            {/* Search Button */}
            <button type="submit" className="order-last flex min-h-[58px] w-full items-center justify-center gap-2 rounded-[16px] bg-brand-secondary px-7 text-[15px] font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-brand-primary hover:shadow-lg md:col-span-2 xl:order-none xl:col-span-2">
              <span>{t('hero.search')}</span>
            </button>

            <div className={`${fieldClass} xl:col-span-4`}>
              <CircleDollarSign className="text-brand-secondary mr-3 shrink-0" size={20} />
              <select
                value={priceCurrency}
                onChange={e => setPriceCurrency(e.target.value)}
                className={selectClass}
              >
                <option value="">{t('hero.currency')}</option>
                {CURRENCIES.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>

            <div className={`${fieldClass} xl:col-span-4`}>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={t('hero.minPrice')}
                value={minimumPrice}
                onChange={e => {
                  setMinimumPrice(e.target.value.replace(/[^0-9]/g, ''));
                  setPriceError('');
                }}
                className={inputClass}
              />
            </div>

            <div className={`${fieldClass} xl:col-span-4`}>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={t('hero.maxPrice')}
                value={maximumPrice}
                onChange={e => {
                  setMaximumPrice(e.target.value.replace(/[^0-9]/g, ''));
                  setPriceError('');
                }}
                className={inputClass}
              />
            </div>
          </form>
          {priceError && (
            <p className="px-2 pt-2 text-[13px] font-semibold text-brand-danger">
              {priceError}
            </p>
          )}
        </div>
      </motion.div>

    </section>
  );
};

export default Hero;
