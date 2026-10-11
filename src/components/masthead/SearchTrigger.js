'use client';
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/cn';
export function SearchTrigger() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    return (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => setOpen(true), "aria-label": "\u0997\u09B2\u09CD\u09AA \u0996\u09C1\u0981\u099C\u09C1\u09A8", className: cn('p-2 rounded-full hover:bg-crimson/5 transition-colors', 'text-ink/60 hover:text-crimson'), children: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.8, d: "M21 21l-5.197-5.197M15.803 15.803A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" }) }) }), open && (_jsx("div", { className: "fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4", onClick: (e) => e.target === e.currentTarget && setOpen(false), children: _jsxs("div", { className: "bg-surface w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-3 px-5 py-4 border-b border-ink/10", children: [_jsx("svg", { className: "w-5 h-5 text-ink/40 flex-shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.8, d: "M21 21l-5.197-5.197M15.803 15.803A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" }) }), _jsx("input", { autoFocus: true, type: "text", value: query, onChange: (e) => setQuery(e.target.value), placeholder: "\u0997\u09B2\u09CD\u09AA, \u0995\u09AC\u09BF\u09A4\u09BE, \u09B2\u09C7\u0996\u0995 \u0996\u09C1\u0981\u099C\u09C1\u09A8...", className: cn('flex-1 bg-transparent outline-none text-ink font-ui text-base', 'placeholder:text-ink/40'), onKeyDown: (e) => {
                                        if (e.key === 'Escape')
                                            setOpen(false);
                                        if (e.key === 'Enter' && query.trim()) {
                                            setOpen(false);
                                            router.push(`/?q=${encodeURIComponent(query.trim())}`);
                                        }
                                    } }), _jsx("button", { onClick: () => setOpen(false), className: "text-ink/40 hover:text-ink text-sm font-ui px-2", children: "\u09AC\u09BE\u09A4\u09BF\u09B2" })] }), !query && (_jsx("div", { className: "px-5 py-4 text-sm text-ink/50 font-ui", children: "\u099C\u09A8\u09AA\u09CD\u09B0\u09BF\u09AF\u09BC \u09AC\u09BF\u09AD\u09BE\u0997: \u0997\u09B2\u09CD\u09AA \u00B7 \u0995\u09AC\u09BF\u09A4\u09BE \u00B7 \u09A7\u09BE\u09B0\u09BE\u09AC\u09BE\u09B9\u09BF\u0995 \u00B7 \u09AE\u09C1\u0995\u09CD\u09A4 \u0997\u09A6\u09CD\u09AF" }))] }) }))] }));
}
