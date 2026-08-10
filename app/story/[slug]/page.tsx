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

  if (!story) notFound()

  const publishedChapters = story.chapters.filter((c: { status: string }) => c.status === 'PUBLISHED')

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Sidebar — Cover + Meta */}
        <aside className="lg:col-span-1">
          {/* Cover */}
          <div className="aspect-[3/4] w-full max-w-[260px] mx-auto lg:mx-0 rounded-xl overflow-hidden bg-gradient-to-br from-amber-400 to-orange-600 flex items-end p-4 shadow-xl shadow-amber-500/20">
            <p className="text-white font-bold font-bengali text-lg leading-tight">{story.title}</p>
          </div>

          {/* Quick stats */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-stone-50 dark:bg-stone-900 p-3 text-center">
              <div className="text-xl font-bold text-amber-600 font-bengali">{formatReadCount(story.readCount)}</div>
              <div className="text-xs text-stone-500 font-bengali mt-0.5">পাঠক</div>
            </div>
            <div className="rounded-lg bg-stone-50 dark:bg-stone-900 p-3 text-center">
              <div className="text-xl font-bold text-amber-600 font-bengali">{publishedChapters.length}</div>
              <div className="text-xs text-stone-500 font-bengali mt-0.5">অধ্যায়</div>
            </div>
          </div>

          {/* Read button */}
          {publishedChapters.length > 0 && (
            <Link href={`/read/${story.slug}/1`} className="mt-4 block">
              <Button variant="primary" size="lg" className="w-full">
                📖 পড়া শুরু করুন
              </Button>
            </Link>
          )}
        </aside>

        {/* Main content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Title & meta */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="info">{story.category.name}</Badge>
              {story.isMature && <Badge variant="warning">১৮+</Badge>}
              <Badge variant="success">প্রকাশিত</Badge>
            </div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 font-bengali leading-tight">
              {story.title}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-stone-500 font-bengali">
              <Avatar src={story.author.avatarUrl} name={story.author.name} size="sm" />
              <Link href={`/profile/${story.author.username}`} className="hover:text-amber-600 transition-colors">
                {story.author.name}
              </Link>
              <span>·</span>
              <span>{formatDate(story.createdAt)}</span>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl bg-stone-50 dark:bg-stone-900 p-5">
            <p className="text-stone-700 dark:text-stone-300 font-bengali leading-relaxed text-base">
              {story.description}
            </p>
          </div>

          {/* Tags */}
          {story.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {story.tags.map((tag: string) => (
                <Badge key={tag} variant="muted">#{tag}</Badge>
              ))}
            </div>
          )}

          {/* Chapter list */}
          <ChapterList storySlug={story.slug} chapters={story.chapters} />
        </div>
      </div>
    </div>
  )
}
