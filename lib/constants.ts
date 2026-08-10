export const SITE_NAME = 'অল্প স্বল্প গল্প'
export const SITE_NAME_EN = 'Olpo Solpo Golpo'
export const SITE_DESCRIPTION =
  'বাংলা ছোটগল্পের একটি বিজ্ঞাপনমুক্ত, পরিষ্কার পাঠ মঞ্চ।'
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const NAV_LINKS = [
  { label: 'হোম', href: '/' },
  { label: 'গল্প খুঁজুন', href: '/explore' },
  { label: 'বিভাগ', href: '/categories' },
]

export const AUTHOR_NAV_LINKS = [
  { label: 'ড্যাশবোর্ড', href: '/dashboard' },
  { label: 'আমার গল্প', href: '/dashboard/stories' },
  { label: 'নতুন গল্প', href: '/dashboard/stories/new' },
]

export const CATEGORIES = [
  { name: 'রোমান্স', slug: 'romance', emoji: '💕' },
  { name: 'রহস্য', slug: 'mystery', emoji: '🔍' },
  { name: 'ভৌতিক', slug: 'horror', emoji: '👻' },
  { name: 'ঐতিহাসিক', slug: 'historical', emoji: '📜' },
  { name: 'সামাজিক', slug: 'social', emoji: '🏘️' },
  { name: 'অ্যাডভেঞ্চার', slug: 'adventure', emoji: '⚔️' },
  { name: 'বিজ্ঞান কল্পকাহিনী', slug: 'sci-fi', emoji: '🚀' },
  { name: 'হাস্যরস', slug: 'comedy', emoji: '😄' },
  { name: 'শিশু সাহিত্য', slug: 'childrens', emoji: '🌈' },
  { name: 'কবিতা', slug: 'poetry', emoji: '✍️' },
]

export const STORY_STATUSES = {
  DRAFT: 'খসড়া',
  PUBLISHED: 'প্রকাশিত',
  ARCHIVED: 'সংরক্ষিত',
} as const

export const ROLES = {
  READER: 'পাঠক',
  AUTHOR: 'লেখক',
  ADMIN: 'অ্যাডমিন',
} as const

export const READING_THEMES = [
  { id: 'light', label: 'আলো', icon: '☀️' },
  { id: 'dark', label: 'অন্ধকার', icon: '🌙' },
  { id: 'sepia', label: 'পাণ্ডুলিপি', icon: '📖' },
] as const

export type ReadingTheme = (typeof READING_THEMES)[number]['id']

export const DEFAULT_COVER_COLORS = [
  'from-amber-400 to-orange-600',
  'from-purple-400 to-pink-600',
  'from-teal-400 to-cyan-600',
  'from-rose-400 to-red-600',
  'from-indigo-400 to-blue-600',
  'from-green-400 to-emerald-600',
]
