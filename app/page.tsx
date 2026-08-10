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

  const featuredStories =
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
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-stone-50 dark:from-stone-950 dark:via-amber-950/20 dark:to-stone-900 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 font-bengali">
              <span>✨</span> বিজ্ঞাপনমুক্ত পাঠ অভিজ্ঞতা
            </div>
            <h1 className="font-display text-4xl font-bold text-stone-900 dark:text-stone-100 sm:text-5xl lg:text-6xl font-bengali leading-tight">
              অল্প স্বল্প{' '}
              <span className="text-amber-600 dark:text-amber-400">গল্প</span>
            </h1>
            <p className="mt-4 text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto font-bengali leading-relaxed">
              বাংলা ছোটগল্পের একটি পরিষ্কার, মনোরম পাঠ মঞ্চ।
              লেখুন, পড়ুন, ভালোবাসুন।
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/explore"
                className="rounded-xl bg-amber-500 px-6 py-3 text-base font-semibold text-white hover:bg-amber-600 transition-colors font-bengali shadow-lg shadow-amber-500/25"
              >
                গল্প পড়ুন
              </Link>
              <Link
                href="/register"
                className="rounded-xl border border-stone-200 bg-white px-6 py-3 text-base font-semibold text-stone-800 hover:bg-stone-50 transition-colors dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800 font-bengali"
              >
                লেখক হন
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-800/10" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl dark:bg-orange-800/10" />
      </section>

      {/* Category Pills */}
      <section className="border-b border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-950 py-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex-shrink-0 flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-sm font-medium text-stone-600 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50 transition-colors dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400 dark:hover:text-amber-400 font-bengali"
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-bengali">
                জনপ্রিয় গল্প
              </h2>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400 font-bengali">
                পাঠকদের পছন্দের গল্পগুলো
              </p>
            </div>
            <Link
              href="/explore"
              className="text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 font-bengali transition-colors"
            >
              সব দেখুন →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {featuredStories.map((story) => (
              <StoryCard key={story.id} {...story} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-500 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white font-bengali mb-4">
            আপনার গল্পও শেয়ার করুন
          </h2>
          <p className="text-amber-100 font-bengali text-lg mb-8 leading-relaxed">
            হাজারো পাঠকের কাছে আপনার লেখা পৌঁছে দিন। সম্পূর্ণ বিনামূল্যে।
          </p>
          <Link
            href="/register"
            className="inline-block rounded-xl bg-white px-8 py-3 text-base font-semibold text-amber-700 hover:bg-amber-50 transition-colors font-bengali shadow-lg"
          >
            আজই শুরু করুন
          </Link>
        </div>
      </section>
    </div>
  )
}
