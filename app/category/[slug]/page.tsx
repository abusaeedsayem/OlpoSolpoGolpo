import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { StoryCard } from '@/components/story/StoryCard'
import { CATEGORIES } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = CATEGORIES.find((c) => c.slug === slug)
  if (!category) return { title: 'বিভাগ পাওয়া যায়নি' }
  return {
    title: `${category.name} বিভাগের গল্প`,
    description: `${category.name} ঘরানার সেরা গল্পসমূহ পড়ুন।`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const categoryInfo = CATEGORIES.find((c) => c.slug === slug)

  if (!categoryInfo) notFound()

  let stories: any[] = []
  try {
    stories = await prisma.story.findMany({
      where: {
        status: 'PUBLISHED',
        category: { slug },
      },
      include: {
        author: { select: { name: true, username: true } },
        category: { select: { name: true, slug: true } },
        _count: { select: { chapters: true } },
      },
      orderBy: { readCount: 'desc' },
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
            title: `${categoryInfo.name} এর প্রথম উপাখ্যান`,
            slug: 'first-story',
            description: `${categoryInfo.name} বিভাগের একটি নমুনা গল্প।`,
            coverUrl: null,
            authorName: 'লেখক নাম',
            authorUsername: 'author',
            categoryName: categoryInfo.name,
            readCount: 1500,
            chapterCount: 3,
            tags: [categoryInfo.slug],
          },
        ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Breadcrumb & Header */}
      <div className="mb-8">
        <Link
          href="/categories"
          className="text-xs text-stone-500 hover:text-amber-600 font-bengali transition-colors"
        >
          ← সকল বিভাগ
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-4xl">{categoryInfo.emoji}</span>
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 font-bengali">
              {categoryInfo.name}
            </h1>
            <p className="text-sm text-stone-500 font-bengali">
              মোট {displayStories.length.toLocaleString('bn-BD')} টি গল্প রয়েছে
            </p>
          </div>
        </div>
      </div>

      {/* Stories grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {displayStories.map((story) => (
          <StoryCard key={story.id} {...story} />
        ))}
      </div>
    </div>
  )
}
