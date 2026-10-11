'use client';

import { useThemeStore, THEMES } from '@/store/theme-store';
import { cn } from '@/lib/cn';
import { useState, useRef, useEffect } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="রঙ পরিবর্তন করুন"
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-ui',
          'border border-ink/20 hover:border-crimson/40 transition-colors',
          'bg-surface/50 hover:bg-crimson/5'
        )}
      >
        <span className="text-xs">◑</span>
        <span className="hidden sm:inline text-ink/70">
          {THEMES.find((t) => t.value === theme)?.label ?? 'থিম'}
        </span>
      </button>

      {open && (
        <div
          className={cn(
            'absolute right-0 mt-2 w-36 rounded-xl shadow-lg z-50',
            'bg-surface border border-ink/10 overflow-hidden'
          )}
        >
          {THEMES.map((t) => (
            <button
              key={t.value}
              onClick={() => { setTheme(t.value); setOpen(false); }}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-ui text-left',
                'hover:bg-crimson/5 transition-colors',
                theme === t.value && 'text-crimson font-semibold'
              )}
            >
              <span
                className="w-4 h-4 rounded-full border border-ink/20 flex-shrink-0"
                style={{ backgroundColor: t.bg }}
              />
              {t.label}
              {theme === t.value && <span className="ml-auto text-crimson">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
