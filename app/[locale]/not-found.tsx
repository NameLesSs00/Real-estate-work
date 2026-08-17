import Link from 'next/link';
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 font-inter">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          {/* 404 Header */}
          <h1 className="text-9xl font-bold text-[#000000]">
            4<span className="text-[#C7B7A1]">0</span>4
          </h1>
          
          {/* Message */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900 font-poppins">
              Page Not Found
            </h2>
            <p className="text-gray-600 text-lg">
              Oops! The page you are looking for doesn&apos;t exist, has been moved, or you might not have the correct permissions to view it.
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-8">
            <Link 
              href="/"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-[#000000] rounded-full hover:bg-[#000000] transition-colors duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
