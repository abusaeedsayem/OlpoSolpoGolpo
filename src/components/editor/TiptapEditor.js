'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from '@/lib/cn';
export function TiptapEditor({ content, onChange, placeholder = 'লেখা শুরু করুন...' }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'tiptap-editor outline-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });
    if (!editor) {
        return _jsx("div", { className: "h-[400px] bg-ink/5 rounded-2xl animate-pulse" });
    }
    return (_jsxs("div", { className: "border border-ink/10 rounded-2xl overflow-hidden bg-surface focus-within:border-crimson/30 transition-colors", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-1 p-2 border-b border-ink/10 bg-ink/5", children: [_jsx("button", { onClick: (e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }, className: cn('p-2 rounded font-ui text-sm', editor.isActive('bold') ? 'bg-crimson/10 text-crimson font-bold' : 'text-ink/70 hover:bg-ink/10 font-bold'), "aria-label": "\u0997\u09BE\u09DD (Bold)", children: "B" }), _jsx("button", { onClick: (e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }, className: cn('p-2 rounded font-ui text-sm italic', editor.isActive('italic') ? 'bg-crimson/10 text-crimson' : 'text-ink/70 hover:bg-ink/10'), "aria-label": "\u09AC\u09BE\u0981\u0995\u09BE (Italic)", children: "I" }), _jsx("div", { className: "w-px h-5 bg-ink/20 mx-1" }), _jsx("button", { onClick: (e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }, className: cn('p-2 rounded font-ui text-sm font-semibold', editor.isActive('heading', { level: 2 }) ? 'bg-crimson/10 text-crimson' : 'text-ink/70 hover:bg-ink/10'), children: "H2" }), _jsx("button", { onClick: (e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }, className: cn('p-2 rounded font-ui text-sm font-medium', editor.isActive('heading', { level: 3 }) ? 'bg-crimson/10 text-crimson' : 'text-ink/70 hover:bg-ink/10'), children: "H3" }), _jsx("div", { className: "w-px h-5 bg-ink/20 mx-1" }), _jsx("button", { onClick: (e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }, className: cn('p-2 rounded font-ui text-sm', editor.isActive('blockquote') ? 'bg-crimson/10 text-crimson' : 'text-ink/70 hover:bg-ink/10'), "aria-label": "\u0989\u09A6\u09CD\u09A7\u09C3\u09A4\u09BF (Blockquote)", children: "\u201D" }), _jsx("button", { onClick: (e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }, className: cn('p-2 rounded font-ui text-sm', editor.isActive('bulletList') ? 'bg-crimson/10 text-crimson' : 'text-ink/70 hover:bg-ink/10'), children: "\u2022" })] }), _jsx(EditorContent, { editor: editor })] }));
}
