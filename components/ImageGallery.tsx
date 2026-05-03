'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';

interface LightboxProps {
  images: string[];
  startIndex: number;
  onClose: () => void;
}

function Lightbox({ images, startIndex, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(startIndex);

  const prev = () => setCurrent((i) => (i - 1 + images.length) % images.length);
  const next = () => setCurrent((i) => (i + 1) % images.length);

  // keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-5 right-5 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all"
        onClick={onClose}
      >
        <X size={24} />
      </button>

      {/* Image */}
      <div
        className="relative w-[90vw] max-w-[1100px] h-[70vh] rounded-[16px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[current]}
          alt={`Image ${current + 1}`}
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/25 rounded-full p-3 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Next */}
      {images.length > 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/25 rounded-full p-3 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
        >
          <ChevronRightIcon size={28} />
        </button>
      )}

      {/* Counter */}
      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/60 text-[14px]">
        {current + 1} / {images.length}
      </p>

      {/* Thumbnails row */}
      {images.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-4 pb-2 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setCurrent(i);
              }}
              className={`relative w-12 h-8 rounded overflow-hidden flex-shrink-0 border-2 transition-all ${
                i === current ? 'border-white' : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface ImageGalleryProps {
  images: string[];
  projectName?: string;
}

export default function ImageGallery({ images, projectName = 'Project Image' }: ImageGalleryProps) {
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({
    open: false,
    index: 0,
  });

  // ── Thumbnail Drag Scroll Logic ──
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onThumbMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const onThumbMouseLeave = () => {
    setIsDragging(false);
  };

  const onThumbMouseUp = () => {
    setIsDragging(false);
  };

  const onThumbMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2; // Scroll speed multiplier
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <>
      {lightbox.open && (
        <Lightbox
          images={images}
          startIndex={lightbox.index}
          onClose={() => setLightbox({ open: false, index: 0 })}
        />
      )}

      <div className="relative group select-none flex flex-col w-full">
        {/* Main Image Container */}
        <div
          className="relative w-full aspect-[16/10] rounded-[24px] overflow-hidden shadow-lg cursor-zoom-in"
          onClick={() => setLightbox({ open: true, index: lightbox.index })}
        >
          <Image
            src={images[lightbox.index]}
            alt={projectName}
            fill
            className="object-cover pointer-events-none"
            priority
            draggable={false}
          />

          {/* Navigation Arrows (Desktop) */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((prev) => ({
                    ...prev,
                    index: (prev.index - 1 + images.length) % images.length,
                  }));
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40 pointer-events-auto"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((prev) => ({ ...prev, index: (prev.index + 1) % images.length }));
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40 pointer-events-auto"
              >
                <ChevronRightIcon size={20} />
              </button>
            </>
          )}

          {/* Zoom Hint (Static UI overlay) */}
          <div
            className="absolute top-6 left-6 bg-black/40 backdrop-blur-sm text-white p-2 rounded-full cursor-pointer hover:bg-black/60 transition-all pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox({ open: true, index: lightbox.index });
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </div>

          {/* Image Counter Badge */}
          <div className="absolute bottom-6 right-6 bg-[#1B2134]/60 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-[13px] font-medium border border-white/10">
            {lightbox.index + 1} / {images.length}
          </div>
        </div>

        {images.length > 1 && (
          <div 
            ref={scrollRef}
            onMouseDown={onThumbMouseDown}
            onMouseLeave={onThumbMouseLeave}
            onMouseUp={onThumbMouseUp}
            onMouseMove={onThumbMouseMove}
            className={`flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide w-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`} 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightbox((prev) => ({ ...prev, index: i }))}
                className={`relative w-24 h-16 rounded-[12px] overflow-hidden flex-shrink-0 transition-all duration-300 border-2 ${
                  i === lightbox.index
                    ? 'border-[#1B2134] scale-105 shadow-md'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <Image src={img} alt={`Thumb ${i}`} fill className="object-cover" draggable={false} />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
