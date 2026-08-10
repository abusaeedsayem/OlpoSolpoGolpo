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
        author: { select: { name: true, username: true, avatarUrl: true } },
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
  return { title: story.title, description: story.description }
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
      name: 'সুমাইয়া হক',
      username: 'sumaiya',
      avatarUrl: null,
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
      {/* Top Banner Background */}
      <div className="h-48 sm:h-56 w-full bg-gradient-to-r from-amber-900 via-orange-950 to-stone-900 relative opacity-90">
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 relative -mt-32 sm:-mt-40">
        {/* Story Header Card (Pratilipi Style input_file_3.png) */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
            {/* Story Cover */}
            <div className="aspect-[3/4] w-44 sm:w-52 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 shadow-2xl p-4 flex flex-col justify-between ring-4 ring-white dark:ring-stone-800">
              <span className="text-white text-xs font-bold font-bengali bg-black/30 backdrop-blur px-2.5 py-1 rounded-full self-start">
                {displayStory.category.name}
              </span>
              <h2 className="text-white font-bold font-bengali text-lg leading-tight drop-shadow-md">
                {displayStory.title}
              </h2>
            </div>

            {/* Story Information */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                  <Badge variant="info">{displayStory.category.name}</Badge>
                  {displayStory.isMature && <Badge variant="warning">১৮+</Badge>}
                  <Badge variant="success">ধারাটি সম্পন্ন</Badge>
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 font-bengali">
                  {displayStory.title}
                </h1>
              </div>

              {/* Rating & Stats Row (Pratilipi Style) */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-stone-600 dark:text-stone-300 font-bengali border-y border-stone-100 dark:border-stone-800 py-3">
                <div className="flex items-center gap-1 font-bold text-amber-500">
                  <span>★</span>
                  <span>4.8</span>
                  <span className="text-stone-400 font-normal text-xs">(৩০ রেটিং)</span>
                </div>
                <span>·</span>
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {formatReadCount(displayStory.readCount)}
                  </span>{' '}
                  পড়া
                </div>
                <span>·</span>
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {publishedChapters.length}
                  </span>{' '}
                  অধ্যায়
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                {publishedChapters.length > 0 && (
                  <Link href={`/read/${displayStory.slug}/1`}>
                    <Button variant="primary" size="lg" className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg px-8 font-bengali">
                      📖 পড়া শুরু করুন
                    </Button>
                  </Link>
                )}
                <Button variant="secondary" size="lg" className="font-bengali">
                  🔖 লাইব্রেরীতে রাখুন
                </Button>
                <Button variant="ghost" size="lg" className="font-bengali">
                  🔗 শেয়ার
                </Button>
              </div>
            </div>
          </div>

          {/* Author Row (Pratilipi Style input_file_3.png) */}
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
                <p className="text-xs text-stone-400 font-bengali">১৩৫ জন অনুসরণকারী</p>
              </div>
            </Link>

            <Button variant="secondary" size="sm" className="font-bengali text-amber-600 border-amber-300 dark:border-amber-800 hover:bg-amber-50">
              + অনুসরণ করুন
            </Button>
          </div>

          {/* Synopsis */}
          <div className="mt-6">
            <h3 className="font-bold text-stone-900 dark:text-stone-100 font-bengali text-base mb-2">
              গল্প সংক্ষেপ
            </h3>
            <p className="text-stone-700 dark:text-stone-300 font-bengali leading-relaxed text-sm sm:text-base">
              {displayStory.description}
            </p>
          </div>

          {/* Tags */}
          {displayStory.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {displayStory.tags.map((tag: string) => (
                <Badge key={tag} variant="muted">#{tag}</Badge>
              ))}
            </div>
          )}
        </div>

        {/* Chapters Section Grid (Pratilipi Style input_file_3.png) */}
        <div className="mt-8 bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6 border-b border-stone-100 dark:border-stone-800 pb-4">
            <h3 className="font-bold text-xl text-stone-900 dark:text-stone-100 font-bengali">
              সূচিপত্র ও অধ্যায়সমূহ ({publishedChapters.length})
            </h3>
            <span className="text-xs text-stone-400 font-bengali">সব অধ্যায় উন্মুক্ত</span>
          </div>

          <ChapterList storySlug={displayStory.slug} chapters={displayStory.chapters} />
        </div>
      </div>
    </div>
  )
}
