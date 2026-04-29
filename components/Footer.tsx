import Link from "next/link";
import Image from "next/image";
import { Phone, Earth, MapPin, ChevronDown } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1B2134] text-white py-16 px-6 md:px-20 font-poppins">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Column 1: Logo & About */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center">
             <Image 
              src="/assists/footer/logoIcon.png" 
              alt="THE GATE ESTATES" 
              width={200} 
              height={60}
              className="mb-4"
            />
            <div className="h-[1px] w-full bg-white/20 mb-6"></div>
          </div>
          <p className="text-[16px] leading-[1.6] text-[#D9D9D9] max-w-[300px]">
            Every journey is a chance to find your perfect home, enjoy comfort, and create lasting memories guided by care, quality, and local expertise.
          </p>
        </div>

        {/* Column 2: Quick Action */}
        <div className="flex flex-col gap-6">
          <h3 className="text-[20px] font-semibold">Quick action</h3>
          <ul className="flex flex-col gap-4 text-[#D9D9D9]">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
              Projects <ChevronDown size={16} />
            </li>
            <li><Link href="#about" className="hover:text-white transition-colors">About Us</Link></li>
            <li className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
              Properties <ChevronDown size={16} />
            </li>
            <li><Link href="#blogs" className="hover:text-white transition-colors">Blogs</Link></li>
            <li><Link href="#contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link href="#faq" className="hover:text-white transition-colors">FAQ</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact Us */}
        <div className="flex flex-col gap-6">
          <h3 className="text-[20px] font-semibold">contact Us</h3>
          <ul className="flex flex-col gap-6 text-[#D9D9D9]">
            <li className="flex items-center gap-4">
              <Phone size={20} />
              <span>+00 (123) 456 889</span>
            </li>
            <li className="flex items-center gap-4">
              <Earth size={20} />
              <span>contact@example.com</span>
            </li>
            <li className="flex items-center gap-4">
              <MapPin size={20} />
              <span>583 Main Street, NY, USA</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Follow Us */}
        <div className="flex flex-col gap-6">
          <h3 className="text-[20px] font-semibold">Follow Us</h3>
          <div className="flex gap-6">
            <Link href="#" className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <svg 
                viewBox="0 0 24 24" 
                width="24" 
                height="24" 
                fill="currentColor"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </Link>
            <Link href="#" className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <svg 
                viewBox="0 0 24 24" 
                width="24" 
                height="24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </Link>
            <Link href="#" className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <svg 
                viewBox="0 0 24 24" 
                width="24" 
                height="24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </Link>
            <Link href="#" className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <svg 
                viewBox="0 0 24 24" 
                width="24" 
                height="24" 
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-20 pt-8 border-t border-white/10 text-center text-[14px] text-[#D9D9D9]">
        <p>Powered By Tech Gear Solutions © 2026 All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
