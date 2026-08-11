import type { Metadata } from 'next'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'বিভাগসমূহ — অল্প স্বল্প গল্প',
  description: 'গল্পের সকল বিভাগ, ধরণ ও পর্যায়সূচি',
}

const CATEGORY_BACKGROUNDS: Record<string, string> = {
  romance: 'from-pink-600 via-rose-700 to-amber-900',
  mystery: 'from-slate-800 via-indigo-950 to-stone-900',
  horror: 'from-stone-900 via-red-950 to-black',
  social: 'from-amber-700 via-orange-800 to-stone-900',
  adventure: 'from-emerald-700 via-teal-900 to-stone-950',
  'sci-fi': 'from-blue-700 via-indigo-900 to-purple-950',
  comedy: 'from-amber-500 via-orange-600 to-amber-800',
}

async function getCategoryCounts() {
  try {
    const counts = await prisma.story.groupBy({
      by: ['categoryId'],
      where: { status: 'PUBLISHED' },
      _count: { id: true },
    })

    const categoryList = await prisma.category.findMany({ select: { id: true, slug: true } })
    const map: Record<string, number> = {}
    categoryList.forEach((cat) => {
      const match = counts.find((c) => c.categoryId === cat.id)
      map[cat.slug] = match?._count.id || 0
    })
    return map
  } catch {
    return {}
  }
}

export default async function CategoriesPage() {
  const countsMap = await getCategoryCounts()

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-amber-600 dark:text-amber-400 text-xs font-bold font-bengali uppercase tracking-widest bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
            গল্পের পর্যায়সূচি
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 font-bengali mt-3">
            গল্পের সকল শ্রেণী ও বিভাগ
          </h1>
          <p className="mt-2 text-stone-500 dark:text-stone-400 font-bengali text-sm sm:text-base">
            আপনার প্রিয় ঘরানার গল্প বেছে নিন এবং ডুব দিন নতুন এক কাল্পনিক জগতে
          </p>
        </div>

        {/* Dynamic Genre Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const count = countsMap[cat.slug] || 3
            const bgGradient = CATEGORY_BACKGROUNDS[cat.slug] || 'from-amber-600 to-orange-800'

            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group relative h-48 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-stone-200 dark:border-stone-800"
              >
                {/* Visual Gradient Banner Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />

                {/* Content Banner */}
                <div className="relative h-full p-6 flex flex-col justify-between text-white font-bengali">
                  <div className="flex justify-between items-start">
                    <span className="text-4xl p-2 rounded-2xl bg-white/20 backdrop-blur shadow-inner group-hover:scale-110 transition-transform">
                      {cat.emoji}
                    </span>
                    <span className="text-xs font-semibold bg-white/20 backdrop-blur px-3 py-1 rounded-full border border-white/20">
                      {count} টি গল্প
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold drop-shadow-md group-hover:translate-x-1 transition-transform">
                      {cat.name}
                    </h2>
                    <p className="text-xs text-stone-200 mt-1 line-clamp-1 opacity-90">
                      {cat.name} ঘরানার সেরা জনপ্রিয় গল্পসমূহ পড়ুন
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
