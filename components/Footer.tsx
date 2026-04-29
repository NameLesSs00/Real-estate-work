import Link from "next/link";
import Image from "next/image";
import { Phone, Globe, MapPin, Facebook, Instagram, Twitter, ChevronDown } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1B2134] text-white py-16 px-6 md:px-20 font-poppins">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Column 1: Logo & About */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col">
             <Image 
              src="/assists/footer/logoIcon.png" 
              alt="THE GATE ESTATES" 
              width={200} 
              height={60}
              className="mb-4"
            />
            <div className="h-[2px] w-full bg-[#D9D9D9] opacity-20 mb-6"></div>
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
              <Globe size={20} />
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
              <Facebook size={24} />
            </Link>
            <Link href="#" className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Instagram size={24} />
            </Link>
            <Link href="#" className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <svg 
                viewBox="0 0 24 24" 
                width="24" 
                height="24" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </Link>
            <Link href="#" className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Twitter size={24} />
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
