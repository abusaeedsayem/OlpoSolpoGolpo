import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ReadingProgress } from '@/components/story/ReadingProgress'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { ReaderFooterHub } from '@/components/story/ReaderFooterHub'
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

    const currentChapter = story.chapters.find((c: { chapterNumber: number; status: string }) => c.chapterNumber === chapterNumber)
    if (!currentChapter || currentChapter.status !== 'PUBLISHED') return null

    const publishedChapters = story.chapters.filter((c: { status: string }) => c.status === 'PUBLISHED')

    return {
      storyId: story.id,
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
          className="prose-reading text-[--color-text] font-reading text-lg leading-[1.9] space-y-5 text-justify"
          style={{ fontFamily: 'var(--font-noto-serif-bengali), serif' }}
        >
          {data.content.split('\n\n').map((para: string, i: number) => (
            <p key={i} className="font-bengali">
              {para}
            </p>
          ))}
        </div>

        {/* Footer Interaction Hub (5-Star rating, Operational review input, Next chapter CTA) */}
        <ReaderFooterHub
          storyId={data.storyId}
          storySlug={data.storySlug}
          chapterNum={data.chapterNumber}
          totalChapters={data.totalChapters}
        />
      </article>

      <div className="py-8 text-center text-xs text-stone-300 dark:text-stone-700 font-bengali">
        {SITE_NAME} — বিজ্ঞাপনমুক্ত পাঠ অভিজ্ঞতা
      </div>
    </div>
  )
}
