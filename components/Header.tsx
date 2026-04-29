import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-48px)] max-w-[1280px]">
      <header className="w-full bg-white rounded-[60px] shadow-sm py-4 px-10 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Image 
            src="/assists/header/headerLogo.png" 
            alt="THE GATE ESTATES" 
            width={160} 
            height={40} 
            priority
            className="h-auto w-auto"
          />
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className="px-6 py-2 bg-[#F8F5F0] rounded-[30px] text-[18px] font-medium text-brand-primary"
          >
            Home
          </Link>
          <div className="flex items-center gap-10 ml-6">
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
        </nav>
      </header>
    </div>
  );
};

export default Header;
