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

      <section className="relative group select-none w-full flex flex-col gap-4">
        {/* ── Main Featured Image ── */}
        <div
          className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl md:rounded-[32px] overflow-hidden shadow-lg cursor-zoom-in group/main"
          style={{ backgroundColor: '#0A0A0B' }}
          onClick={() => setLightbox({ open: true, index: lightbox.index })}
        >
          {/* Using standard img for maximum compatibility and to ensure visibility */}
          <Image
            src={images[lightbox.index]}
            alt={projectName}
            fill
            className="object-contain transition-all duration-500"
            priority
          />
          
          {/* Image Counter Overlay */}
          <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-[13px] font-semibold border border-white/20">
            {lightbox.index + 1} / {images.length}
          </div>

          {/* Navigation Arrows — always visible on mobile, hover-visible on desktop */}
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
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center md:opacity-0 md:group-hover/main:opacity-100 transition-all hover:bg-white/40 active:scale-95"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((prev) => ({ ...prev, index: (prev.index + 1) % images.length }));
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center md:opacity-0 md:group-hover/main:opacity-100 transition-all hover:bg-white/40 active:scale-95"
              >
                <ChevronRightIcon size={20} />
              </button>
            </>
          )}
        </div>

        {/* ── Thumbnails Row — show ALL images, scrollable ── */}
        {images.length > 1 && (
          <div 
            ref={scrollRef}
            onMouseDown={onThumbMouseDown}
            onMouseLeave={onThumbMouseLeave}
            onMouseUp={onThumbMouseUp}
            onMouseMove={onThumbMouseMove}
            className={`flex gap-2 md:gap-3 overflow-x-auto py-2 w-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`} 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightbox((prev) => ({ ...prev, index: i }))}
                className={`relative flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 md:w-28 md:h-18 rounded-lg overflow-hidden transition-all duration-300 border-2 ${
                  i === lightbox.index
                    ? 'border-[#000000] ring-1 ring-[#000000]/30 shadow-md'
                    : 'border-transparent opacity-50 hover:opacity-90'
                }`}
              >
                <Image src={img} alt={`Image ${i + 1}`} fill className="object-cover" draggable={false} />
              </button>
            ))}
          </div>
        )}
      </section>

    </>
  );
}
