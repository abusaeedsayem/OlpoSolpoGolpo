'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface Chapter {
  id: string
  chapterNumber: number
  title: string
  status: 'DRAFT' | 'PUBLISHED'
  wordCount: number
  isLocked?: boolean
  createdAt?: string | Date
}

interface ChapterListProps {
  storySlug: string
  chapters: Chapter[]
  currentChapter?: number
}

export function ChapterList({ storySlug, chapters, currentChapter }: ChapterListProps) {
  const [lockedModalChapter, setLockedModalChapter] = useState<Chapter | null>(null)
  const published = chapters.filter((c) => c.status === 'PUBLISHED')
  const totalWords = published.reduce((sum, c) => sum + c.wordCount, 0)

  // Bengali numerals helper
  const toBengaliNumerals = (num: number): string => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
    return num.toString().replace(/\d/g, (digit) => bengaliDigits[parseInt(digit)])
  }

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-3 flex items-center justify-between">
        <h2 className="font-bold text-stone-800 dark:text-stone-200 font-bengali text-base sm:text-lg flex items-center gap-2">
          <span>📋</span> সূচিপত্র ও অধ্যায়সমূহ ({toBengaliNumerals(published.length)} টি অধ্যায়)
        </h2>
        <span className="text-xs text-stone-400 font-bengali bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full">
          মোট {toBengaliNumerals(totalWords)} শব্দ
        </span>
      </div>

      {/* Chapter Index Table Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {chapters.map((chapter) => {
          const isPublished = chapter.status === 'PUBLISHED'
          const isCurrent = chapter.chapterNumber === currentChapter
          const isLocked = chapter.isLocked || chapter.chapterNumber > 5 // Lock chapters > 5 for premium demonstration

          if (!isPublished) {
            return (
              <div
                key={chapter.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-dashed border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 opacity-60"
              >
                <div className="flex items-center gap-3">
                  <span className="h-7 w-7 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-500 font-bold text-xs flex items-center justify-center">
                    {toBengaliNumerals(chapter.chapterNumber)}
                  </span>
                  <span className="text-sm font-bengali text-stone-500">{chapter.title}</span>
                </div>
                <span className="text-xs text-stone-400 font-bengali">খসড়া</span>
              </div>
            )
          }

          if (isLocked) {
            return (
              <div
                key={chapter.id}
                onClick={() => setLockedModalChapter(chapter)}
                className="flex items-center justify-between p-3.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40 bg-gradient-to-r from-amber-50/40 to-orange-50/20 dark:from-amber-950/20 dark:to-stone-900 hover:border-amber-400 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="h-7 w-7 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center">
                    {toBengaliNumerals(chapter.chapterNumber)}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-stone-800 dark:text-stone-200 font-bengali group-hover:text-amber-600">
                      {chapter.title}
                    </p>
                    <p className="text-[11px] text-stone-400 font-bengali">
                      {toBengaliNumerals(chapter.wordCount)} শব্দ
                    </p>
                  </div>
                </div>

                {/* Gold Lock Icon */}
                <div className="flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                  <span>🔒</span>
                  <span className="text-[10px] font-bengali">প্রিমিয়াম</span>
                </div>
              </div>
            )
          }

          return (
            <Link
              key={chapter.id}
              href={`/read/${storySlug}/${chapter.chapterNumber}`}
              className={cn(
                'flex items-center justify-between p-3.5 rounded-xl border transition-all group',
                isCurrent
                  ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 shadow-sm'
                  : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-amber-400 hover:shadow-sm'
              )}
            >
              <div className="flex items-center gap-3">
                <span className="h-7 w-7 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  {toBengaliNumerals(chapter.chapterNumber)}
                </span>
                <div>
                  <p className="text-sm font-bold text-stone-900 dark:text-stone-100 font-bengali group-hover:text-amber-600 transition-colors">
                    {chapter.title}
                  </p>
                  <p className="text-[11px] text-stone-400 font-bengali">
                    {toBengaliNumerals(chapter.wordCount)} শব্দ
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isCurrent ? (
                  <Badge variant="warning" className="text-[10px] font-bengali">
                    পড়ছেন
                  </Badge>
                ) : (
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-bengali font-semibold group-hover:translate-x-0.5 transition-transform">
                    পড়ুন →
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Gold Lock Modal Triggered on Locked Chapter Click */}
      {lockedModalChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-md w-full p-6 border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4 text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 text-3xl flex items-center justify-center ring-4 ring-amber-50">
              🔒
            </div>

            <div>
              <h3 className="font-bold text-xl font-bengali text-stone-900 dark:text-stone-100">
                প্রিমিয়াম অধ্যায় উন্মুক্ত করুন
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 font-bengali mt-2 leading-relaxed">
                "{lockedModalChapter.title}" অধ্যায়টি পড়তে লেখকের সাথে যুক্ত হন অথবা অল্প স্বল্প গল্প সাবস্ক্রিপশন গ্রহণ করুন।
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2 font-bengali">
              <Link href="/login">
                <Button variant="primary" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold">
                  🔑 সাইন ইন / যোগ দিন →
                </Button>
              </Link>
              <Button variant="ghost" onClick={() => setLockedModalChapter(null)}>
                পরে চেষ্টা করব
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
