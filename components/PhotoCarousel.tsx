"use client";

import Image from "next/image";
import { useState } from "react";

interface PhotoCarouselProps {
  photos: string[];
  barnName: string;
}

export default function PhotoCarousel({ photos, barnName }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultiple = photos.length > 1;

  const prev = () => setCurrentIndex((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setCurrentIndex((i) => (i + 1) % photos.length);

  if (photos.length === 0) {
    return (
      <div className="h-64 md:h-96 bg-gradient-to-br from-green-100 to-green-200 rounded-xl mb-8 flex items-center justify-center">
        <svg className="w-20 h-20 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="h-64 md:h-96 bg-gradient-to-br from-green-100 to-green-200 rounded-xl mb-8 relative overflow-hidden group">
      <Image
        src={`/images/barns/${photos[currentIndex]}`}
        alt={`${barnName} photo ${currentIndex + 1}`}
        fill
        className="object-cover rounded-xl"
        sizes="(max-width: 1280px) 100vw, 1280px"
        priority={currentIndex === 0}
      />

      {hasMultiple && (
        <>
          {/* Left arrow */}
          <button
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right arrow */}
          <button
            onClick={next}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to photo ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentIndex ? "bg-white" : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
