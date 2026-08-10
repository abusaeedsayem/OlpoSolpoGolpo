import type { Metadata } from 'next'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'বিভাগসমূহ',
  description: 'অল্প স্বল্প গল্প — গল্পের সকল বিভাগ ও পর্যায়সূচি',
}

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 font-bengali">
          গল্পের বিভাগসমূহ
        </h1>
        <p className="mt-2 text-stone-500 dark:text-stone-400 font-bengali">
          আপনার প্রিয় ঘরানার গল্প বেছে নিয়ে পড়া শুরু করুন
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="group flex items-start gap-4 p-6 rounded-2xl border border-stone-100 bg-white shadow-sm hover:shadow-md hover:border-amber-300 transition-all dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="text-4xl rounded-xl bg-amber-50 p-3 dark:bg-amber-900/30 group-hover:scale-110 transition-transform">
              {cat.emoji}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-bengali group-hover:text-amber-600 transition-colors">
                {cat.name}
              </h2>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400 font-bengali">
                {cat.name} ঘরানার সেরা ছোটগল্প ও উপন্যাসিকা।
              </p>
              <span className="mt-3 inline-block text-xs font-semibold text-amber-600 dark:text-amber-400 font-bengali">
                গল্প দেখুন →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
