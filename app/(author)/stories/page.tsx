import type { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { STORY_STATUSES } from '@/lib/constants'

export const metadata: Metadata = { title: 'আমার সকল গল্প' }

const MOCK_STORIES = [
  { id: '1', title: 'নীল জলের গান', status: 'PUBLISHED' as const, readCount: 12340, chapterCount: 4, updatedAt: '২০২৪ জানুয়ারি ১৫' },
  { id: '2', title: 'রাতের শহরে', status: 'DRAFT' as const, readCount: 0, chapterCount: 2, updatedAt: '২০২৪ জানুয়ারি ১০' },
]

const statusVariant = {
  PUBLISHED: 'success',
  DRAFT: 'muted',
  ARCHIVED: 'warning',
} as const

export default function MyStoriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-bengali">
            আমার গল্পসমূহ
          </h1>
          <p className="text-sm text-stone-500 font-bengali mt-1">
            আপনার লিখিত সকল ছোটগল্প ও উপন্যাসিকা
          </p>
        </div>
        <Link href="/dashboard/stories/new">
          <Button variant="primary">+ নতুন গল্প</Button>
        </Link>
      </div>

      <div className="rounded-xl border border-stone-100 dark:border-stone-800 overflow-hidden">
        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {MOCK_STORIES.map((story) => (
            <div key={story.id} className="flex items-center gap-4 px-6 py-4 hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-stone-900 dark:text-stone-100 font-bengali text-base truncate">
                  {story.title}
                </h3>
                <p className="text-xs text-stone-400 font-bengali mt-0.5">
                  শেষ আপডেট: {story.updatedAt}
                </p>
              </div>
              <Badge variant={statusVariant[story.status]}>
                {STORY_STATUSES[story.status]}
              </Badge>
              <div className="text-sm text-stone-500 font-bengali hidden sm:block">
                👁️ {story.readCount.toLocaleString('bn-BD')} পাঠক
              </div>
              <div className="text-sm text-stone-500 font-bengali hidden sm:block">
                📄 {story.chapterCount} অধ্যায়
              </div>
              <Link href={`/dashboard/stories/${story.id}/edit`}>
                <Button variant="secondary" size="sm">সম্পাদনা</Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
