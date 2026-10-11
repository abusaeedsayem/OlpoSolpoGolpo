'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
/**
 * The row of six large artwork tiles under the masthead
 * (উপন্যাস · গল্প · মুক্ত গদ্য · অনুবাদ কবিতা · কবিতা · কেতাবি কথা)
 * with arrow-controlled horizontal scrolling.
 */
export function CategoryTileStrip({ tiles }) {
    const trackRef = useRef(null);
    if (tiles.length === 0)
        return null;
    const scroll = (dir) => {
        const el = trackRef.current;
        if (!el)
            return;
        el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 720), behavior: 'smooth' });
    };
    return (_jsx("section", { className: "relative bg-white py-8 sm:py-10", "aria-label": "\u09AC\u09BF\u09AD\u09BE\u0997\u09B8\u09AE\u09C2\u09B9", children: _jsxs("div", { className: "relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("button", { type: "button", onClick: () => scroll(-1), "aria-label": "\u0986\u0997\u09C7\u09B0 \u09AC\u09BF\u09AD\u09BE\u0997", className: "hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md items-center justify-center text-ink hover:text-crimson transition-colors", children: "\u2039" }), _jsx("div", { ref: trackRef, className: "flex gap-4 sm:gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-1", children: tiles.map((tile, i) => (_jsxs(Link, { href: `/?category=${tile.slug}`, className: "category-tile w-[190px] sm:w-[215px]", children: [tile.imageUrl && (_jsx(Image, { src: tile.imageUrl, alt: tile.nameBn, fill: true, sizes: "215px", className: "object-cover", preload: i === 0 })), _jsx("span", { children: tile.nameBn })] }, tile.slug))) }), _jsx("button", { type: "button", onClick: () => scroll(1), "aria-label": "\u09AA\u09B0\u09C7\u09B0 \u09AC\u09BF\u09AD\u09BE\u0997", className: "hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md items-center justify-center text-ink hover:text-crimson transition-colors", children: "\u203A" })] }) }));
}
