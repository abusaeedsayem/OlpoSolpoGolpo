import type { Metadata } from 'next'
import Link from 'next/link'
import { StoryCard } from '@/components/story/StoryCard'
import { CATEGORIES, SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
}

export default async function HomePage() {
  let stories: any[] = []
  try {
    stories = await prisma.story.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        author: { select: { name: true, username: true } },
        category: { select: { name: true, slug: true } },
        _count: { select: { chapters: true } },
      },
      orderBy: { readCount: 'desc' },
      take: 12,
    })
  } catch {
    stories = []
  }

  const displayStories = stories.map((s) => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    description: s.description,
    coverUrl: s.coverUrl,
    authorName: s.author.name,
    authorUsername: s.author.username,
    categoryName: s.category.name,
    readCount: s.readCount,
    chapterCount: s._count.chapters,
    tags: s.tags,
  }))

  return (
    <div className="min-h-screen">
      {/* Hero Section — Compact with background image */}
      <section
        className="relative overflow-hidden py-10 sm:py-14"
        style={{
          backgroundImage: 'url(/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center flex flex-col items-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-teal-500/20 backdrop-blur-sm px-4 py-1.5 text-xs sm:text-sm font-bold text-teal-200 font-bengali border border-teal-400/30">
              <span>✨</span> বিজ্ঞাপনমুক্ত পরিষ্কার পাঠ অভিজ্ঞতা
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white font-bengali leading-tight drop-shadow-lg">
              অল্প স্বল্প <span className="text-amber-400">গল্প</span>
            </h1>

            <p className="mt-2 text-sm sm:text-base text-stone-200 max-w-xl font-bengali leading-relaxed">
              বাংলা ছোটগল্প ও সাহিত্যকর্মের একটি বিজ্ঞাপনমুক্ত, পরিষ্কার ও সুন্দর পাঠ মঞ্চ।
              পড়ুন, নতুন গল্প লিখুন এবং ছড়িয়ে দিন ভালোবাসার অনুভূতি।
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href="/explore"
                className="rounded-xl bg-teal-700 hover:bg-teal-800 px-6 py-2.5 text-sm sm:text-base font-bold text-white transition-colors font-bengali shadow-lg shadow-black/30"
              >
                📖 গল্প পড়ুন (Read Stories)
              </Link>
              <Link
                href="/dashboard/stories/new"
                className="rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm px-6 py-2.5 text-sm sm:text-base font-bold text-white hover:bg-white/20 transition-colors font-bengali"
              >
                ✏️ গল্প লিখুন (Write Studio)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills — Centered */}
      <section className="border-b border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-950 py-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex-shrink-0 flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-sm font-medium text-stone-700 hover:border-teal-400 hover:text-teal-800 hover:bg-teal-50 transition-colors dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:text-teal-300 font-bengali"
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content: Popular Stories Grid — Only real stories from DB */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-bengali">
              🔥 জনপ্রিয় গল্পসমূহ
            </h2>
            <p className="text-sm text-stone-500 font-bengali">পাঠকদের সবচেয়ে পছন্দের সাম্প্রতিক ছোটগল্প</p>
          </div>

          <Link
            href="/explore"
            className="text-xs sm:text-sm font-bold text-teal-800 dark:text-teal-400 hover:underline font-bengali"
          >
            সব দেখুন →
          </Link>
        </div>

        {displayStories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {displayStories.map((story) => (
              <StoryCard key={story.id} {...story} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50">
            <div className="text-5xl mb-4">📖</div>
            <h3 className="text-lg font-bold text-stone-700 dark:text-stone-300 font-bengali mb-2">
              এখনও কোনো গল্প প্রকাশিত হয়নি
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 font-bengali mb-6 max-w-md mx-auto">
              প্রথম লেখক হোন! আপনার গল্প লিখুন এবং প্রকাশ করুন। আপনার গল্পই হবে এই মঞ্চের প্রথম গল্প।
            </p>
            <Link
              href="/dashboard/stories/new"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-700 hover:bg-teal-800 px-6 py-2.5 text-sm font-bold text-white transition-colors font-bengali"
            >
              ✏️ প্রথম গল্প লিখুন
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
