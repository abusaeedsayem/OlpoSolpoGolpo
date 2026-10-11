'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { TileCategory } from '@/lib/content';

interface CategoryTileStripProps {
  tiles: TileCategory[];
}

/**
 * The row of six large artwork tiles under the masthead
 * (উপন্যাস · গল্প · মুক্ত গদ্য · অনুবাদ কবিতা · কবিতা · কেতাবি কথা)
 * with arrow-controlled horizontal scrolling.
 */
export function CategoryTileStrip({ tiles }: CategoryTileStripProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (tiles.length === 0) return null;

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 720), behavior: 'smooth' });
  };

  return (
    <section className="relative bg-white py-8 sm:py-10" aria-label="বিভাগসমূহ">
      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="আগের বিভাগ"
          className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md items-center justify-center text-ink hover:text-crimson transition-colors"
        >
          ‹
        </button>

        <div
          ref={trackRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-1"
        >
          {tiles.map((tile, i) => (
            <Link
              key={tile.slug}
              href={`/?category=${tile.slug}`}
              className="category-tile w-[190px] sm:w-[215px]"
            >
              {tile.imageUrl && (
                <Image
                  src={tile.imageUrl}
                  alt={tile.nameBn}
                  fill
                  sizes="215px"
                  className="object-cover"
                  preload={i === 0}
                />
              )}
              <span>{tile.nameBn}</span>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="পরের বিভাগ"
          className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md items-center justify-center text-ink hover:text-crimson transition-colors"
        >
          ›
        </button>
      </div>
    </section>
  );
}
