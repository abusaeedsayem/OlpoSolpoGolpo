import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Convert a string to a URL-safe slug */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Format a date to a Bengali-friendly readable string */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** Format a date to English for metadata */
export function formatDateEn(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/** Truncate a string to a given length */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trimEnd() + '…'
}

/** Format a number as a compact Bengali read count  */
export function formatReadCount(count: number): string {
  if (count >= 100000) return `${(count / 100000).toFixed(1)} লক্ষ`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return count.toString()
}

/** Calculate estimated reading time in minutes */
export function readingTime(wordCount: number): number {
  const WORDS_PER_MINUTE = 200 // average Bengali reading speed
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE))
}
