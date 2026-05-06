'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from '@/lib/contexts/LanguageContext';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const locations = (t('header.locations') as unknown as string[]) || [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.445 0 .081 5.363.079 11.971c0 2.112.552 4.175 1.599 6.011L0 24l6.149-1.613a11.847 11.847 0 005.897 1.584h.005c6.604 0 11.967-5.363 11.97-11.972a11.85 11.85 0 00-3.561-8.432" />
    </svg>
  );

  const FacebookIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );

  const InstagramIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );

  const handleDropdownClick = (title: string) => {
    if (activeDropdown === title) {
      // If title is "Buy" (or localized version), go to /properties?unitType=Buy
      const buyTitle = t('header.buy');
      if (title === buyTitle) {
        router.push('/properties?unitType=Buy');
      } else {
        router.push('/properties');
      }
      setActiveDropdown(null);
    } else {
      setActiveDropdown(title);
    }
  };

  const NavDropdown = ({ title, type, items }: { title: string, type?: string, items?: { label: string, href: string }[] }) => (
    <div className="relative">
      <button 
        onClick={() => handleDropdownClick(title)}
        className="flex items-center gap-2 text-[0.9375rem] font-medium text-brand-primary hover:text-[#c7b7a1] transition-colors py-2 outline-none cursor-pointer"
      >
        {title}
        <ChevronDown size={16} className={`transition-transform duration-300 ${activeDropdown === title ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {activeDropdown === title && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white shadow-[0_15px_50px_rgba(0,0,0,0.12)] rounded-2xl p-6 ${items ? 'min-w-[200px]' : 'min-w-[450px]'} border border-gray-100 z-[100]`}
          >
            <div className={`grid ${items ? 'grid-cols-1' : 'grid-cols-2'} gap-x-12 gap-y-1`}>
              {items ? (
                items.map((item) => (
                  <Link 
                    key={item.label} 
                    href={item.href}
                    onClick={() => setActiveDropdown(null)}
                    className="text-[#1B2134] hover:text-[#c7b7a1] py-3 text-[0.9375rem] font-semibold transition-colors border-b border-gray-50 last:border-0 hover:translate-x-1 transition-transform"
                  >
                    {item.label}
                  </Link>
                ))
              ) : (
                Array.isArray(locations) && locations.map((loc) => (
                  <Link 
                    key={loc} 
                    href={`/properties?type=${type}&location=${loc}`}
                    onClick={() => setActiveDropdown(null)}
                    className="text-[#1B2134] hover:text-[#c7b7a1] py-3 text-[0.9375rem] font-medium transition-colors border-b border-gray-50 last:border-0 hover:translate-x-1 transition-transform"
                  >
                    {loc}
                  </Link>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Hide header on admin pages
  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-48px)] max-w-[1440px]">
        <header className="w-full bg-white rounded-[100px] shadow-md py-6 px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image 
                src="/assists/header/headerLogo.png" 
                alt="THE GATE ESTATES" 
                width={190} 
                height={55} 
                priority
                className="h-[35px] md:h-auto w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6" ref={dropdownRef}>
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-[0.9375rem] font-medium text-brand-primary hover:text-[#c7b7a1] transition-colors"
              >
                {t('header.home')}
              </Link>
              <Link href="/projects" className="text-[0.9375rem] font-medium text-brand-primary hover:text-[#c7b7a1] transition-colors">
                {t('header.projects')}
              </Link>
              
              <NavDropdown 
                title={t('header.buy')} 
                items={[
                  { label: t('header.primary'), href: "/properties?unitType=Buy&status=primary" },
                  { label: t('header.resale'), href: "/properties?unitType=Buy&status=resale" }
                ]} 
              />
              <Link href="/properties?unitType=Rent" className="text-[0.9375rem] font-medium text-brand-primary hover:text-[#c7b7a1] transition-colors">
                {t('header.rent')}
              </Link>

              <Link href="/about" className="text-[0.9375rem] font-medium text-brand-primary hover:text-[#c7b7a1] transition-colors">{t('header.about')}</Link>
              <Link href="/contact" className="text-[0.9375rem] font-medium text-brand-primary hover:text-[#c7b7a1] transition-colors">{t('header.contact')}</Link>
              <Link href="/blogs" className="text-[0.9375rem] font-medium text-brand-primary hover:text-[#c7b7a1] transition-colors">{t('header.blogs')}</Link>
            </div>

            {/* Social Links & Language */}
            <div className="flex items-center gap-4 px-4 border-l border-gray-200">
              <a href="https://www.facebook.com/share/1Cjkb7qK75/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:text-[#1877F2] transition-colors">
                <FacebookIcon size={20} />
              </a>
              <a href="https://www.instagram.com/p/DXu6hy4l3E1/?igsh=eHVwa3A4YmlyM2sw" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:text-[#E4405F] transition-colors">
                <InstagramIcon size={20} />
              </a>
              <a href="https://wa.me/message/2CFJ7MIUOG3AM1" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:text-[#25D366] transition-colors">
                <WhatsAppIcon size={20} />
              </a>
              
              {/* Language Switcher */}
              <div className="relative" ref={langRef}>
                <button 
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-1 text-brand-primary hover:text-[#c7b7a1] transition-colors ml-2"
                >
                  <Globe size={20} />
                  <span className="text-[14px] font-semibold uppercase">{language}</span>
                </button>
                <AnimatePresence>
                  {showLangMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-3 w-32 bg-white shadow-xl rounded-xl py-2 z-[110] border border-gray-100"
                    >
                      <button onClick={() => { setLanguage('en'); setShowLangMenu(false); }} className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${language === 'en' ? 'font-bold text-[#c7b7a1]' : 'text-[#1B2134]'}`}>English</button>
                      <button onClick={() => { setLanguage('de'); setShowLangMenu(false); }} className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${language === 'de' ? 'font-bold text-[#c7b7a1]' : 'text-[#1B2134]'}`}>Deutsch</button>
                      <button onClick={() => { setLanguage('pl'); setShowLangMenu(false); }} className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${language === 'pl' ? 'font-bold text-[#c7b7a1]' : 'text-[#1B2134]'}`}>Polski</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* List Your Property Button */}
            <Link 
              href="/list-property"
              className="bg-[#1B2134] text-white px-6 py-3 rounded-full font-semibold text-[15px] hover:bg-[#c7b7a1] transition-all whitespace-nowrap shadow-sm"
            >
              {t('header.listProperty')}
            </Link>
          </nav>

          {/* Mobile Hamburger Menu */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="flex lg:hidden flex-col justify-center items-end gap-[6px] cursor-pointer outline-none bg-transparent border-none p-2"
          >
            <span className="block w-8 h-[3px] bg-[#1b2134] rounded-full"></span>
            <span className="block w-8 h-[3px] bg-[#1b2134] rounded-full"></span>
            <span className="block w-8 h-[3px] bg-[#1b2134] rounded-full"></span>
          </button>
        </header>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[60] overflow-y-auto font-poppins flex flex-col"
          >
            {/* Header of Menu */}
            <div className="flex items-center justify-between py-8 px-8">
              <Image 
                src="/assists/header/headerLogo.png" 
                alt="THE GATE ESTATES" 
                width={160} 
                height={45} 
                className="h-auto w-auto"
              />
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="text-[#1b2134] p-2"
              >
                <X size={28} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 px-8 py-4 flex flex-col gap-6 pb-12">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-[20px] font-semibold text-[#1b2134] border-b border-gray-100 pb-2">{t('header.home')}</Link>
              <Link href="/projects" onClick={() => setIsMenuOpen(false)} className="text-[20px] font-semibold text-[#1b2134] border-b border-gray-100 pb-2">{t('header.projects')}</Link>
              
              {/* Buy Mobile */}
              <div>
                <button 
                  onClick={() => {
                    if (mobileExpanded === 'buy') {
                      router.push('/properties?unitType=Buy');
                      setIsMenuOpen(false);
                    } else {
                      setMobileExpanded('buy');
                    }
                  }}
                  className="w-full flex items-center justify-between text-[20px] font-semibold text-[#1b2134] border-b border-gray-100 pb-2 cursor-pointer"
                >
                  {t('header.buy')}
                  {mobileExpanded === 'buy' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <AnimatePresence>
                  {mobileExpanded === 'buy' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-[#F8F5F0] rounded-xl mt-2"
                    >
                      {[
                        { label: t('header.primary'), href: "/properties?unitType=Buy&status=primary" },
                        { label: t('header.resale'), href: "/properties?unitType=Buy&status=resale" }
                      ].map(item => (
                        <Link 
                          key={item.label} 
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-6 py-3 text-[#1b2134] font-medium border-b border-white last:border-0"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Rent Mobile */}
              <Link href="/properties?unitType=Rent" onClick={() => setIsMenuOpen(false)} className="text-[20px] font-semibold text-[#1b2134] border-b border-gray-100 pb-2">
                {t('header.rent')}
              </Link>

              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-[20px] font-semibold text-[#1b2134] border-b border-gray-100 pb-2">{t('header.about')}</Link>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-[20px] font-semibold text-[#1b2134] border-b border-gray-100 pb-2">{t('header.contact')}</Link>
              <Link href="/blogs" onClick={() => setIsMenuOpen(false)} className="text-[20px] font-semibold text-[#1b2134] border-b border-gray-100 pb-2">{t('header.blogs')}</Link>

              <div className="mt-6">
                <Link 
                  href="/list-property" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full bg-[#1B2134] text-white text-center py-4 rounded-full font-bold text-[18px] shadow-lg active:scale-95 transition-all"
                >
                  {t('header.listProperty')}
                </Link>
              </div>

              <div className="flex items-center justify-center gap-8 mt-4">
                <a href="https://www.facebook.com/share/1Cjkb7qK75/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-[#1B2134] hover:text-[#1877F2] transition-colors"><FacebookIcon size={28} /></a>
                <a href="https://www.instagram.com/p/DXu6hy4l3E1/?igsh=eHVwa3A4YmlyM2sw" target="_blank" rel="noopener noreferrer" className="text-[#1B2134] hover:text-[#E4405F] transition-colors"><InstagramIcon size={28} /></a>
                <a href="https://wa.me/message/2CFJ7MIUOG3AM1" target="_blank" rel="noopener noreferrer" className="text-[#1B2134] hover:text-[#25D366] transition-colors"><WhatsAppIcon size={28} /></a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
