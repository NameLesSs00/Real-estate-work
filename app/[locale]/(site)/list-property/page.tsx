'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function ListPropertyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white font-inter pt-32 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <h1 className="text-[28px] sm:text-[40px] font-bold text-[#000000] mb-8 sm:mb-12">{t('listPropertyPage.title')}</h1>

        <form className="space-y-12">
          
          {/* Basic Information Section */}
          <div className="bg-[#E3F2FD80] rounded-[24px] p-6 sm:p-8 md:p-12 shadow-sm space-y-8">
            <h2 className="text-[24px] font-bold text-[#000000]">{t('listPropertyPage.basicInfo')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[#000000] font-semibold text-[15px]">{t('listPropertyPage.propertyTitle')}</label>
                <input 
                  type="text" 
                  placeholder={t('listPropertyPage.propertyTitle')} 
                  required
                  className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#000000]/5 placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[#000000] font-semibold text-[15px]">{t('listPropertyPage.price')}</label>
                <input 
                  type="text" 
                  placeholder={t('listPropertyPage.price')} 
                  required
                  className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#000000]/5 placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[#000000] font-semibold text-[15px]">{t('listPropertyPage.unitSize')}</label>
                <input 
                  type="text" 
                  placeholder={t('listPropertyPage.unitSize')} 
                  required
                  className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#000000]/5 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[#000000] font-semibold text-[15px]">{t('listPropertyPage.saleOrRent')}</label>
                <div className="relative">
                  <select required className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#000000]/5 appearance-none text-[#000000]">
                    <option value="">{t('listPropertyPage.saleOrRent')}</option>
                    <option value="sale">{t('propertyCard.status.sale')}</option>
                    <option value="rent">{t('propertyCard.status.rent')}</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L6 6L11 1" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[#000000] font-semibold text-[15px]">{t('propertiesPage.sidebar.propertyType')}</label>
                <div className="relative">
                  <select required className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#000000]/5 appearance-none text-[#000000]">
                    <option value="">{t('propertiesPage.sidebar.propertyType')}</option>
                    <option value="apartment">{t('propertiesPage.sidebar.apartment')}</option>
                    <option value="villa">{t('propertiesPage.sidebar.villa')}</option>
                    <option value="penthouse">{t('propertiesPage.sidebar.penthouse')}</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L6 6L11 1" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[#000000] font-semibold text-[15px]">{t('listPropertyPage.rooms')}</label>
                <div className="relative">
                  <select required className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#000000]/5 appearance-none text-[#000000]">
                    <option value="">{t('projectDetails.bedrooms')}</option>
                    <option value="1">1 {t('propertyCard.details.bedroom')}</option>
                    <option value="2">2 {t('projectDetails.bedrooms')}</option>
                    <option value="3">3 {t('projectDetails.bedrooms')}</option>
                    <option value="4+">4+ {t('projectDetails.bedrooms')}</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L6 6L11 1" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[#000000] font-semibold text-[15px]">{t('projectDetails.description')}</label>
              <textarea 
                placeholder={t('listPropertyPage.propertyDescription')} 
                rows={6}
                required
                className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#000000]/5 placeholder:text-gray-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[#000000] font-semibold text-[15px]">{t('listPropertyPage.address')}</label>
                <input 
                  type="text" 
                  placeholder={t('listPropertyPage.address')} 
                  required
                  className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#000000]/5 placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[#000000] font-semibold text-[15px]">{t('listPropertyPage.city')}</label>
                <input 
                  type="text" 
                  placeholder={t('listPropertyPage.city')} 
                  required
                  className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#000000]/5 placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[#000000] font-semibold text-[15px]">{t('projectDetails.areaSize')}</label>
                <input 
                  type="text" 
                  placeholder={t('projectDetails.areaSize')} 
                  required
                  className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#000000]/5 placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Property Media Section */}
          <div className="bg-[#E3F2FD80] rounded-[24px] p-6 sm:p-8 md:p-12 shadow-sm space-y-8">
            <h2 className="text-[24px] font-bold text-[#000000]">{t('listPropertyPage.propertyMedia')}</h2>
            <div className="space-y-4">
              <p className="text-[#000000] font-semibold text-[15px]">{t('listPropertyPage.propertyImages')}</p>
              <div className="bg-white border-2 border-dashed border-[#AAAAAA] rounded-2xl p-16 flex flex-col items-center justify-center space-y-4 hover:bg-gray-50/50 transition-colors cursor-pointer group">
                <div className="bg-[#F8F9FA] w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Image src="/assists/Propertylist/document-upload.png" alt={t('listPropertyPage.uploadImages')} width={32} height={32} />
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-[#64748B] font-medium text-[16px]">{t('listPropertyPage.uploadImages')}</span>
                  <input type="file" className="hidden" multiple id="property-images" />
                  <label htmlFor="property-images" className="bg-[#000000] text-white px-8 py-2.5 rounded-xl font-bold cursor-pointer hover:bg-[#1a304a] transition-all mt-4">
                    {t('listPropertyPage.browseFiles')}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Client Details Section */}
          <div className="bg-[#E3F2FD80] rounded-[24px] p-6 sm:p-8 md:p-12 shadow-sm space-y-10">
            <h2 className="text-[24px] font-bold text-[#000000]">{t('listPropertyPage.clientDetails')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="text-[#000000] font-semibold text-[15px]">{t('projectDetails.fullName')}</label>
                <input 
                  type="text" 
                  placeholder={t('projectDetails.fullName')} 
                  required
                  className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#000000]/5 placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[#000000] font-semibold text-[15px]">{t('projectDetails.email')}</label>
                <input 
                  type="email" 
                  placeholder={t('projectDetails.email')} 
                  required
                  className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#000000]/5 placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[#000000] font-semibold text-[15px]">{t('projectDetails.phoneNumber')}</label>
                <input 
                  type="text" 
                  placeholder={t('projectDetails.phoneNumber')} 
                  required
                  className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#000000]/5 placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[#000000] font-semibold text-[15px]">{t('listPropertyPage.address')}</label>
                <input 
                  type="text" 
                  placeholder={t('listPropertyPage.address')} 
                  required
                  className="w-full bg-white border border-[#AAAAAA] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#000000]/5 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button className="w-full sm:w-auto bg-[#000000] text-white px-12 sm:px-20 py-4 rounded-xl text-[16px] sm:text-[18px] font-bold hover:bg-[#1a304a] transition-all shadow-lg hover:shadow-xl active:scale-95 cursor-pointer">
                {t('contactPage.form.submit')}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
