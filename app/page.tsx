import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
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

  const displayStories =
    stories.length > 0
      ? stories.map((s) => ({
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
      : [
          {
            id: '1',
            title: 'নীল জলের গান',
            slug: 'nil-joler-gaan',
            description: 'একটি ছোট মেয়ে এবং তার হারানো স্বপ্নের গল্প। সমুদ্রের নীল জলে খুঁজে পায় সে তার হারানো শৈশব।',
            coverUrl: null,
            authorName: 'সুমাইয়া হক',
            authorUsername: 'sumaiya',
            categoryName: 'সামাজিক',
            readCount: 12340,
            chapterCount: 8,
            tags: ['শৈশব', 'স্বপ্ন'],
          },
          {
            id: '2',
            title: 'রাতের শহরে',
            slug: 'rater-shohore',
            description: 'ঢাকার রাতের অন্ধকারে একজন গোয়েন্দার রহস্যময় যাত্রা।',
            coverUrl: null,
            authorName: 'রাফি আহমেদ',
            authorUsername: 'rafi',
            categoryName: 'রহস্য',
            readCount: 8900,
            chapterCount: 12,
            tags: ['রহস্য', 'ঢাকা'],
          },
        ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-amber-50/50 to-stone-50 dark:from-stone-950 dark:via-teal-950/20 dark:to-stone-900 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center flex flex-col items-center">
            {/* Brand Logo Banner */}
            <div className="relative h-24 w-52 sm:h-32 sm:w-64 mb-4 transform hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt={SITE_NAME}
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-100 dark:bg-teal-900/40 px-4 py-1.5 text-xs sm:text-sm font-bold text-teal-800 dark:text-teal-300 font-bengali border border-teal-200 dark:border-teal-800">
              <span>✨</span> বিজ্ঞাপনমুক্ত পরিষ্কার পাঠ অভিজ্ঞতা
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-bold text-teal-900 dark:text-stone-100 font-bengali leading-tight">
              অল্প স্বল্প <span className="text-amber-600 dark:text-amber-400">গল্প</span>
            </h1>

            <p className="mt-3 text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-2xl font-bengali leading-relaxed">
              বাংলা ছোটগল্প ও সাহিত্যকর্মের একটি বিজ্ঞাপনমুক্ত, পরিষ্কার ও সুন্দর পাঠ মঞ্চ।
              পড়ুন, নতুন গল্প লিখুন এবং ছড়িয়ে দিন ভালোবাসার অনুভূতি।
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/explore"
                className="rounded-xl bg-teal-800 px-7 py-3 text-base font-bold text-white hover:bg-teal-900 transition-colors font-bengali shadow-lg shadow-teal-900/20"
              >
                📖 গল্প পড়ুন (Read Stories)
              </Link>
              <Link
                href="/dashboard/stories/new"
                className="rounded-xl border border-teal-300 dark:border-teal-700 bg-white dark:bg-stone-900 px-7 py-3 text-base font-bold text-teal-800 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-stone-800 transition-colors font-bengali shadow-sm"
              >
                ✏️ গল্প লিখুন (Write Studio)
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative background blobs */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-800/10" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-800/10" />
      </section>

      {/* Category Pills */}
      <section className="border-b border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-950 py-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
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

      {/* Main Content: Popular Stories Grid */}
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

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {displayStories.map((story) => (
            <StoryCard key={story.id} {...story} />
          ))}
        </div>
      </section>
    </div>
  )
}
