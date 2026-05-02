'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

const PROJECTS = [
  {
    id: 1,
    title: 'Makadi Heights Residences',
    developer: 'Castello',
    developerLogo: '/assists/project/castello.png',
    location: 'Red Sea Living, Hurghada',
    priceStart: '10,000,00',
    currency: 'EGP',
    description:
      'A Thoughtfully Designed Coastal Community Blending Modern Architecture With Resort-Style Living In One Of The Most Desirable Destinations On The Red Sea.',
    image: '/assists/project/image.png',
    slug: 'makadi-heights-residences-1',
  },
  {
    id: 2,
    title: 'Makadi Heights Residences',
    developer: 'Castello',
    developerLogo: '/assists/project/castello.png',
    location: 'Red Sea Living, Hurghada',
    priceStart: '10,000,00',
    currency: 'EGP',
    description:
      'A Thoughtfully Designed Coastal Community Blending Modern Architecture With Resort-Style Living In One Of The Most Desirable Destinations On The Red Sea.',
    image: '/assists/project/image.png',
    slug: 'makadi-heights-residences-2',
  },
  {
    id: 3,
    title: 'Makadi Heights Residences',
    developer: 'Castello',
    developerLogo: '/assists/project/castello.png',
    location: 'Red Sea Living, Hurghada',
    priceStart: '10,000,00',
    currency: 'EGP',
    description:
      'A Thoughtfully Designed Coastal Community Blending Modern Architecture With Resort-Style Living In One Of The Most Desirable Destinations On The Red Sea.',
    image: '/assists/project/image.png',
    slug: 'makadi-heights-residences-3',
  },
  {
    id: 4,
    title: 'Makadi Heights Residences',
    developer: 'Castello',
    developerLogo: '/assists/project/castello.png',
    location: 'Red Sea Living, Hurghada',
    priceStart: '10,000,00',
    currency: 'EGP',
    description:
      'A Thoughtfully Designed Coastal Community Blending Modern Architecture With Resort-Style Living In One Of The Most Desirable Destinations On The Red Sea.',
    image: '/assists/project/image.png',
    slug: 'makadi-heights-residences-4',
  },
  {
    id: 5,
    title: 'Makadi Heights Residences',
    developer: 'Castello',
    developerLogo: '/assists/project/castello.png',
    location: 'Red Sea Living, Hurghada',
    priceStart: '10,000,00',
    currency: 'EGP',
    description:
      'A Thoughtfully Designed Coastal Community Blending Modern Architecture With Resort-Style Living In One Of The Most Desirable Destinations On The Red Sea.',
    image: '/assists/project/image.png',
    slug: 'makadi-heights-residences-5',
  },
  {
    id: 6,
    title: 'Makadi Heights Residences',
    developer: 'Castello',
    developerLogo: '/assists/project/castello.png',
    location: 'Red Sea Living, Hurghada',
    priceStart: '10,000,00',
    currency: 'EGP',
    description:
      'A Thoughtfully Designed Coastal Community Blending Modern Architecture With Resort-Style Living In One Of The Most Desirable Destinations On The Red Sea.',
    image: '/assists/project/image.png',
    slug: 'makadi-heights-residences-6',
  },
];

const INITIAL_COUNT = 3;
const LOAD_MORE_COUNT = 3;

export default function ProjectsPage() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const visibleProjects = PROJECTS.slice(0, visibleCount);
  const hasMore = visibleCount < PROJECTS.length;

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-40 pb-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col gap-8">

        {/* Project Cards */}
        {visibleProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col md:flex-row border border-[#F0EDE8] transition-all hover:shadow-[0_15px_50px_rgba(0,0,0,0.06)]"
          >
            {/* Left: Image */}
            <div className="relative w-full md:w-[450px] min-h-[320px] md:min-h-full flex-shrink-0">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Right: Content */}
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-between relative">
              {/* Developer Logo - top right */}
              <div className="absolute top-8 right-8">
                <div className="relative w-[120px] h-[60px]">
                  <Image
                    src={project.developerLogo}
                    alt={project.developer}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Top Content */}
              <div className="flex flex-col gap-4 pr-32">
                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-[18px] md:text-[22px] font-poppins text-[#C7B7A1]">Price Start From</span>
                  <span className="text-[24px] md:text-[32px] font-bold text-[#1B2134] font-poppins">
                    {project.priceStart} {project.currency}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-[24px] md:text-[32px] font-bold text-[#1B2134] font-radley mt-2">
                  {project.title}
                </h2>

                {/* Location */}
                <div className="flex items-center gap-2 text-[15px] md:text-[16px] text-[#888] font-poppins">
                  <MapPin size={18} className="text-[#C7B7A1] flex-shrink-0" />
                  <span>{project.location}</span>
                </div>

                {/* Description */}
                <p className="text-[15px] md:text-[17px] text-[#666] leading-relaxed font-poppins mt-4 max-w-[600px]">
                  {project.description}
                </p>
              </div>

              {/* Bottom: View Details Button */}
              <div className="flex justify-end mt-10">
                <Link
                  href={`/projects/${project.slug}`}
                  className="bg-[#1B2134] text-white px-12 py-4 rounded-full text-[16px] font-semibold font-poppins hover:bg-[#252d46] transition-all hover:translate-y-[-2px]"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Load More */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_COUNT)}
              className="w-full border border-[#1B2134] text-[#1B2134] rounded-full py-5 text-[18px] font-semibold font-poppins hover:bg-[#1B2134] hover:text-white transition-all shadow-sm"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
