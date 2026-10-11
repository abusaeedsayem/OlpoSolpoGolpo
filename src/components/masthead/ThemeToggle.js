'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useThemeStore, THEMES } from '@/store/theme-store';
import { cn } from '@/lib/cn';
import { useState, useRef, useEffect } from 'react';
export function ThemeToggle() {
    var _a;
    var _b;
    const { theme, setTheme } = useThemeStore();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    return (_jsxs("div", { className: "relative", ref: ref, children: [_jsxs("button", { onClick: () => setOpen((o) => !o), "aria-label": "\u09B0\u0999 \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8 \u0995\u09B0\u09C1\u09A8", className: cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-ui', 'border border-ink/20 hover:border-crimson/40 transition-colors', 'bg-surface/50 hover:bg-crimson/5'), children: [_jsx("span", { className: "text-xs", children: "\u25D1" }), _jsx("span", { className: "hidden sm:inline text-ink/70", children: (_b = (_a = THEMES.find((t) => t.value === theme)) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : 'থিম' })] }), open && (_jsx("div", { className: cn('absolute right-0 mt-2 w-36 rounded-xl shadow-lg z-50', 'bg-surface border border-ink/10 overflow-hidden'), children: THEMES.map((t) => (_jsxs("button", { onClick: () => { setTheme(t.value); setOpen(false); }, className: cn('w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-ui text-left', 'hover:bg-crimson/5 transition-colors', theme === t.value && 'text-crimson font-semibold'), children: [_jsx("span", { className: "w-4 h-4 rounded-full border border-ink/20 flex-shrink-0", style: { backgroundColor: t.bg } }), t.label, theme === t.value && _jsx("span", { className: "ml-auto text-crimson", children: "\u2713" })] }, t.value))) }))] }));
}
