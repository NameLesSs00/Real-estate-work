'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

const BASE = "/assists/contactUs";
const STARS_BASE = "/assists/Properties";

const infoCards = [
  {
    icon: `${BASE}/message.png`,
    title: "Email",
    content: "info@thegateestates.com",
    href: "mailto:info@thegateestates.com",
  },
  {
    icon: `${BASE}/phone.png`,
    title: "Phone",
    content: "+20 102 111 1666",
    href: "tel:+201021111666",
  },
  {
    icon: `${BASE}/locatoin.png`,
    title: "Main Headquarters",
    content: "Al-Kawsar, Hurghada — above El Khedawy Restaurant",
    href: "https://maps.google.com",
  },
  {
    icon: `${BASE}/fire.png`,
    title: "Follow Us",
    socials: [
      { label: "Instagram", href: "https://www.instagram.com/p/DXu6hy4l3E1/?igsh=eHVwa3A4YmlyM2sw" },
      { label: "Facebook", href: "https://www.facebook.com/share/1Cjkb7qK75/?mibextid=wwXIfr" },
      { label: "WhatsApp", href: "https://wa.me/message/2CFJ7MIUOG3AM1" },
    ],
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen font-poppins overflow-hidden">

      {/* ── Section 1: Hero + Info Cards ── */}
      <section className="bg-white pt-36 pb-20 px-6">
        <div className="max-w-[1200px] mx-auto">

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-[36px] md:text-[48px] font-bold text-[#1B2134] mb-4 leading-tight"
          >
            Get in Touch with The Gate Estates
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-[16px] text-gray-500 max-w-2xl leading-relaxed mb-14"
          >
            Welcome to The Gate Estates&apos; Contact page. We&apos;re here to assist you with any inquiries,
            requests, or feedback you may have. Whether you&apos;re looking to buy or sell a property,
            explore investment opportunities, or simply want to connect — we&apos;re just a message away.
          </motion.p>

          {/* Info Cards */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 }
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {infoCards.map((card) => (
              <motion.div
                key={card.title}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="relative bg-[#F8F5F0] border border-[#ECECEC] rounded-[14px] p-10 flex flex-col items-center justify-center gap-6 shadow-sm hover:shadow-xl transition-all duration-300 group min-h-[220px]"
              >
                {/* Arrow icon - Top Right */}
                <div className="absolute top-6 right-6 opacity-60 group-hover:opacity-100 transition-opacity">
                  <Image src={`${BASE}/link.png`} alt="link" width={22} height={22} />
                </div>

                {/* Icon Area */}
                <div className="flex items-center justify-center">
                  <Image src={card.icon} alt={card.title} width={80} height={80} className="object-contain" />
                </div>

                {/* Content - Centered */}
                <div className="text-center">
                  {card.socials ? (
                    <div className="flex flex-wrap justify-center gap-3">
                      {card.socials.map((s) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[15px] font-semibold text-[#1B2134] underline hover:text-[#D59E52] transition-colors"
                        >
                          {s.label}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <a
                      href={card.href}
                      target={card.href?.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="text-[16px] font-bold text-[#1B2134] hover:text-[#D59E52] transition-colors leading-snug"
                    >
                      {card.content}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Section 2: Let's Connect Form ── */}
      <section className="bg-[#ffffff] py-20 px-6">
        <div className="max-w-[1200px] mx-auto">

          {/* Heading with Stars */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end gap-2 mb-3"
          >
            <Image src={`${STARS_BASE}/star1.png`} alt="star" width={24} height={24} />
            <Image src={`${STARS_BASE}/star2.png`} alt="star" width={18} height={18} className="mb-0.5" />
            <Image src={`${STARS_BASE}/star3.png`} alt="star" width={12} height={12} className="mb-1" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-[36px] md:text-[44px] font-bold text-[#1B2134] mb-4"
          >
            Let&apos;s Connect
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[15px] text-gray-500 max-w-2xl leading-relaxed mb-10"
          >
            We&apos;re excited to connect with you and learn more about your real estate goals. Use the
            form below to get in touch with The Gate Estates. Whether you&apos;re a prospective client,
            partner, or simply curious about our services, we&apos;re here to answer your questions.
          </motion.p>

          {/* Form Card */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-[#F0EBE3] rounded-[20px] p-8 md:p-12 shadow-sm"
          >
            <form className="flex flex-col gap-6">

              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#1B2134]">First Name</label>
                  <input
                    type="text"
                    placeholder="Enter First Name"
                    className="bg-white border border-[#E0E0E0] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:border-[#1B2134] transition-colors placeholder:text-gray-300"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#1B2134]">Last Name</label>
                  <input
                    type="text"
                    placeholder="Enter Last Name"
                    className="bg-white border border-[#E0E0E0] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:border-[#1B2134] transition-colors placeholder:text-gray-300"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#1B2134]">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your Email"
                    className="bg-white border border-[#E0E0E0] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:border-[#1B2134] transition-colors placeholder:text-gray-300"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#1B2134]">Phone</label>
                  <input
                    type="tel"
                    placeholder="Enter Phone Number"
                    className="bg-white border border-[#E0E0E0] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:border-[#1B2134] transition-colors placeholder:text-gray-300"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#1B2134]">Inquiry Type</label>
                  <select defaultValue="" className="bg-white border border-[#E0E0E0] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:border-[#1B2134] transition-colors text-gray-400 appearance-none cursor-pointer">
                    <option value="" disabled>Select Inquiry Type</option>
                    <option value="buy">Buy a Property</option>
                    <option value="sell">Sell a Property</option>
                    <option value="invest">Investment Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#1B2134]">How Did You Hear About Us?</label>
                  <select defaultValue="" className="bg-white border border-[#E0E0E0] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:border-[#1B2134] transition-colors text-gray-400 appearance-none cursor-pointer">
                    <option value="" disabled>Select</option>
                    <option value="social">Social Media</option>
                    <option value="friend">Friend / Referral</option>
                    <option value="search">Search Engine</option>
                    <option value="ad">Advertisement</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#1B2134]">Message</label>
                <textarea
                  placeholder="Enter your Message here.."
                  rows={6}
                  className="bg-white border border-[#E0E0E0] rounded-[10px] px-4 py-3 text-[14px] outline-none focus:border-[#1B2134] transition-colors resize-none placeholder:text-gray-300"
                />
              </div>

              {/* Footer Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 accent-[#1B2134] cursor-pointer"
                  />
                  <span className="text-[13px] text-gray-500">
                    I agree with{" "}
                    <a href="#" className="text-[#1B2134] underline hover:text-[#D59E52] transition-colors">Terms of Use</a>
                    {" "}and{" "}
                    <a href="#" className="text-[#1B2134] underline hover:text-[#D59E52] transition-colors">Privacy Policy</a>
                  </span>
                </label>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="flex items-center gap-3 bg-[#1B2134] text-white px-8 py-3.5 rounded-full font-semibold text-[15px] hover:bg-[#2d3555] shadow-lg transition-all duration-300 whitespace-nowrap"
                >
                  Send Inquiry
                  <Image src={`${BASE}/send.png`} alt="Send" width={16} height={16} className="brightness-0 invert" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ── Section 3: CTA Banner ── */}
      <section className="relative bg-white py-24 px-6 overflow-hidden text-center">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 pointer-events-none"
        >
          <Image
            src={`${BASE}/bgImage.png`}
            alt="background pattern"
            fill
            className="object-cover"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 max-w-[1200px] mx-auto pt-16 px-4"
        >
          <h2 className="text-[36px] md:text-[52px] font-bold text-[#1B2134] leading-tight mb-6">
            Start Your Real Estate Journey Today
          </h2>
          <p className="text-[16px] text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Your dream property is just a click away. Whether you&apos;re looking for a new home, a
            strategic investment, or expert real estate advice, The Gate Estates is here to assist
            you every step of the way.
          </p>
          <Link
            href="/properties"
            className="inline-block bg-[#1B2134] text-white font-bold px-10 py-4 rounded-full text-[16px] hover:bg-[#D59E52] transition-all duration-300 shadow-xl hover:scale-110 active:scale-95"
          >
            Explore Properties
          </Link>
        </motion.div>
      </section>

    </main>
  );
}
