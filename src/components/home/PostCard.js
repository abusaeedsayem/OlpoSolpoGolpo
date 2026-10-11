import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import Image from 'next/image';
import { toBengaliNumerals, publishedAtLabel } from '@/lib/bengali-utils';
/**
 * Magazine card used across homepage bands: cover image with red pill chips
 * (category · author · part number), a serif title, a red byline and the red
 * "•••" read-more mark, plus a published-date line.
 */
export function PostCard({ article, size = 'md' }) {
    const chips = [
        article.categoryName,
        article.authorName,
        article.chapterNumber
            ? `পর্ব ${toBengaliNumerals(article.chapterNumber)}`
            : null,
    ].filter(Boolean);
    const published = publishedAtLabel(article.publishedAt);
    const byline = article.authorName
        ? `${article.authorName} · প্রকাশিত ${published !== null && published !== void 0 ? published : ''}`
        : published
            ? `প্রকাশিত ${published}`
            : null;
    return (_jsxs(Link, { href: `/story/${article.slug}`, className: "feature-card group", children: [_jsxs("div", { className: "relative aspect-[4/3] overflow-hidden bg-ink/10", children: [article.coverImageUrl ? (_jsx(Image, { src: article.coverImageUrl, alt: article.titleBn, fill: true, sizes: "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw", className: "object-cover transition-transform duration-500 group-hover:scale-[1.04]", preload: size === 'lg' })) : (_jsx("div", { className: "absolute inset-0 bg-crimson/15" })), _jsx("div", { className: "absolute top-3 left-3 right-3 flex flex-wrap gap-1.5", children: chips.map((chip) => (_jsx("span", { className: "chip", children: chip }, chip))) })] }), _jsxs("div", { className: "p-4 sm:p-5", children: [_jsx("h3", { className: `post-title ${size === 'lg' ? 'post-title-lg' : ''}`, children: article.titleBn }), article.authorName && (_jsx("p", { className: "post-author mt-2.5", children: article.authorName })), _jsx("span", { className: "read-more mt-3", children: "\u2022\u2022\u2022" }), published && byline && (_jsx("span", { className: "text-xs font-ui text-ink/50 mt-1 block", children: byline }))] })] }));
}
/** Compact list row — used by the কেতাবি কথা / নতুন সংযোজন columns. */
export function PostRow({ article }) {
    return (_jsxs(Link, { href: `/story/${article.slug}`, className: "group flex gap-3 py-3 border-b border-ink/10 last:border-0", children: [_jsx("div", { className: "relative w-20 h-16 shrink-0 rounded-lg overflow-hidden bg-ink/10", children: article.coverImageUrl && (_jsx(Image, { src: article.coverImageUrl, alt: article.titleBn, fill: true, sizes: "80px", className: "object-cover" })) }), _jsxs("div", { className: "min-w-0", children: [_jsx("h4", { className: "font-prose text-[17px] leading-snug text-ink group-hover:text-crimson transition-colors line-clamp-2", children: article.titleBn }), _jsx("p", { className: "text-crimson font-prose text-sm mt-1 truncate", children: article.authorName })] })] }));
}
