import React from 'react';
import PropertyFilters from './components/PropertyFilters';
import PropertyCategories from './components/PropertyCategories';
import PropertyCard from '@/components/PropertyCard';
import './properties.css';

// Reusing the same mock data for the properties grid
const units = [
  {
    title: 'Modern Sea View Apartment',
    type: 'Apartment',
    location: 'El Gouna',
    price: 'EGP 120,000',
    beds: 3,
    baths: 2,
    area: '120 m²',
    image: '/assists/exploreUnitsHome/6407c7878c682986eb17ac857954ff029fb9c3a9.png',
  },
  {
    title: 'Luxury Villa with Pool Access',
    type: 'Villa',
    location: 'Sahl Hasheesh',
    price: '$250,000',
    beds: 4,
    baths: 3,
    area: '200 m²',
    image: '/assists/exploreUnitsHome/a2b0e2fbb0526286d50d2daa20b6d2287d3fea57.png',
  },
  {
    title: 'Modern Sea View Apartment',
    type: 'Apartment',
    location: 'El Gouna',
    price: 'EGP 120,000',
    beds: 3,
    baths: 2,
    area: '120 m²',
    image: '/assists/exploreUnitsHome/6407c7878c682986eb17ac857954ff029fb9c3a9.png',
  },
  {
    title: 'Modern Sea View Apartment',
    type: 'Apartment',
    location: 'El Gouna',
    price: 'EGP 120,000',
    beds: 3,
    baths: 2,
    area: '120 m²',
    image: '/assists/exploreUnitsHome/6407c7878c682986eb17ac857954ff029fb9c3a9.png',
  },
  {
    title: 'Modern Sea View Apartment',
    type: 'Apartment',
    location: 'El Gouna',
    price: 'EGP 120,000',
    beds: 3,
    baths: 2,
    area: '120 m²',
    image: '/assists/exploreUnitsHome/6407c7878c682986eb17ac857954ff029fb9c3a9.png',
  },
  {
    title: 'Modern Sea View Apartment',
    type: 'Apartment',
    location: 'El Gouna',
    price: 'EGP 120,000',
    beds: 3,
    baths: 2,
    area: '120 m²',
    image: '/assists/exploreUnitsHome/6407c7878c682986eb17ac857954ff029fb9c3a9.png',
  },
];

export default function PropertiesPage() {
  return (
    <div className="properties-page">
      {/* Hero Section */}
      <section className="properties-hero">
        <div className="properties-container">
          <div className="properties-hero-content">
            <h1 className="properties-hero-title">Find Your Dream Property</h1>
            <p className="properties-hero-subtitle">
              Welcome to Estatein, where your dream property awaits in every corner of our beautiful world. Explore our curated selection of properties, each offering a unique story and a chance to redefine your life. With categories to suit every dreamer, your journey
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section (Overlaps the hero slightly) */}
      <div className="properties-filters-wrapper">
        <PropertyFilters />
      </div>

      {/* Categories Section */}
      <PropertyCategories />

      {/* Property Grid Section */}
      <section className="properties-grid-section">
        <div className="properties-container">
          <div className="properties-grid-header">
            <h2 className="properties-grid-title">All Properties</h2>
            <p className="properties-grid-subtitle">Showing {units.length} results</p>
          </div>
          
          <div className="properties-list-grid">
            {units.map((unit, index) => (
              <PropertyCard
                key={index}
                title={unit.title}
                type={unit.type}
                location={unit.location}
                price={unit.price}
                beds={unit.beds}
                baths={unit.baths}
                area={unit.area}
                image={unit.image}
                status="For Sale"
              />
            ))}
          </div>

          <div className="load-more-wrapper">
            <button className="load-more-button">Load More</button>
          </div>
        </div>
      </section>
    </div>
  );
}
