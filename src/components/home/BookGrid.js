import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Image from 'next/image';
import Link from 'next/link';
/**
 * নতুন বই — 2-up book cover grid with prices and the red
 * "আমাদের সমস্ত বই" call to action.
 */
export function BookGrid({ books }) {
    return (_jsxs("div", { children: [_jsx("div", { className: "grid grid-cols-2 gap-x-3 gap-y-5", children: books.map((book) => (_jsxs(Link, { href: "/?category=ketabi-kotha", className: "group", children: [_jsx("div", { className: "relative aspect-[3/4] overflow-hidden rounded-md bg-ink/10 shadow-[0_2px_8px_rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:-translate-y-1", children: _jsx(Image, { src: book.coverUrl, alt: book.titleBn, fill: true, sizes: "(min-width: 1024px) 12vw, 40vw", className: "object-cover" }) }), _jsx("p", { className: "book-price", children: book.priceLabel })] }, book.id))) }), _jsx("div", { className: "mt-6 text-center", children: _jsx(Link, { href: "/?category=ketabi-kotha", className: "inline-block bg-crimson text-white font-ui text-sm px-6 py-2.5 rounded-full hover:bg-crimson-dark transition-colors", children: "\u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u09B8\u09AE\u09B8\u09CD\u09A4 \u09AC\u0987" }) })] }));
}
