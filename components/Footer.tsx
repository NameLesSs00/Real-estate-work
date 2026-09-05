'use client';

import Link from "next/link";
import { Phone, Earth, MapPin } from "lucide-react";
import { usePathname } from "next/navigation";

import { useLanguage } from '@/lib/contexts/LanguageContext';
import BrandLogo from "@/components/BrandLogo";

const Footer = () => {
  const { t, language } = useLanguage();
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-brand-primary text-white py-12 md:py-16 px-6 md:px-20 font-poppins border-t border-brand-secondary">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Column 1: Logo & About */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-start">
             <BrandLogo
              variant="light"
              lockup="full"
              className="mb-6 h-auto w-[180px] object-contain"
            />
            <div className="h-[2px] w-12 bg-brand-secondary mb-6"></div>
          </div>
          <p className="text-[15px] leading-[1.8] text-brand-bg max-w-[300px]">
            {t('footer.about')}
          </p>
        </div>

        {/* Column 2: Quick Action */}
        <div className="flex flex-col gap-6">
          <h3 className="text-[20px] font-bold font-radley text-white">{t('footer.usefulLinks')}</h3>
          <ul className="flex flex-col gap-4 text-brand-bg font-medium">
            <li><Link href={`/${language}`} className="hover:text-brand-secondary hover:translate-x-1 inline-block transition-all">{t('header.home')}</Link></li>
            <li>
              <Link href={`/${language}/projects`} className="flex items-center gap-2 hover:text-brand-secondary hover:translate-x-1 transition-all w-fit">
                {t('header.projects')} 
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </Link>
            </li>
            <li><Link href={`/${language}/about`} className="hover:text-brand-secondary hover:translate-x-1 inline-block transition-all">{t('header.about')}</Link></li>
            <li>
              <Link href={`/${language}/properties?unitType=Buy&status=resale`} className="flex items-center gap-2 hover:text-brand-secondary hover:translate-x-1 transition-all w-fit">
                {t('header.resale')} 
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </Link>
            </li>
            <li><Link href={`/${language}/blogs`} className="hover:text-brand-secondary hover:translate-x-1 inline-block transition-all">{t('header.blogs')}</Link></li>
            <li><Link href={`/${language}/faq`} className="hover:text-brand-secondary hover:translate-x-1 inline-block transition-all">{t('header.faq')}</Link></li>
            <li><Link href={`/${language}/contact`} className="hover:text-brand-secondary hover:translate-x-1 inline-block transition-all">{t('header.contact')}</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact Us */}
        <div className="flex flex-col gap-6">
          <h3 className="text-[20px] font-bold font-radley text-white">{t('footer.contactTitle')}</h3>
          <ul className="flex flex-col gap-6 text-brand-bg font-medium">
            <li className="flex items-start gap-4 group">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-brand-secondary transition-colors">
                <Phone size={16} className="text-brand-secondary group-hover:text-white transition-colors" />
              </div>
              <a href="tel:01200339790" className="hover:text-brand-secondary transition-colors break-all mt-1">01200339790</a>
            </li>
            <li className="flex items-start gap-4 group">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-brand-secondary transition-colors">
                <Earth size={16} className="text-brand-secondary group-hover:text-white transition-colors" />
              </div>
              <a href="mailto:Info@thegate-realestate.com" className="hover:text-brand-secondary transition-colors break-all mt-1">Info@thegate-realestate.com</a>
            </li>
            <li className="flex items-start gap-4 group">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-brand-secondary transition-colors">
                <MapPin size={16} className="text-brand-secondary group-hover:text-white transition-colors" />
              </div>
              <span className="break-words mt-1 leading-relaxed">Hurghada, El Kawther</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Follow Us */}
        <div className="flex flex-col gap-6">
          <h3 className="text-[20px] font-bold font-radley text-white">{t('footer.stayConnected')}</h3>
          <div className="flex gap-4">
            <a 
              href="https://www.facebook.com/share/1Cjkb7qK75/?mibextid=wwXIfr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-brand-secondary hover:-translate-y-1 transition-all shadow-md"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/p/DXu6hy4l3E1/?igsh=eHVwa3A4YmlyM2sw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-brand-secondary hover:-translate-y-1 transition-all shadow-md"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a 
              href="https://wa.me/01200339790" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-brand-secondary hover:-translate-y-1 transition-all shadow-md"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.445 0 .081 5.363.079 11.971c0 2.112.552 4.175 1.599 6.011L0 24l6.149-1.613a11.847 11.847 0 005.897 1.584h.005c6.604 0 11.967-5.363 11.97-11.972a11.85 11.85 0 00-3.561-8.432" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-20 pt-8 border-t border-white/15 text-center text-[14px] text-brand-muted-light font-medium">
        <p>
          {t('footer.copyright')} Powered By{" "}
          <a 
            href="https://tech-gear.net/" 
            className="inline-block text-white hover:text-brand-secondary hover:-translate-y-0.5 transition-all duration-300 font-bold"
          >
            Tech Gear Solutions
          </a>{" "}
          © 2026
        </p>
      </div>
    </footer>
  );
};

export default Footer;
