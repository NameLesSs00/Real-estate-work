import React from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import './PropertyCard.css';

export interface PropertyCardProps {
  title: string;
  type: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  area: string;
  image: string;
  status?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  title,
  type,
  location,
  price,
  beds,
  baths,
  area,
  image,
  status = 'For Sale'
}) => {
  return (
    <div className="unit-card">
      <div className="unit-image-wrapper">
        <Image
          src={image}
          alt={title}
          fill
          className="unit-image"
        />
        <div className="unit-price-tag">{price}</div>
        <div className="unit-status-tag">{status}</div>
      </div>
      <div className="unit-content">
        <h3 className="unit-title">{title}</h3>
        <div className="unit-details-grid">
          <div className="unit-detail">
            <Image src="/assists/card/buildings-2.png" alt="Type" width={24} height={24} className="unit-detail-icon" />
            <span>{type}</span>
          </div>
          <div className="unit-detail">
            <MapPin size={24} className="unit-detail-icon" />
            <span>{location}</span>
          </div>
          <div className="unit-detail">
            <Image src="/assists/card/lucide_bed.png" alt="Beds" width={24} height={24} className="unit-detail-icon" />
            <span>{beds} Bedroom</span>
          </div>
          <div className="unit-detail">
            <Image src="/assists/card/cil_bath.png" alt="Baths" width={24} height={24} className="unit-detail-icon" />
            <span>{baths} Bathroom</span>
          </div>
          <div className="unit-detail">
            <Image src="/assists/card/fluent_slide-size-24-regular.png" alt="Area" width={24} height={24} className="unit-detail-icon" />
            <span>{area}</span>
          </div>
        </div>
        <button className="unit-button">View Details</button>
      </div>
    </div>
  );
};

export default PropertyCard;
