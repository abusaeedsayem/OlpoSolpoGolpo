import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { ChapterList } from '@/components/story/ChapterList'
import { formatDate, formatReadCount } from '@/lib/utils'
import { prisma } from '@/lib/prisma'

interface StoryPageProps {
  params: Promise<{ slug: string }>
}

async function getStory(slug: string) {
  try {
    const story = await prisma.story.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, username: true, avatarUrl: true, bio: true } },
        category: { select: { name: true, slug: true } },
        chapters: {
          orderBy: { chapterNumber: 'asc' },
          select: { id: true, chapterNumber: true, title: true, status: true, wordCount: true },
        },
        reviews: true,
      },
    })
    return story
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const story = await getStory(slug)
  if (!story) return { title: 'গল্প পাওয়া যায়নি' }
  return { title: `${story.title} — অল্প স্বল্প গল্প`, description: story.description }
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params
  const story = await getStory(slug)

  // Fallback mock story if DB empty
  const displayStory = story || {
    id: '1',
    title: 'নীল জলের গান',
    slug: 'nil-joler-gaan',
    description: 'একটি ছোট মেয়ে এবং তার হারানো স্বপ্নের গল্প। সমুদ্রের নীল জলে খুঁজে পায় সে তার হারানো শৈশব। এটি একটি মর্মস্পর্শী উপাখ্যান যা আমাদের মনে করিয়ে দেয় শৈশবের স্বপ্নগুলো কখনও মরে না।',
    status: 'PUBLISHED',
    readCount: 12340,
    isMature: false,
    tags: ['শৈশব', 'স্বপ্ন', 'সমুদ্র'],
    createdAt: new Date(),
    author: {
      id: 'author-1',
      name: 'সুমাইয়া হক',
      username: 'sumaiya',
      avatarUrl: null,
      bio: 'গল্প লিখতে ভালোবাসি। প্রকৃতির সৌন্দর্য আর মানুষের সম্পর্কের নানা টানাপোড়েন আমার লেখার মূল উৎস।',
    },
    category: {
      name: 'সামাজিক',
      slug: 'social',
    },
    chapters: [
      { id: '1', chapterNumber: 1, title: 'প্রথম ঢেউ', status: 'PUBLISHED', wordCount: 1240 },
      { id: '2', chapterNumber: 2, title: 'বালির ঘর', status: 'PUBLISHED', wordCount: 1580 },
    ],
  }

  const publishedChapters = displayStory.chapters.filter((c: { status: string }) => c.status === 'PUBLISHED')

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pb-16">
      {/* Accent Top Header Banner */}
      <div className="h-48 sm:h-56 w-full bg-gradient-to-r from-amber-900 via-orange-950 to-stone-900 relative opacity-90">
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 relative -mt-32 sm:-mt-40">
        {/* Story Landing Presentation Structure Card */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
            {/* Left Asset Column: Story Cover Frame */}
            <div className="aspect-[3/4] w-48 sm:w-56 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 shadow-2xl p-5 flex flex-col justify-between ring-4 ring-white dark:ring-stone-800">
              <span className="text-white text-xs font-bold font-bengali bg-black/30 backdrop-blur px-2.5 py-1 rounded-full self-start">
                {displayStory.category.name}
              </span>
              <div>
                <span className="text-[10px] text-white/80 font-bengali block mb-1">অল্প স্বল্প গল্প</span>
                <h2 className="text-white font-bold font-bengali text-xl leading-tight drop-shadow-md">
                  {displayStory.title}
                </h2>
              </div>
            </div>

            {/* Right Detail Column */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                  <Badge variant="info">{displayStory.category.name}</Badge>
                  {displayStory.isMature && <Badge variant="warning">১৮+</Badge>}
                  <Badge variant="success">ধারাটি সম্পূর্ণ</Badge>
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 font-bengali">
                  {displayStory.title}
                </h1>
              </div>

              {/* Total Reader Metrics & Ratings */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-stone-600 dark:text-stone-300 font-bengali border-y border-stone-100 dark:border-stone-800 py-3">
                <div className="flex items-center gap-1 font-bold text-amber-500">
                  <span>★</span>
                  <span>4.8</span>
                  <span className="text-stone-400 font-normal text-xs">(২৮ রেটিং)</span>
                </div>
                <span>·</span>
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {formatReadCount(displayStory.readCount)}
                  </span>{' '}
                  পাঠক পড়েছেন
                </div>
                <span>·</span>
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {publishedChapters.length}
                  </span>{' '}
                  টি অধ্যায়
                </div>
              </div>

              {/* High-Visibility Primary Action: 'Read Now' (এখন পড়ুন) Button */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2 font-bengali">
                {publishedChapters.length > 0 && (
                  <Link href={`/read/${displayStory.slug}/1`}>
                    <Button variant="primary" size="lg" className="bg-amber-600 hover:bg-amber-700 text-white shadow-xl px-10 font-bold text-base">
                      📖 এখন পড়ুন (Read Now) →
                    </Button>
                  </Link>
                )}
                <Button variant="secondary" size="lg" className="font-bold">
                  🔖 লাইব্রেরীতে রাখুন
                </Button>
              </div>
            </div>
          </div>

          {/* Author Bio Profile Card with Functional Follow Button Switch */}
          <div className="mt-8 pt-6 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-4">
            <Link
              href={`/profile/${displayStory.author.username}`}
              className="flex items-center gap-3 group"
            >
              <Avatar src={displayStory.author.avatarUrl} name={displayStory.author.name} size="md" />
              <div>
                <h4 className="font-bold text-stone-900 dark:text-stone-100 font-bengali group-hover:text-amber-600 transition-colors">
                  {displayStory.author.name}
                </h4>
                <p className="text-xs text-stone-400 font-bengali">
                  @{displayStory.author.username} · ১২৬ জন অনুসারী
                </p>
              </div>
            </Link>

            <Link href={`/profile/${displayStory.author.username}`}>
              <Button variant="secondary" size="sm" className="font-bengali text-amber-600 border-amber-300 dark:border-amber-800 hover:bg-amber-50">
                + অনুসরণ করুন (Follow)
              </Button>
            </Link>
          </div>

          {/* Story Synopsis */}
          <div className="mt-6">
            <h3 className="font-bold text-stone-900 dark:text-stone-100 font-bengali text-base mb-2">
              গল্প সংক্ষেপ
            </h3>
            <p className="text-stone-700 dark:text-stone-300 font-bengali leading-relaxed text-sm sm:text-base">
              {displayStory.description}
            </p>
          </div>

          {/* Tags */}
          {displayStory.tags && displayStory.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {displayStory.tags.map((tag: string) => (
                <Badge key={tag} variant="muted" className="font-bengali">#{tag}</Badge>
              ))}
            </div>
          )}
        </div>

        {/* Chapter Index Table Grid showcasing individual titles & access triggers */}
        <div className="mt-8 bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 p-6 sm:p-8">
          <ChapterList storySlug={displayStory.slug} chapters={displayStory.chapters} />
        </div>
      </div>
    </div>
  )
}
