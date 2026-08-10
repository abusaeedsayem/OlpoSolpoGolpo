import type { Metadata } from 'next'
import Link from 'next/link'
import { AnalyticsCard } from '@/components/author/AnalyticsCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { STORY_STATUSES } from '@/lib/constants'

export const metadata: Metadata = { title: 'লেখক ড্যাশবোর্ড' }

// Mock — replace with Prisma + session
const MOCK_STATS = { totalReads: 45230, totalBookmarks: 1240, totalStories: 6, totalChapters: 48 }
const MOCK_STORIES = [
  { id: '1', title: 'নীল জলের গান', status: 'PUBLISHED' as const, readCount: 12340, chapterCount: 4, updatedAt: '২০২৪ জানুয়ারি ১৫' },
  { id: '2', title: 'রাতের শহরে', status: 'DRAFT' as const, readCount: 0, chapterCount: 2, updatedAt: '২০২৪ জানুয়ারি ১০' },
]

const statusVariant = {
  PUBLISHED: 'success',
  DRAFT: 'muted',
  ARCHIVED: 'warning',
} as const

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-bengali">
            লেখক ড্যাশবোর্ড
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 font-bengali mt-1">
            আপনার গল্প ও পরিসংখ্যান
          </p>
        </div>
        <Link href="/dashboard/stories/new">
          <Button variant="primary">+ নতুন গল্প</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        <AnalyticsCard title="মোট পাঠক" value={MOCK_STATS.totalReads} icon="👁️" trend="up" />
        <AnalyticsCard title="মোট বুকমার্ক" value={MOCK_STATS.totalBookmarks} icon="🔖" trend="up" />
        <AnalyticsCard title="গল্প" value={MOCK_STATS.totalStories} icon="📚" />
        <AnalyticsCard title="অধ্যায়" value={MOCK_STATS.totalChapters} icon="📄" />
      </div>

      {/* Stories table */}
      <div className="rounded-xl border border-stone-100 dark:border-stone-800 overflow-hidden">
        <div className="border-b border-stone-100 dark:border-stone-800 px-5 py-4 bg-stone-50 dark:bg-stone-900 flex items-center justify-between">
          <h2 className="font-semibold text-stone-800 dark:text-stone-200 font-bengali">আমার গল্প</h2>
          <Link href="/dashboard/stories" className="text-sm text-amber-600 font-bengali">সব দেখুন</Link>
        </div>
        <div className="divide-y divide-stone-50 dark:divide-stone-800/50">
          {MOCK_STORIES.map((story) => (
            <div key={story.id} className="flex items-center gap-4 px-5 py-4 hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-900 dark:text-stone-100 font-bengali truncate">
                  {story.title}
                </p>
                <p className="text-xs text-stone-400 font-bengali mt-0.5">
                  শেষ আপডেট: {story.updatedAt}
                </p>
              </div>
              <Badge variant={statusVariant[story.status]}>
                {STORY_STATUSES[story.status]}
              </Badge>
              <div className="text-sm text-stone-500 font-bengali hidden sm:block">
                👁️ {story.readCount.toLocaleString('bn-BD')}
              </div>
              <div className="text-sm text-stone-500 font-bengali hidden sm:block">
                📄 {story.chapterCount} অধ্যায়
              </div>
              <Link href={`/dashboard/stories/${story.id}/edit`}>
                <Button variant="ghost" size="sm">সম্পাদনা</Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
