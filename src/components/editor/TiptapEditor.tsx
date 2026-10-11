'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from '@/lib/cn';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function TiptapEditor({ content, onChange, placeholder = 'লেখা শুরু করুন...' }: TiptapEditorProps) {
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
    return <div className="h-[400px] bg-ink/5 rounded-2xl animate-pulse" />;
  }

  return (
    <div className="border border-ink/10 rounded-2xl overflow-hidden bg-surface focus-within:border-crimson/30 transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-ink/10 bg-ink/5">
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
          className={cn(
            'p-2 rounded font-ui text-sm',
            editor.isActive('bold') ? 'bg-crimson/10 text-crimson font-bold' : 'text-ink/70 hover:bg-ink/10 font-bold'
          )}
          aria-label="গাঢ় (Bold)"
        >
          B
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
          className={cn(
            'p-2 rounded font-ui text-sm italic',
            editor.isActive('italic') ? 'bg-crimson/10 text-crimson' : 'text-ink/70 hover:bg-ink/10'
          )}
          aria-label="বাঁকা (Italic)"
        >
          I
        </button>
        <div className="w-px h-5 bg-ink/20 mx-1" />
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
          className={cn(
            'p-2 rounded font-ui text-sm font-semibold',
            editor.isActive('heading', { level: 2 }) ? 'bg-crimson/10 text-crimson' : 'text-ink/70 hover:bg-ink/10'
          )}
        >
          H2
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }}
          className={cn(
            'p-2 rounded font-ui text-sm font-medium',
            editor.isActive('heading', { level: 3 }) ? 'bg-crimson/10 text-crimson' : 'text-ink/70 hover:bg-ink/10'
          )}
        >
          H3
        </button>
        <div className="w-px h-5 bg-ink/20 mx-1" />
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
          className={cn(
            'p-2 rounded font-ui text-sm',
            editor.isActive('blockquote') ? 'bg-crimson/10 text-crimson' : 'text-ink/70 hover:bg-ink/10'
          )}
          aria-label="উদ্ধৃতি (Blockquote)"
        >
          ”
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
          className={cn(
            'p-2 rounded font-ui text-sm',
            editor.isActive('bulletList') ? 'bg-crimson/10 text-crimson' : 'text-ink/70 hover:bg-ink/10'
          )}
        >
          •
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
