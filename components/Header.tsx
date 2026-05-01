'use client';

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const [isPropertiesExpanded, setIsPropertiesExpanded] = useState(true);

  const subLocations = [
    ["El Gouna", "El kawther"],
    ["Arabia", "Al Ahyaa"],
    ["sheraton", "Makadi Bay"]
  ];

  // Hide header on admin pages
  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-48px)] max-w-[1280px]">
        <header className="w-full bg-white rounded-[100px] shadow-md py-4 px-8 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image 
                src="/assists/header/headerLogo.png" 
                alt="THE GATE ESTATES" 
                width={160} 
                height={45} 
                priority
                className="h-auto w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-12">
            <div className="flex items-center gap-10">
              <Link
                href="/"
                className="text-[18px] font-medium text-brand-primary"
              >
                Home
              </Link>
              <div className="flex items-center gap-6">
                <Link href="#projects" className="flex items-center gap-2 text-[18px] font-medium text-brand-primary">
                  Projects
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </Link>
                <Link href="#about" className="text-[18px] font-medium text-brand-primary">About Us</Link>
                <Link href="#properties" className="flex items-center gap-2 text-[18px] font-medium text-brand-primary">
                  Properties
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </Link>
                <Link href="#contact" className="text-[18px] font-medium text-brand-primary">Contact Us</Link>
                <Link href="#blogs" className="text-[18px] font-medium text-brand-primary">Blogs</Link>
              </div>
            </div>

            {/* List Your Property Button */}
            <Link 
              href="/list-property"
              className="bg-brand-primary text-white px-8 py-3 rounded-full text-[16px] font-medium hover:bg-brand-secondary transition-colors"
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
            <div className="flex flex-col">
              <button 
                className="flex items-center gap-3 text-[18px] font-medium text-[#1b2134] text-left outline-none"
                onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
              >
                Projects
                <svg className={`w-[14px] h-[8px] transition-transform duration-300 ${isProjectsExpanded ? 'rotate-180' : ''}`} viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M1 1L6 6L11 1" />
                </svg>
              </button>
              
              {isProjectsExpanded && (
                <div className="mt-8 mb-4 px-4">
                  <div className="w-full grid grid-cols-2">
                    {subLocations.map((row, i) => (
                      <React.Fragment key={i}>
                        <div className={`py-4 text-center text-[15px] text-[#444] border-r border-[#e5e5e5] ${i !== subLocations.length - 1 ? 'border-b border-[#e5e5e5]' : ''}`}>
                          {row[0]}
                        </div>
                        <div className={`py-4 text-center text-[15px] text-[#444] ${i !== subLocations.length - 1 ? 'border-b border-[#e5e5e5]' : ''}`}>
                          {row[1]}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* About Us */}
            <div>
              <Link href="#about" onClick={() => setIsMenuOpen(false)} className="text-[18px] font-medium text-[#1b2134]">
                About Us
              </Link>
            </div>

            {/* Properties */}
            <div className="flex flex-col">
              <button 
                className="flex items-center gap-3 text-[18px] font-medium text-[#1b2134] text-left outline-none"
                onClick={() => setIsPropertiesExpanded(!isPropertiesExpanded)}
              >
                Properties
                <svg className={`w-[14px] h-[8px] transition-transform duration-300 ${isPropertiesExpanded ? 'rotate-180' : ''}`} viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M1 1L6 6L11 1" />
                </svg>
              </button>
              
              {isPropertiesExpanded && (
                <div className="mt-8 mb-4 px-4">
                  <div className="w-full grid grid-cols-2">
                    {subLocations.map((row, i) => (
                      <React.Fragment key={i}>
                        <div className={`py-4 text-center text-[15px] text-[#444] border-r border-[#e5e5e5] ${i !== subLocations.length - 1 ? 'border-b border-[#e5e5e5]' : ''}`}>
                          {row[0]}
                        </div>
                        <div className={`py-4 text-center text-[15px] text-[#444] ${i !== subLocations.length - 1 ? 'border-b border-[#e5e5e5]' : ''}`}>
                          {row[1]}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Us */}
            <div>
              <Link href="#contact" onClick={() => setIsMenuOpen(false)} className="text-[18px] font-medium text-[#1b2134]">
                Contact Us
              </Link>
            </div>

            {/* Blogs */}
            <div>
              <Link href="#blogs" onClick={() => setIsMenuOpen(false)} className="text-[18px] font-medium text-[#1b2134]">
                Blogs
              </Link>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Header;
