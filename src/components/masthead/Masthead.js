import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import Image from 'next/image';
import { getBengaliDate } from '@/lib/bengali-utils';
import { ThemeToggle } from './ThemeToggle';
import { SearchTrigger } from './SearchTrigger';
// Category navigation — mirrors thehellotesting.com's bar, pointing at our own
// category filter on the homepage.
export const NAV_ITEMS = [
    { label: 'ফিচার স্টোরি', slug: 'feature' },
    { label: 'ধারাবাহিক', slug: 'dharabahik' },
    { label: 'উপন্যাস', slug: 'uponyas' },
    { label: 'গল্প', slug: 'golpo' },
    { label: 'কবিতা', slug: 'kobita' },
];
const SOCIALS = [
    {
        label: 'Facebook',
        href: 'https://facebook.com',
        path: 'M13.5 9H16V6h-2.5C11.6 6 10 7.6 10 9.5V11H8v3h2v7h3v-7h2.2l.4-3H13v-1.2c0-.5.2-.8.5-.8z',
    },
    {
        label: 'Twitter',
        href: 'https://twitter.com',
        path: 'M18 6.5c-.5.3-1.1.5-1.7.6.6-.4 1.1-1 1.3-1.7-.6.4-1.2.6-1.9.8a3 3 0 0 0-5.1 2.7A8.5 8.5 0 0 1 4.6 5.6a3 3 0 0 0 .9 4 3 3 0 0 1-1.3-.4 3 3 0 0 0 2.4 3 3 3 0 0 1-1.3 0 3 3 0 0 0 2.8 2.1 6 6 0 0 1-4.4 1.2 8.5 8.5 0 0 0 13.1-7.6c.6-.4 1.1-1 1.5-1.6z',
    },
    {
        label: 'YouTube',
        href: 'https://youtube.com',
        path: 'M20 8.5a2.4 2.4 0 0 0-1.7-1.7C16.8 6.3 12 6.3 12 6.3s-4.8 0-6.3.5A2.4 2.4 0 0 0 4 8.5 25 25 0 0 0 3.6 12c0 1.2.1 2.4.4 3.5a2.4 2.4 0 0 0 1.7 1.7c1.5.4 6.3.4 6.3.4s4.8 0 6.3-.5a2.4 2.4 0 0 0 1.7-1.7c.3-1.1.4-2.3.4-3.5s-.1-2.4-.4-3.5zM10.2 14.6V9.4L14.6 12l-4.4 2.6z',
    },
];
export function Masthead() {
    const dateString = getBengaliDate();
    return (_jsxs("header", { className: "relative z-40", children: [_jsx("div", { className: "masthead-bar", children: _jsxs("div", { className: "max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-[86px] sm:h-[104px] flex items-center justify-between gap-4", children: [_jsxs("div", { className: "hidden md:flex items-center gap-2 text-[15px] text-ink font-prose min-w-[240px]", children: [_jsx("span", { className: "text-crimson text-sm", children: "\u25A6" }), _jsx("span", { children: dateString })] }), _jsxs(Link, { href: "/", className: "group flex flex-col items-center justify-center", children: [_jsx(Image, { src: "/OlpoSolpoGolpo_Logo.png", alt: "\u0985\u09B2\u09CD\u09AA \u09B8\u09CD\u09AC\u09B2\u09CD\u09AA \u0997\u09B2\u09CD\u09AA", width: 1983, height: 793, priority: true, className: "h-[46px] sm:h-[58px] w-auto object-contain" }), _jsx("span", { className: "mt-1 font-prose text-[13px] sm:text-[15px] text-ink/80 group-hover:text-crimson transition-colors", children: "\u09AA\u09B0\u09A4\u09C7 \u09AA\u09B0\u09B6\u09C7 \u09AC\u09BE\u0999\u09BE\u09B2\u09BF\u09AF\u09BC\u09BE\u09A8\u09BE" })] }), _jsxs("div", { className: "flex items-center justify-end gap-2 sm:gap-3 min-w-[130px]", children: [_jsx(SearchTrigger, {}), _jsx(ThemeToggle, {}), _jsx("div", { className: "hidden sm:flex items-center gap-1", children: SOCIALS.map((s) => (_jsx("a", { href: s.href, target: "_blank", rel: "noopener noreferrer", "aria-label": s.label, className: "p-1.5 rounded-full text-crimson hover:bg-crimson/10 transition-colors", children: _jsx("svg", { className: "w-[18px] h-[18px]", fill: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: s.path }) }) }, s.label))) })] })] }) }), _jsx("nav", { className: "nav-bar", "aria-label": "\u09AC\u09BF\u09AD\u09BE\u0997 \u09A8\u09C7\u09AD\u09BF\u0997\u09C7\u09B6\u09A8", children: _jsx("div", { className: "max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6", children: _jsxs("ul", { className: "flex items-center gap-0.5 py-1.5 overflow-x-auto scrollbar-hide whitespace-nowrap", children: [_jsx("li", { children: _jsx(Link, { href: "/", className: "nav-link", "data-active": "true", children: "\u09B8\u09AC \u09B2\u09C7\u0996\u09BE" }) }), NAV_ITEMS.map((item) => (_jsx("li", { children: _jsx(Link, { href: `/?category=${item.slug}`, className: "nav-link", children: item.label }) }, item.slug))), _jsx("li", { className: "ml-auto pl-2", children: _jsx(Link, { href: "/contribute", className: "nav-link bg-white !text-crimson font-semibold hover:!bg-white/90", children: "\u270D \u09B2\u09BF\u0996\u09C1\u09A8" }) })] }) }) })] }));
}
