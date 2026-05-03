'use client';

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-48px)] max-w-[1440px]">
        <header className="w-full bg-white rounded-[100px] shadow-md py-5 px-10 md:px-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image 
                src="/assists/header/headerLogo.png" 
                alt="THE GATE ESTATES" 
                width={190} 
                height={55} 
                priority
                className="h-auto w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-12">
            <div className="flex items-center gap-12">
              <Link
                href="/"
                className="text-[18px] font-medium text-brand-primary"
              >
                Home
              </Link>
              <div className="flex items-center gap-6">
                <Link href="/projects" className="flex items-center gap-2 text-[18px] font-medium text-brand-primary">
                  Projects
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </Link>
                <Link href="/about" className="text-[18px] font-medium text-brand-primary">About Us</Link>
                <Link href="/properties" className="flex items-center gap-2 text-[18px] font-medium text-brand-primary">
                  Properties
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </Link>
                <Link href="/contact" className="text-[18px] font-medium text-brand-primary">Contact Us</Link>
                <Link href="/blogs" className="text-[18px] font-medium text-brand-primary">Blogs</Link>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 px-4 border-l border-gray-200">
              <a 
                href="https://www.facebook.com/share/1Cjkb7qK75/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-primary hover:opacity-70 transition-opacity"
              >
                <FacebookIcon size={20} />
              </a>
              <a 
                href="https://www.instagram.com/p/DXu6hy4l3E1/?igsh=eHVwa3A4YmlyM2sw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-primary hover:opacity-70 transition-opacity"
              >
                <InstagramIcon size={20} />
              </a>
              <a 
                href="https://wa.me/message/2CFJ7MIUOG3AM1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-primary hover:opacity-70 transition-opacity"
              >
                <WhatsAppIcon size={20} />
              </a>
            </div>

            {/* List Your Property Button */}
            <Link 
              href="/list-property"
              className="bg-[#16273B] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1a304a] transition-all whitespace-nowrap"
            >
              List Your Property
            </Link>
          </nav>

          {/* Mobile Hamburger Menu */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="flex lg:hidden flex-col justify-center items-end gap-[6px] cursor-pointer outline-none bg-transparent border-none p-2 hover:opacity-80 transition-opacity"
          >
            <span className="block w-8 h-[3px] bg-[#1b2134] rounded-full"></span>
            <span className="block w-8 h-[3px] bg-[#1b2134] rounded-full"></span>
            <span className="block w-8 h-[3px] bg-[#1b2134] rounded-full"></span>
          </button>
        </header>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-[60] overflow-y-auto font-poppins flex flex-col">
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
              className="text-[#1b2134] p-2 hover:opacity-70 transition-opacity"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 px-8 py-4 flex flex-col gap-8 pb-12">
            
            {/* Home */}
            <div>
              <Link 
                href="/" 
                onClick={() => setIsMenuOpen(false)} 
                className="inline-block px-8 py-3 bg-[#F8F5F0] rounded-[30px] text-[18px] font-medium text-[#1b2134]"
              >
                Home
              </Link>
            </div>

            {/* Projects */}
            <div>
              <Link
                href="/projects"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-[18px] font-medium text-[#1b2134] text-left"
              >
                Projects
                <svg className="w-[14px] h-[8px]" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M1 1L6 6L11 1" />
                </svg>
              </Link>
            </div>

            {/* About Us */}
            <div>
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-[18px] font-medium text-[#1b2134]">
                About Us
              </Link>
            </div>

            {/* Properties */}
            <div>
              <Link 
                href="/properties"
                className="text-[18px] font-medium text-[#1b2134] text-left outline-none"
                onClick={() => setIsMenuOpen(false)}
              >
                Properties
              </Link>
            </div>

            {/* Contact Us */}
            <div>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-[18px] font-medium text-[#1b2134]">
                Contact Us
              </Link>
            </div>

            {/* Blogs */}
            <div>
              <Link href="/blogs" onClick={() => setIsMenuOpen(false)} className="text-[18px] font-medium text-[#1b2134]">
                Blogs
              </Link>
            </div>

            {/* List Your Property Button (Mobile) */}
            <div className="mt-4">
              <Link 
                href="/list-property" 
                onClick={() => setIsMenuOpen(false)}
                className="block w-full bg-[#16273B] text-white text-center py-5 rounded-full font-bold text-[18px] shadow-lg active:scale-95 transition-all"
              >
                List Your Property
              </Link>
            </div>

            {/* Social Links (Mobile) */}
            <div className="flex items-center justify-center gap-8 mt-8 pb-8 border-t border-gray-100 pt-8">
              <a 
                href="https://www.facebook.com/share/1Cjkb7qK75/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-primary hover:opacity-70 transition-opacity"
              >
                <FacebookIcon size={28} />
              </a>
              <a 
                href="https://www.instagram.com/p/DXu6hy4l3E1/?igsh=eHVwa3A4YmlyM2sw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-primary hover:opacity-70 transition-opacity"
              >
                <InstagramIcon size={28} />
              </a>
              <a 
                href="https://wa.me/message/2CFJ7MIUOG3AM1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-primary hover:opacity-70 transition-opacity"
              >
                <WhatsAppIcon size={28} />
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Header;
