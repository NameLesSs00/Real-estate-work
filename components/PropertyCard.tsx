import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Banknote } from 'lucide-react';
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
  isDefaultImage = false,
  unitType,
  paymentPlan
}) => {
  const { t, language } = useLanguage();
  
  const propertySlug = `${id}-${slugify(title)}`;

  return (
    <div className="unit-card">
      <Link 
        href={`/${language}/properties/${propertySlug}`}
        className="unit-image-wrapper block"
        title={isDefaultImage ? "Default Image" : undefined}
      >
        <Image
          src={image}
          alt={title}
          fill
          draggable={false}
          className="unit-image"
        />
        <div className="unit-price-tag">{price}</div>
        <div className="unit-status-tag">
          {status === 'Sold' 
            ? t('propertyCard.status.sold') 
            : unitType === 'Rent' 
              ? t('propertyCard.status.rent') 
              : status === 'Primary' 
                ? t('propertyCard.status.primary') 
                : status === 'Resale' 
                  ? t('propertyCard.status.resale') 
                  : t('propertyCard.status.sale')}
        </div>
      </Link>
      <div className="unit-content">
        <h3 className="unit-title">{title}</h3>
        <div className="unit-details-grid">
          <div className="unit-detail">
            <Image src="/assists/card/buildings-2.png" alt="Type" width={24} height={24} draggable={false} className="unit-detail-icon" />
            <span>{type}</span>
          </div>
          <div className="unit-detail">
            <MapPin size={24} className="unit-detail-icon" />
            <span>{location}</span>
          </div>
          <div className="unit-detail">
            <Image src="/assists/card/lucide_bed.png" alt="Beds" width={24} height={24} draggable={false} className="unit-detail-icon" />
            <span>{beds} {t('propertyCard.details.bedroom')}</span>
          </div>
          <div className="unit-detail">
            <Image src="/assists/card/cil_bath.png" alt="Baths" width={24} height={24} draggable={false} className="unit-detail-icon" />
            <span>{baths} {t('propertyCard.details.bathroom')}</span>
          </div>
          <div className="unit-detail">
            <Image src="/assists/card/fluent_slide-size-24-regular.png" alt="Area" width={24} height={24} draggable={false} className="unit-detail-icon" />
            <span>{t('propertyCard.details.area')}: {area}</span>
          </div>
          {paymentPlan && (
            <div className="unit-detail">
              <Banknote size={24} className="unit-detail-icon" />
              <span>{paymentPlan === 'Installment' ? t('propertyCard.details.instalment') : t('propertyCard.details.cash')}</span>
            </div>
          )}
        </div>
        <Link 
          href={`/${language}/properties/${propertySlug}`}
          className="unit-button text-center inline-block"
        >
          {t('propertyCard.details.viewDetails')}
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
