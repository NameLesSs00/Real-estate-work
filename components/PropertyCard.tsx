'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { slugify } from '@/lib/utils';
import './PropertyCard.css';

export interface PropertyCardProps {
  id: number | string;
  title: string;
  type: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  area: string;
  image: string;
  status?: string;
  isDefaultImage?: boolean;
  unitType?: string;
  paymentPlan?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  type,
  location,
  price,
  beds,
  baths,
  area,
  image,
  status = 'For Sale',
}) => {
  const { t, language } = useLanguage();
  
  const propertySlug = `${id}-${slugify(title)}`;

  return (
    <Link 
      href={`/${language}/properties/${propertySlug}`}
      className="group block bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
    >
      {/* Image Section */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          draggable={false}
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Tags */}
        <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-sm text-brand-primary px-5 py-2 rounded-full font-poppins font-bold text-[15px] shadow-lg">
          {price}
        </div>
        <div className="absolute top-5 right-5 bg-brand-secondary text-white px-4 py-2 rounded-full font-poppins font-bold text-[12px] shadow-lg uppercase tracking-wider">
          {status === 'Sold'
            ? t('propertyCard.status.sold')
            : status === 'Primary'
                ? t('propertyCard.status.primary')
                : status === 'Resale'
                  ? t('propertyCard.status.resale')
                  : t('propertyCard.status.sale')}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 md:p-8 flex flex-col justify-between h-[220px]">
        <div>
          <h3 className="font-radley text-[24px] font-bold text-brand-primary leading-tight mb-2 line-clamp-2 group-hover:text-brand-secondary transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 text-gray-500 font-poppins text-[14px] mb-2">
            <MapPin size={16} className="text-brand-secondary shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5 mt-auto">
          <div className="flex items-center justify-between text-brand-primary font-poppins text-[14px] mb-5">
            <div className="flex items-center gap-2">
              <Image src="/assists/card/lucide_bed.png" alt={t('projectDetails.bedrooms')} width={18} height={18} className="brightness-0 opacity-60" />
              <span className="font-semibold">{beds} <span className="font-normal text-gray-400 text-[12px] uppercase">{t('projectDetails.bedrooms')}</span></span>
            </div>
            <div className="w-[1px] h-4 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <Image src="/assists/card/cil_bath.png" alt={t('projectDetails.bathrooms')} width={18} height={18} className="brightness-0 opacity-60" />
              <span className="font-semibold">{baths} <span className="font-normal text-gray-400 text-[12px] uppercase">{t('projectDetails.bathrooms')}</span></span>
            </div>
            <div className="w-[1px] h-4 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <Image src="/assists/card/fluent_slide-size-24-regular.png" alt={t('projectDetails.areaSize')} width={18} height={18} className="brightness-0 opacity-60" />
              <span className="font-semibold">{area}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">
              {type}
            </span>
            <div className="flex items-center gap-2 text-brand-secondary font-poppins font-bold text-[14px]">
              {t('propertyCard.details.viewDetails')}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
