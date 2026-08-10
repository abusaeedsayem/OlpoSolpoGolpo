import { cn } from '@/lib/utils'
import { TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  showWordCount?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, value, showWordCount, ...props }, ref) => {
    const wordCount =
      showWordCount && typeof value === 'string'
        ? value.trim().split(/\s+/).filter(Boolean).length
        : null

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <div className="flex items-center justify-between">
            <label htmlFor={id} className="text-sm font-medium text-stone-700 dark:text-stone-300 font-bengali">
              {label}
            </label>
            {wordCount !== null && (
              <span className="text-xs text-stone-400">{wordCount} শব্দ</span>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          id={id}
          value={value}
          className={cn(
            'min-h-[120px] resize-y rounded-lg border border-stone-200 bg-white px-4 py-3',
            'text-stone-900 placeholder:text-stone-400 transition-colors',
            'focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20',
            'dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'font-bengali text-base leading-relaxed',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-400/20',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500 font-bengali">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
