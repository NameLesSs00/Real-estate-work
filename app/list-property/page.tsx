'use client';

import React from 'react';
import Image from 'next/image';

export default function ListPropertyPage() {
  return (
    <div className="min-h-screen bg-white font-inter pt-32 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <h1 className="text-[40px] font-bold text-[#16273B] mb-12">Add Property</h1>

        <form className="space-y-12">
          
          {/* Basic Information Section */}
          <div className="bg-[#F8F5F080] rounded-[24px] p-8 md:p-12 shadow-sm space-y-8">
            <h2 className="text-[24px] font-bold text-[#16273B]">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[#16273B] font-semibold text-[15px]">Property Title</label>
                <input 
                  type="text" 
                  placeholder="Property Title" 
                  required
                  className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#16273B]/5 placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[#16273B] font-semibold text-[15px]">Price</label>
                <input 
                  type="text" 
                  placeholder="Price" 
                  required
                  className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#16273B]/5 placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[#16273B] font-semibold text-[15px]">Unit Size</label>
                <input 
                  type="text" 
                  placeholder="Unit Size" 
                  required
                  className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#16273B]/5 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[#16273B] font-semibold text-[15px]">Sale Or Rent</label>
                <div className="relative">
                  <select required className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#16273B]/5 appearance-none text-[#16273B]">
                    <option value="">Sale Or Rent</option>
                    <option value="sale">Sale</option>
                    <option value="rent">Rent</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L6 6L11 1" stroke="#16273B" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[#16273B] font-semibold text-[15px]">Property Type</label>
                <div className="relative">
                  <select required className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#16273B]/5 appearance-none text-[#16273B]">
                    <option value="">Property type</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="penthouse">Penthouse</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L6 6L11 1" stroke="#16273B" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[#16273B] font-semibold text-[15px]">Rooms</label>
                <div className="relative">
                  <select required className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#16273B]/5 appearance-none text-[#16273B]">
                    <option value="">bedrooms</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4+">4+ Bedrooms</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L6 6L11 1" stroke="#16273B" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[#16273B] font-semibold text-[15px]">Description</label>
              <textarea 
                placeholder="Property Description" 
                rows={6}
                required
                className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#16273B]/5 placeholder:text-gray-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[#16273B] font-semibold text-[15px]">Address</label>
                <input 
                  type="text" 
                  placeholder="Address" 
                  required
                  className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#16273B]/5 placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[#16273B] font-semibold text-[15px]">City</label>
                <input 
                  type="text" 
                  placeholder="City" 
                  required
                  className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#16273B]/5 placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[#16273B] font-semibold text-[15px]">Area</label>
                <input 
                  type="text" 
                  placeholder="Area" 
                  required
                  className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#16273B]/5 placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Property Media Section */}
          <div className="bg-[#F8F5F080] rounded-[24px] p-8 md:p-12 shadow-sm space-y-8">
            <h2 className="text-[24px] font-bold text-[#16273B]">Property media</h2>
            <div className="space-y-4">
              <p className="text-[#16273B] font-semibold text-[15px]">Property images</p>
              <div className="bg-white border-2 border-dashed border-[#AAAAAA] rounded-2xl p-16 flex flex-col items-center justify-center space-y-4 hover:bg-gray-50/50 transition-colors cursor-pointer group">
                <div className="bg-[#F8F9FA] w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Image src="/assists/Propertylist/document-upload.png" alt="Upload" width={32} height={32} />
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-[#64748B] font-medium text-[16px]">Upload images</span>
                  <input type="file" className="hidden" multiple id="property-images" />
                  <label htmlFor="property-images" className="bg-[#16273B] text-white px-8 py-2.5 rounded-xl font-bold cursor-pointer hover:bg-[#1a304a] transition-all mt-4">
                    Browse Files
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Client Details Section */}
          <div className="bg-[#F8F5F080] rounded-[24px] p-8 md:p-12 shadow-sm space-y-10">
            <h2 className="text-[24px] font-bold text-[#16273B]">Client Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="text-[#16273B] font-semibold text-[15px]">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required
                  className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#16273B]/5 placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[#16273B] font-semibold text-[15px]">Email</label>
                <input 
                  type="email" 
                  placeholder="Email" 
                  required
                  className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#16273B]/5 placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[#16273B] font-semibold text-[15px]">Phone Number</label>
                <input 
                  type="text" 
                  placeholder="Phone Number" 
                  required
                  className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#16273B]/5 placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[#16273B] font-semibold text-[15px]">Address</label>
                <input 
                  type="text" 
                  placeholder="Address" 
                  required
                  className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#16273B]/5 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button className="bg-[#16273B] text-white px-20 py-4 rounded-xl text-[18px] font-bold hover:bg-[#1a304a] transition-all shadow-lg hover:shadow-xl active:scale-95 cursor-pointer">
                Submit
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
