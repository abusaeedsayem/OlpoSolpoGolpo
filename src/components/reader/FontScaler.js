'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useFontStore, FONT_SIZE_MAP } from '@/store/font-store';
import { cn } from '@/lib/cn';
export function FontScaler() {
    const { fontSize, increase, decrease } = useFontStore();
    return (_jsxs("div", { className: "flex items-center gap-1 bg-surface border border-ink/15 rounded-full px-1 py-1 shadow-sm", children: [_jsxs("button", { onClick: decrease, className: cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-ui font-medium', 'hover:bg-crimson/10 hover:text-crimson transition-colors', 'disabled:opacity-30 disabled:cursor-not-allowed'), disabled: fontSize === 'sm', "aria-label": "\u0985\u0995\u09CD\u09B7\u09B0 \u099B\u09CB\u099F \u0995\u09B0\u09C1\u09A8", children: ["\u0985", _jsx("sup", { className: "text-[8px]", children: "\u2212" })] }), _jsx("div", { className: "w-px h-4 bg-ink/15" }), _jsxs("button", { onClick: increase, className: cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-ui font-bold', 'hover:bg-crimson/10 hover:text-crimson transition-colors', 'disabled:opacity-30 disabled:cursor-not-allowed'), disabled: fontSize === 'xl', "aria-label": "\u0985\u0995\u09CD\u09B7\u09B0 \u09AC\u09A1\u09BC \u0995\u09B0\u09C1\u09A8", children: ["\u0985", _jsx("sup", { className: "text-[8px]", children: "+" })] })] }));
}
/**
 * Wrapper that injects the current font size CSS variable into the article body.
 */
export function ReaderFontWrapper({ children }) {
    const { fontSize } = useFontStore();
    return (_jsx("div", { style: { '--reader-font-size': FONT_SIZE_MAP[fontSize] }, children: children }));
}
