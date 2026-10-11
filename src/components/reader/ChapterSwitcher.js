import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { toBengaliNumerals } from '@/lib/bengali-utils';
export function ChapterSwitcher({ chapters, currentSlug }) {
    if (chapters.length <= 1)
        return null;
    const currentIndex = chapters.findIndex((c) => c.slug === currentSlug);
    const prev = currentIndex > 0 ? chapters[currentIndex - 1] : null;
    const next = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
    return (_jsx("div", { className: "sticky bottom-0 bg-[var(--bg-canvas,#FAF8F5)] border-t border-ink/10 py-3 px-4 mt-12 backdrop-blur-sm", children: _jsxs("div", { className: "max-w-reader mx-auto flex items-center justify-between gap-4", children: [prev ? (_jsxs(Link, { href: `/story/${prev.slug}`, className: cn('flex items-center gap-2 text-sm font-ui text-ink/60 hover:text-crimson transition-colors', 'max-w-[45%]'), children: [_jsx("span", { children: "\u2190" }), _jsx("span", { className: "line-clamp-1", children: prev.titleBn })] })) : (_jsx("div", {})), _jsxs("div", { className: "text-xs text-ink/40 font-ui text-center flex-shrink-0", children: [toBengaliNumerals(currentIndex + 1), " / ", toBengaliNumerals(chapters.length)] }), next ? (_jsxs(Link, { href: `/story/${next.slug}`, className: cn('flex items-center gap-2 text-sm font-ui text-ink/60 hover:text-crimson transition-colors', 'max-w-[45%] text-right'), children: [_jsx("span", { className: "line-clamp-1", children: next.titleBn }), _jsx("span", { children: "\u2192" })] })) : (_jsx("div", {}))] }) }));
}
