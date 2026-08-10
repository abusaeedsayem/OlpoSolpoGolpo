import type { Metadata } from 'next'
import Link from 'next/link'
import { StoryCard } from '@/components/story/StoryCard'
import { CATEGORIES } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'গল্প খুঁজুন',
  description: 'অল্প স্বল্প গল্প — বাংলা সব ধরনের গল্প খুঁজুন ও পড়ুন',
}

interface ExplorePageProps {
  searchParams: Promise<{ q?: string; category?: string }>
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const { q, category } = await searchParams

  let stories: any[] = []
  try {
    const where: any = { status: 'PUBLISHED' }
    if (category) {
      where.category = { slug: category }
    }
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { tags: { has: q } },
      ]
    }

    stories = await prisma.story.findMany({
      where,
      include: {
        author: { select: { name: true, username: true } },
        category: { select: { name: true, slug: true } },
        _count: { select: { chapters: true } },
      },
      orderBy: { readCount: 'desc' },
      take: 24,
    })
  } catch {
    stories = []
  }

  // Fallback mock if database is empty
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
          {
            id: '3',
            title: 'তোমার জন্য অপেক্ষা',
            slug: 'tomar-jonno-opekkha',
            description: 'দুটি হৃদয়ের মাঝে এক অদৃশ্য সুতোর টান।',
            coverUrl: null,
            authorName: 'মারিয়া বেগম',
            authorUsername: 'maria',
            categoryName: 'রোমান্স',
            readCount: 23100,
            chapterCount: 15,
            tags: ['প্রেম'],
          },
        ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header & Search */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 font-bengali">
          গল্প খুঁজুন
        </h1>
        <p className="mt-2 text-stone-500 dark:text-stone-400 font-bengali">
          আপনার পছন্দের বিষয় বা শিরোনাম লিখে খুঁজুন
        </p>

        <form action="/explore" method="GET" className="mt-6 flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q || ''}
            placeholder="গল্পের নাম, লেখক বা শব্দ লিখে খুঁজুন…"
            className="flex-1 rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 font-bengali text-base"
          />
          <button
            type="submit"
            className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white hover:bg-amber-600 font-bengali transition-colors"
          >
            খুঁজুন
          </button>
        </form>
      </div>

      {/* Category Pills */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Link
          href="/explore"
          className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium font-bengali border transition-colors ${
            !category
              ? 'bg-amber-500 text-white border-amber-500'
              : 'bg-white border-stone-200 text-stone-600 hover:border-amber-300 dark:bg-stone-900 dark:border-stone-700 dark:text-stone-300'
          }`}
        >
          সব গল্প
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/explore?category=${cat.slug}`}
            className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium font-bengali border transition-colors ${
              category === cat.slug
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white border-stone-200 text-stone-600 hover:border-amber-300 dark:bg-stone-900 dark:border-stone-700 dark:text-stone-300'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>

      {/* Results grid */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-stone-800 dark:text-stone-200 font-bengali">
          {category
            ? `${CATEGORIES.find((c) => c.slug === category)?.name || category} বিভাগের গল্প`
            : q
            ? `"${q}" সংক্রান্ত ফলাফল`
            : 'সকল গল্প'}
        </h2>

        {displayStories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {displayStories.map((story) => (
              <StoryCard key={story.id} {...story} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-stone-500 font-bengali">
            কোনো গল্প পাওয়া যায়নি।
          </div>
        )}
      </div>
    </div>
  )
}
