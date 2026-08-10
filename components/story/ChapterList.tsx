import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface Chapter {
  id: string
  chapterNumber: number
  title: string
  status: 'DRAFT' | 'PUBLISHED'
  wordCount: number
}

interface ChapterListProps {
  storySlug: string
  chapters: Chapter[]
  currentChapter?: number
}

export function ChapterList({ storySlug, chapters, currentChapter }: ChapterListProps) {
  const published = chapters.filter((c) => c.status === 'PUBLISHED')
  const totalWords = published.reduce((sum, c) => sum + c.wordCount, 0)

  return (
    <div className="rounded-xl border border-stone-100 dark:border-stone-800 overflow-hidden">
      {/* Header */}
      <div className="border-b border-stone-100 dark:border-stone-800 px-4 py-3 bg-stone-50 dark:bg-stone-900 flex items-center justify-between">
        <h2 className="font-semibold text-stone-800 dark:text-stone-200 font-bengali text-sm">
          সূচিপত্র ({published.length} অধ্যায়)
        </h2>
        <span className="text-xs text-stone-400 font-bengali">
          মোট {totalWords.toLocaleString('bn-BD')} শব্দ
        </span>
      </div>

      {/* Chapter items */}
      <ol className="divide-y divide-stone-50 dark:divide-stone-800/50">
        {chapters.map((chapter) => {
          const isPublished = chapter.status === 'PUBLISHED'
          const isCurrent = chapter.chapterNumber === currentChapter

          return (
            <li key={chapter.id}>
              {isPublished ? (
                <Link
                  href={`/read/${storySlug}/${chapter.chapterNumber}`}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 transition-colors',
                    isCurrent
                      ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                      : 'hover:bg-stone-50 dark:hover:bg-stone-800/50 text-stone-700 dark:text-stone-300'
                  )}
                >
                  <span className="flex-shrink-0 text-xs font-mono text-stone-400 w-6 text-center">
                    {chapter.chapterNumber}
                  </span>
                  <span className="flex-1 text-sm font-bengali leading-tight line-clamp-1">
                    {chapter.title}
                  </span>
                  <span className="text-xs text-stone-400">
                    {chapter.wordCount.toLocaleString('bn-BD')} শব্দ
                  </span>
                  {isCurrent && (
                    <Badge variant="warning" className="text-xs">পড়ছেন</Badge>
                  )}
                </Link>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 opacity-50 cursor-not-allowed">
                  <span className="flex-shrink-0 text-xs font-mono text-stone-400 w-6 text-center">
                    {chapter.chapterNumber}
                  </span>
                  <span className="flex-1 text-sm font-bengali line-clamp-1 text-stone-500">
                    {chapter.title}
                  </span>
                  <span className="text-xs text-stone-400">🔒 শীঘ্রই</span>
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
