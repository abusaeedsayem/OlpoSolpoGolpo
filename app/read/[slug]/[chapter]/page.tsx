import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ReadingProgress } from '@/components/story/ReadingProgress'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { SITE_NAME } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

interface ReadPageProps {
  params: Promise<{ slug: string; chapter: string }>
}

async function getChapterData(slug: string, chapterNumber: number) {
  try {
    const story = await prisma.story.findUnique({
      where: { slug },
      include: {
        author: { select: { name: true } },
        chapters: {
          orderBy: { chapterNumber: 'asc' },
          select: { id: true, chapterNumber: true, title: true, content: true, status: true },
        },
      },
    })

    if (!story) return null

    const currentChapter = story.chapters.find((c) => c.chapterNumber === chapterNumber)
    if (!currentChapter || currentChapter.status !== 'PUBLISHED') return null

    const publishedChapters = story.chapters.filter((c) => c.status === 'PUBLISHED')

    return {
      storyTitle: story.title,
      storySlug: story.slug,
      chapterNumber: currentChapter.chapterNumber,
      totalChapters: publishedChapters.length,
      title: currentChapter.title,
      content: currentChapter.content,
      authorName: story.author.name,
    }
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: ReadPageProps): Promise<Metadata> {
  const { slug, chapter } = await params
  const data = await getChapterData(slug, parseInt(chapter))
  if (!data) return { title: 'অধ্যায় পাওয়া যায়নি' }
  return {
    title: `${data.title} — ${data.storyTitle}`,
    description: `${data.storyTitle} - অধ্যায় ${data.chapterNumber}`,
  }
}

export default async function ReadPage({ params }: ReadPageProps) {
  const { slug, chapter: chapterStr } = await params
  const chapterNum = parseInt(chapterStr)
  const data = await getChapterData(slug, chapterNum)

  if (!data) notFound()

  return (
    <div data-reading className="min-h-screen bg-[--color-bg]">
      <ReadingProgress />

      {/* Reader toolbar */}
      <div className="sticky top-0 z-40 border-b border-stone-100 bg-[--color-bg]/90 backdrop-blur dark:border-stone-800 py-3">
        <div className="mx-auto max-w-3xl px-4 flex items-center justify-between">
          <Link
            href={`/story/${slug}`}
            className="flex items-center gap-2 text-sm text-stone-500 hover:text-amber-600 transition-colors font-bengali"
          >
            ← {data.storyTitle}
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* Chapter content */}
      <article className="mx-auto max-w-2xl px-4 py-12">
        {/* Chapter meta */}
        <header className="mb-10 text-center">
          <p className="text-sm text-stone-400 font-bengali mb-2">
            অধ্যায় {data.chapterNumber} / {data.totalChapters}
          </p>
          <h1 className="text-3xl font-bold text-[--color-text] font-bengali leading-tight">
            {data.title}
          </h1>
          <p className="mt-2 text-sm text-stone-500 font-bengali">{data.authorName}</p>
          <div className="mt-6 mx-auto h-px w-16 bg-amber-400" />
        </header>

        {/* Prose content */}
        <div
          className="prose-reading text-[--color-text] font-reading text-lg leading-[1.9] space-y-5"
          style={{ fontFamily: 'var(--font-noto-serif-bengali), serif' }}
        >
          {data.content.split('\n\n').map((para, i) => (
            <p key={i} className="font-bengali">
              {para}
            </p>
          ))}
        </div>

        {/* Chapter navigation */}
        <nav className="mt-16 flex items-center justify-between border-t border-stone-100 dark:border-stone-800 pt-8">
          {chapterNum > 1 ? (
            <Link
              href={`/read/${slug}/${chapterNum - 1}`}
              className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors font-bengali"
            >
              ← আগের অধ্যায়
            </Link>
          ) : (
            <div />
          )}
          <Link
            href={`/story/${slug}`}
            className="text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 font-bengali"
          >
            সূচিপত্র
          </Link>
          {chapterNum < data.totalChapters ? (
            <Link
              href={`/read/${slug}/${chapterNum + 1}`}
              className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors font-bengali"
            >
              পরের অধ্যায় →
            </Link>
          ) : (
            <div className="text-sm text-stone-400 font-bengali">শেষ অধ্যায়</div>
          )}
        </nav>
      </article>

      <div className="py-8 text-center text-xs text-stone-300 dark:text-stone-700 font-bengali">
        {SITE_NAME} — বিজ্ঞাপনমুক্ত পাঠ অভিজ্ঞতা
      </div>
    </div>
  )
}
