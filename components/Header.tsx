'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from '@/lib/contexts/LanguageContext';
import BrandLogo from '@/components/BrandLogo';
import { BRAND_NAME } from '@/lib/brand';

const Header = () => {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const isHomePage = pathname === `/${language}` || pathname === '/';
  const isTransparentHomeHeader = isHomePage && !isScrolled;
  const headerBgClass = isTransparentHomeHeader
    ? 'bg-transparent py-6'
    : 'bg-brand-primary shadow-md py-4';
  const textColorClass = 'text-white';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
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

  // Hide header on admin pages
  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${headerBgClass}`}>
        <header className="w-full max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <div className="min-w-0 flex-shrink-0">
            <Link href={`/${language}`} className="flex min-w-0 items-center gap-3">
              <BrandLogo
                variant="light"
                lockup="mark"
                priority
                className="h-[52px] w-[56px] shrink-0 object-contain transition-all duration-300 md:h-[62px] md:w-[67px]"
              />
              <span className="hidden min-w-0 flex-col leading-tight sm:flex">
                <span className="truncate font-radley text-[24px] text-white md:text-[28px]">
                  The Rook
                </span>
                <span className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80 md:text-[12px]">
                  Real Estate Investment
                </span>
              </span>
              <span className="sr-only">{BRAND_NAME}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-6">
              <Link
                href={`/${language}`}
                className={`text-[0.9375rem] font-medium ${textColorClass} hover:text-brand-secondary transition-colors`}
              >
                {t('header.home')}
              </Link>
              <Link
                href={`/${language}/projects`}
                className={`text-[0.9375rem] font-medium ${textColorClass} hover:text-brand-secondary transition-colors`}
              >
                {t('header.projects')}
              </Link>
              
              <Link
                href={`/${language}/properties?unitType=Buy&status=resale`}
                className={`text-[0.9375rem] font-medium ${textColorClass} hover:text-brand-secondary transition-colors`}
              >
                {t('header.resale')}
              </Link>

              <Link href={`/${language}/about`} className={`text-[0.9375rem] font-medium ${textColorClass} hover:text-brand-secondary transition-colors`}>{t('header.about')}</Link>
              <Link href={`/${language}/contact`} className={`text-[0.9375rem] font-medium ${textColorClass} hover:text-brand-secondary transition-colors`}>{t('header.contact')}</Link>
              <Link href={`/${language}/blogs`} className={`text-[0.9375rem] font-medium ${textColorClass} hover:text-brand-secondary transition-colors`}>{t('header.blogs')}</Link>
            </div>

            {/* Language & Action */}
            <div className="flex items-center gap-4 px-4 border-l border-white/20">
              {/* Language Switcher */}
              <div className="relative" ref={langRef}>
                <button 
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className={`flex items-center gap-1 ${textColorClass} hover:text-brand-secondary transition-colors ml-2`}
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
                      className="absolute top-full right-0 mt-3 w-32 bg-white shadow-xl rounded-xl py-2 z-[110] border border-brand-divider"
                    >
                      <button onClick={() => { setLanguage('en'); setShowLangMenu(false); }} className={`w-full text-left px-4 py-2 hover:bg-brand-bg transition-colors ${language === 'en' ? 'font-bold text-brand-secondary' : 'text-brand-primary'}`}>English</button>
                      <button onClick={() => { setLanguage('de'); setShowLangMenu(false); }} className={`w-full text-left px-4 py-2 hover:bg-brand-bg transition-colors ${language === 'de' ? 'font-bold text-brand-secondary' : 'text-brand-primary'}`}>Deutsch</button>
                      <button onClick={() => { setLanguage('it'); setShowLangMenu(false); }} className={`w-full text-left px-4 py-2 hover:bg-brand-bg transition-colors ${language === 'it' ? 'font-bold text-brand-secondary' : 'text-brand-primary'}`}>Italiano</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* List Your Property Button */}
            <Link 
              href={`/${language}/list-property`}
              className="bg-brand-secondary text-white px-6 py-2.5 rounded-full font-bold text-[14px] hover:bg-brand-primary transition-all whitespace-nowrap shadow-sm"
            >
              {t('header.listProperty')}
            </Link>
          </nav>

          {/* Mobile Hamburger Menu */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className={`flex lg:hidden flex-col justify-center items-end gap-[6px] cursor-pointer outline-none bg-transparent border-none p-2 ${textColorClass}`}
          >
            <span className="block w-8 h-[3px] bg-current rounded-full"></span>
            <span className="block w-8 h-[3px] bg-current rounded-full"></span>
            <span className="block w-8 h-[3px] bg-current rounded-full"></span>
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
              <Link href={`/${language}`} onClick={() => setIsMenuOpen(false)} className="flex min-w-0 items-center gap-3">
                <BrandLogo
                  variant="charcoal"
                  lockup="mark"
                  className="h-[60px] w-[65px] shrink-0 object-contain"
                />
                <span className="min-w-0 flex flex-col leading-tight">
                  <span className="truncate font-radley text-[25px] text-brand-primary">
                    The Rook
                  </span>
                  <span className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-muted">
                    Real Estate Investment
                  </span>
                </span>
                <span className="sr-only">{BRAND_NAME}</span>
              </Link>
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="text-brand-primary p-2"
              >
                <X size={28} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 px-8 py-4 flex flex-col gap-6 pb-12">
              <Link href={`/${language}`} onClick={() => setIsMenuOpen(false)} className="text-[20px] font-semibold text-brand-primary border-b border-brand-divider pb-2">{t('header.home')}</Link>
              <Link href={`/${language}/projects`} onClick={() => setIsMenuOpen(false)} className="text-[20px] font-semibold text-brand-primary border-b border-brand-divider pb-2">{t('header.projects')}</Link>
              
              <Link href={`/${language}/properties?unitType=Buy&status=resale`} onClick={() => setIsMenuOpen(false)} className="text-[20px] font-semibold text-brand-primary border-b border-brand-divider pb-2">{t('header.resale')}</Link>

              <Link href={`/${language}/about`} onClick={() => setIsMenuOpen(false)} className="text-[20px] font-semibold text-brand-primary border-b border-brand-divider pb-2">{t('header.about')}</Link>
              <Link href={`/${language}/contact`} onClick={() => setIsMenuOpen(false)} className="text-[20px] font-semibold text-brand-primary border-b border-brand-divider pb-2">{t('header.contact')}</Link>
              <Link href={`/${language}/blogs`} onClick={() => setIsMenuOpen(false)} className="text-[20px] font-semibold text-brand-primary border-b border-brand-divider pb-2">{t('header.blogs')}</Link>

              <div className="mt-6">
                <Link 
                  href={`/${language}/list-property`} 
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full bg-brand-primary text-white text-center py-4 rounded-full font-bold text-[18px] shadow-lg active:scale-95 transition-all"
                >
                  {t('header.listProperty')}
                </Link>
              </div>

              <div className="flex items-center justify-center gap-8 mt-4">
                <a href="https://www.facebook.com/share/1Cjkb7qK75/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:text-social-facebook transition-colors"><FacebookIcon size={28} /></a>
                <a href="https://www.instagram.com/p/DXu6hy4l3E1/?igsh=eHVwa3A4YmlyM2sw" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:text-social-instagram transition-colors"><InstagramIcon size={28} /></a>
                <a href="https://wa.me/01200339790" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:text-social-whatsapp transition-colors"><WhatsAppIcon size={28} /></a>
              </div>

              {/* Language Switcher */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-[12px] font-semibold text-brand-secondary uppercase tracking-[0.2em] mb-3">{t('header.language')}</p>
                <div className="flex gap-3">
                  {(['en', 'de', 'it'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setIsMenuOpen(false); }}
                      className={`flex-1 py-2.5 rounded-full text-[14px] font-bold border transition-all ${
                        language === lang
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'bg-transparent text-brand-primary border-brand-divider hover:border-brand-secondary'
                      }`}
                    >
                      {lang === 'en' ? 'EN' : lang === 'de' ? 'DE' : 'IT'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
