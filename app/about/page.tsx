import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white pt-32">
      {/* Vision & Mission Section */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-20 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <h2 className="text-[28px] md:text-[34px] font-radley text-[#1B2134]">Our Vision</h2>
            <p className="text-[15px] md:text-[17px] text-[#555555] leading-relaxed font-poppins">
              To redefine the real estate experience by making it more transparent, 
              accessible, and tailored to modern lifestyles. We aim to connect people with 
              spaces that truly inspire how they live, work, and grow.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-[28px] md:text-[34px] font-radley text-[#1B2134]">Our Mission</h2>
            <p className="text-[15px] md:text-[17px] text-[#555555] leading-relaxed font-poppins">
              To guide our clients through every step of their property journey with honesty, 
              expertise, and care. We are committed to delivering exceptional service, 
              curated property selections, and a seamless experience that builds long-term trust.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-[32px] md:text-[42px] font-radley text-[#1B2134] leading-tight">Your Property Journey Starts With Us</h2>
            <p className="text-[15px] md:text-[17px] text-[#555555] leading-relaxed font-poppins">
              We are a real estate company dedicated to helping you find the perfect property across Egypt. 
              From modern apartments and luxury villas to smart investment opportunities, 
              we make your journey to buying or renting seamless, reliable, and rewarding.
            </p>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[600px] aspect-[4/5]">
            <Image 
              src="/assists/aboutUs/aboutUS.png" 
              alt="Our Vision and Mission" 
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* What We Offer? Section */}
      <section className="w-full px-6 md:px-12 py-24">
        <h2 className="text-[38px] md:text-[52px] font-radley text-[#1B2134] text-center mb-16">What We Offer?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Card 1: Property Sales */}
          <div className="bg-[#F8F5F080] rounded-[40px] px-8 py-12 flex flex-col items-center text-center gap-6 transition-transform hover:scale-[1.02]">
            <div className="w-28 h-28 bg-[#F8F5F080] rounded-full flex items-center justify-center">
              <Image src="/assists/aboutUs/money.png" alt="Property Sales" width={64} height={64} />
            </div>
            <h3 className="text-[22px] md:text-[26px] font-semibold text-[#1B2134] font-poppins">Property Sales</h3>
            <p className="text-[15px] md:text-[17px] text-[#666] leading-relaxed font-poppins max-w-[450px]">
              Discover a wide range of carefully selected properties for sale, from ready-to-move homes to high-potential investment projects.
            </p>
          </div>

          {/* Card 2: Property Rentals */}
          <div className="bg-[#F8F5F080] rounded-[40px] px-8 py-12 flex flex-col items-center text-center gap-6 transition-transform hover:scale-[1.02]">
            <div className="w-28 h-28 bg-[#F8F5F080] rounded-full flex items-center justify-center">
              <Image src="/assists/aboutUs/home.png" alt="Property Rentals" width={64} height={64} />
            </div>
            <h3 className="text-[22px] md:text-[26px] font-semibold text-[#1B2134] font-poppins">Property Rentals</h3>
            <p className="text-[15px] md:text-[17px] text-[#666] leading-relaxed font-poppins max-w-[450px]">
              Find flexible rental options that match your needs, whether you&apos;re looking for short-term stays or long-term living.
            </p>
          </div>

          {/* Card 3: Investment Opportunities */}
          <div className="bg-[#F8F5F080] rounded-[40px] px-8 py-12 flex flex-col items-center text-center gap-6 transition-transform hover:scale-[1.02]">
            <div className="w-28 h-28 bg-[#F8F5F080] rounded-full flex items-center justify-center">
              <Image src="/assists/aboutUs/sun.png" alt="Investment Opportunities" width={64} height={64} />
            </div>
            <h3 className="text-[22px] md:text-[26px] font-semibold text-[#1B2134] font-poppins">Investment Opportunities</h3>
            <p className="text-[15px] md:text-[17px] text-[#666] leading-relaxed font-poppins max-w-[450px]">
              Get access to premium real estate opportunities with strong returns in the most promising locations across Egypt.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full h-[450px] md:h-[550px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{ 
              backgroundImage: 'url("/assists/aboutUs/image.jpg")',
            }}
          ></div>
          <div className="absolute inset-0 bg-[#1B2134B2]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1000px] mx-auto px-6 text-center text-white flex flex-col items-center gap-6">
          <h2 className="text-[36px] md:text-[60px] font-bold font-poppins leading-tight">
            Begin your real estate journey with us today
          </h2>
          <p className="text-[16px] md:text-[22px] font-poppins opacity-90 max-w-[750px]">
            Discover exceptional properties and invest in a lifestyle defined by elegance and value
          </p>
          <Link 
            href="/#contact" 
            className="mt-4 bg-white text-[#1B2134] px-14 py-4 rounded-full font-bold text-[18px] hover:bg-[#F8F5F0] transition-all transform hover:scale-105"
          >
            Let&apos;s Contact
          </Link>
        </div>
      </section>
    </div>
  );
}
