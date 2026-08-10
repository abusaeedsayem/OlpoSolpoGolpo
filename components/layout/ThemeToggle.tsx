'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { READING_THEMES } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div
      className="flex items-center rounded-full border border-stone-200 p-1 dark:border-stone-700"
      role="group"
      aria-label="থিম পরিবর্তন করুন"
    >
      {READING_THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          title={t.label}
          aria-label={t.label}
          aria-pressed={theme === t.id}
          className={cn(
            'rounded-full px-2 py-1 text-sm transition-all duration-200',
            theme === t.id
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
              : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
          )}
        >
          {t.icon}
        </button>
      ))}
    </div>
  )
}
