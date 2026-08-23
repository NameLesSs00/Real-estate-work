import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { slugify } from '@/lib/utils';

export interface ListingCardProps {
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
  featured?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({
  id,
  title,
  price,
  beds,
  baths,
  area,
  image,
  status = 'For Sale',
  unitType,
  featured = false,
}) => {
  const { t, language } = useLanguage();
  const propertySlug = `${id}-${slugify(title)}`;

  return (
    <div className="flex flex-col bg-transparent group">
      <Link 
        href={`/${language}/properties/${propertySlug}`}
        className="relative w-full aspect-[4/5] rounded-[24px] overflow-hidden block"
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
          <div className="flex gap-2">
            {featured && (
              <span className="bg-[#1565C0]/80 backdrop-blur-sm text-white text-[12px] font-semibold px-3 py-1 rounded-full">
                {t('propertyCard.status.featured')}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <span className="bg-[#2196F3]/90 backdrop-blur-sm text-white text-[12px] font-semibold px-3 py-1 rounded-full">
              {unitType === 'Rent' ? t('propertyCard.status.rent') : t('propertyCard.status.sale')}
            </span>
            {status === 'Sold' && (
              <span className="bg-[#2196F3]/90 backdrop-blur-sm text-white text-[12px] font-semibold px-3 py-1 rounded-full">
                {t('propertyCard.status.sold')}
              </span>
            )}
          </div>
        </div>

        {/* Heart Icon */}
        <button className="absolute bottom-4 right-4 text-white hover:text-[#42A5F5] transition-colors z-10" aria-label={t('propertyCard.details.saveProperty')}>
          <Heart size={24} className="drop-shadow-md" />
        </button>
      </Link>

      <div className="pt-4 pb-2">
        <p className="text-[#2196F3] font-bold text-[16px] mb-1">{price}</p>
        <Link href={`/${language}/properties/${propertySlug}`}>
          <h3 className="text-[#0D47A1] font-bold text-[18px] mb-2 leading-tight hover:text-[#2196F3] transition-colors line-clamp-1">{title}</h3>
        </Link>
        <p className="text-[#0D47A1]/70 text-[13px] font-medium flex items-center gap-3">
          <span>{t('projectDetails.bedrooms')}: {beds}</span>
          <span>{t('projectDetails.bathrooms')}: {baths}</span>
          <span>{t('propertyCard.details.size')}: {area}</span>
        </p>
      </div>
    </div>
  );
};

export default ListingCard;
