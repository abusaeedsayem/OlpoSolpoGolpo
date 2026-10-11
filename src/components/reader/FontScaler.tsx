'use client';

import { useFontStore, FONT_SIZE_MAP } from '@/store/font-store';
import { cn } from '@/lib/cn';

export function FontScaler() {
  const { fontSize, increase, decrease } = useFontStore();

  return (
    <div className="flex items-center gap-1 bg-surface border border-ink/15 rounded-full px-1 py-1 shadow-sm">
      <button
        onClick={decrease}
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-ui font-medium',
          'hover:bg-crimson/10 hover:text-crimson transition-colors',
          'disabled:opacity-30 disabled:cursor-not-allowed'
        )}
        disabled={fontSize === 'sm'}
        aria-label="অক্ষর ছোট করুন"
      >
        অ<sup className="text-[8px]">−</sup>
      </button>
      <div className="w-px h-4 bg-ink/15" />
      <button
        onClick={increase}
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-ui font-bold',
          'hover:bg-crimson/10 hover:text-crimson transition-colors',
          'disabled:opacity-30 disabled:cursor-not-allowed'
        )}
        disabled={fontSize === 'xl'}
        aria-label="অক্ষর বড় করুন"
      >
        অ<sup className="text-[8px]">+</sup>
      </button>
    </div>
  );
}

/**
 * Wrapper that injects the current font size CSS variable into the article body.
 */
export function ReaderFontWrapper({ children }: { children: React.ReactNode }) {
  const { fontSize } = useFontStore();
  return (
    <div style={{ '--reader-font-size': FONT_SIZE_MAP[fontSize] } as React.CSSProperties}>
      {children}
    </div>
  );
}
