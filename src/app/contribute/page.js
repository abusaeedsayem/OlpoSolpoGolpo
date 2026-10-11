'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
export default function ContributePage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('golpo');
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim())
            return;
        // In a real app, we'd submit this to our API
        setSubmitted(true);
        // Reset form after 3 seconds
        setTimeout(() => {
            setSubmitted(false);
            setTitle('');
            setContent('');
            setCategory('golpo');
        }, 3000);
    };
    return (_jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: [_jsxs("header", { className: "mb-8 text-center", children: [_jsx("span", { className: "text-4xl mb-4 block", children: "\u270D\uFE0F" }), _jsx("h1", { className: "text-3xl font-bold font-ui text-[var(--text-primary)] mb-2", children: "\u0997\u09B2\u09CD\u09AA \u09B2\u09BF\u0996\u09C1\u09A8" }), _jsx("p", { className: "text-ink/60 font-prose text-lg", children: "\u0986\u09AA\u09A8\u09BE\u09B0 \u09AD\u09BE\u09AC\u09A8\u09BE, \u0986\u09AA\u09A8\u09BE\u09B0 \u0997\u09B2\u09CD\u09AA \u09B6\u09C7\u09AF\u09BC\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8 \u09AA\u09BE\u09A0\u0995\u09A6\u09C7\u09B0 \u09B8\u09BE\u09A5\u09C7" })] }), submitted ? (_jsxs("div", { className: "bg-green-50 border border-green-200 text-green-700 px-6 py-12 rounded-2xl text-center", children: [_jsx("span", { className: "text-5xl block mb-4", children: "\uD83C\uDF89" }), _jsx("h2", { className: "text-2xl font-bold font-ui mb-2", children: "\u0986\u09AA\u09A8\u09BE\u09B0 \u09B2\u09C7\u0996\u09BE\u099F\u09BF \u09B8\u09AB\u09B2\u09AD\u09BE\u09AC\u09C7 \u099C\u09AE\u09BE \u09A6\u09C7\u0993\u09AF\u09BC\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7!" }), _jsx("p", { className: "font-prose", children: "\u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u09B8\u09AE\u09CD\u09AA\u09BE\u09A6\u0995\u09C0\u09AF\u09BC \u09A6\u09B2 \u09B2\u09C7\u0996\u09BE\u099F\u09BF \u09AA\u09B0\u09CD\u09AF\u09BE\u09B2\u09CB\u099A\u09A8\u09BE \u0995\u09B0\u09C7 \u09B6\u09C0\u0998\u09CD\u09B0\u0987 \u09AA\u09CD\u09B0\u0995\u09BE\u09B6 \u0995\u09B0\u09AC\u09C7\u0964" })] })) : (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "title", className: "block text-sm font-bold font-ui text-[var(--text-primary)]", children: "\u09B6\u09BF\u09B0\u09CB\u09A8\u09BE\u09AE" }), _jsx("input", { id: "title", type: "text", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "\u0997\u09B2\u09CD\u09AA\u09C7\u09B0 \u09B8\u09C1\u09A8\u09CD\u09A6\u09B0 \u098F\u0995\u099F\u09BF \u09A8\u09BE\u09AE \u09A6\u09BF\u09A8...", className: "w-full px-4 py-3 rounded-xl border border-ink/10 bg-surface text-xl font-prose focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/50 transition-colors", required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "category", className: "block text-sm font-bold font-ui text-[var(--text-primary)]", children: "\u09AC\u09BF\u09AD\u09BE\u0997" }), _jsxs("select", { id: "category", value: category, onChange: (e) => setCategory(e.target.value), className: "w-full px-4 py-3 rounded-xl border border-ink/10 bg-surface font-ui focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/50 transition-colors appearance-none", children: [_jsx("option", { value: "golpo", children: "\u099B\u09CB\u099F \u0997\u09B2\u09CD\u09AA" }), _jsx("option", { value: "dharabahik", children: "\u09A7\u09BE\u09B0\u09BE\u09AC\u09BE\u09B9\u09BF\u0995" }), _jsx("option", { value: "kobita", children: "\u0995\u09AC\u09BF\u09A4\u09BE" }), _jsx("option", { value: "mukto-godyo", children: "\u09AE\u09C1\u0995\u09CD\u09A4 \u0997\u09A6\u09CD\u09AF" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-bold font-ui text-[var(--text-primary)]", children: "\u09AE\u09C2\u09B2 \u09B2\u09C7\u0996\u09BE" }), _jsx(TiptapEditor, { content: content, onChange: setContent, placeholder: "\u0986\u09AA\u09A8\u09BE\u09B0 \u0997\u09B2\u09CD\u09AA \u098F\u0996\u09BE\u09A8\u09C7 \u09B2\u09BF\u0996\u09C1\u09A8..." })] }), _jsx("div", { className: "flex justify-end pt-4", children: _jsx("button", { type: "submit", disabled: !title.trim() || !content.trim(), className: "px-8 py-3 bg-crimson text-white rounded-full font-bold font-ui shadow-md hover:bg-crimson-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: "\u099C\u09AE\u09BE \u09A6\u09BF\u09A8" }) })] }))] }));
}
