import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { StoryCard } from '@/components/story/StoryCard'
import { CATEGORIES, SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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

  // Only show real stories from DB — no placeholders ever
  const displayStories = stories.map((s) => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    description: s.description,
    coverUrl: s.coverUrl,
    authorName: s.author.name,
    authorUsername: s.author.username,
    categoryName: s.category?.name ?? '',
    readCount: s.readCount,
    chapterCount: s._count.chapters,
    tags: s.tags,
  }))

  return (
    <div className="min-h-screen">

      {/* ── HERO SECTION — Compact with Bengali-themed background ── */}
      <section className="relative overflow-hidden" style={{ minHeight: '200px' }}>

        {/* Background image using Next.js Image */}
        <Image
          src="/hero-bg.jpg"
          alt="Bengali literature background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Dark gradient overlay so text is readable */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.65) 60%, rgba(0,0,0,0.82) 100%)' }}
        />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col items-center text-center">

            {/* Title */}
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white font-bengali leading-tight drop-shadow-lg">
              অল্প স্বল্প <span className="text-amber-400">গল্প</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-2 text-sm sm:text-base text-stone-200 max-w-xl font-bengali leading-relaxed drop-shadow">
              বাংলা ছোটগল্প ও সাহিত্যকর্মের একটি বিজ্ঞাপনমুক্ত, পরিষ্কার ও সুন্দর পাঠ মঞ্চ।
              পড়ুন, নতুন গল্প লিখুন এবং ছড়িয়ে দিন ভালোবাসার অনুভূতি।
            </p>

            {/* CTA Buttons */}
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href="/explore"
                className="rounded-xl bg-teal-700 hover:bg-teal-800 px-6 py-2.5 text-sm sm:text-base font-bold text-white transition-colors font-bengali shadow-lg"
              >
                📖 গল্প পড়ুন (Read Stories)
              </Link>
              <Link
                href="/dashboard/stories/new"
                className="rounded-xl border border-white/40 px-6 py-2.5 text-sm sm:text-base font-bold text-white hover:bg-white/15 transition-colors font-bengali"
                style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(6px)' }}
              >
                ✏️ গল্প লিখুন (Write Studio)
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── CATEGORY PILLS — Centered on all devices ── */}
      <section className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 py-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap gap-2 items-center justify-center">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-sm font-medium text-stone-700 hover:border-teal-400 hover:text-teal-800 hover:bg-teal-50 transition-colors dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:text-teal-300 font-bengali whitespace-nowrap"
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR STORIES — Real DB data only, no placeholders ── */}
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
          <div className="text-center py-20 px-4 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50">
            <div className="text-5xl mb-4">📖</div>
            <h3 className="text-lg font-bold text-stone-700 dark:text-stone-300 font-bengali mb-2">
              এখনও কোনো গল্প প্রকাশিত হয়নি
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 font-bengali mb-6 max-w-md mx-auto">
              প্রথম লেখক হোন! আপনার গল্প লিখুন এবং প্রকাশ করুন।
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
