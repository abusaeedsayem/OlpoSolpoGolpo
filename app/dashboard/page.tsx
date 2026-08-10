import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AnalyticsCard } from '@/components/author/AnalyticsCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { STORY_STATUSES } from '@/lib/constants'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'লেখক ড্যাশবোর্ড' }

const statusVariant = {
  PUBLISHED: 'success',
  DRAFT: 'muted',
  ARCHIVED: 'warning',
} as const

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard')
  }

  const userId = session.user.id

  let stories: any[] = []
  try {
    stories = await prisma.story.findMany({
      where: { authorId: userId },
      include: {
        _count: { select: { chapters: true, bookmarks: true } },
      },
      orderBy: { updatedAt: 'desc' },
    })
  } catch {
    stories = []
  }

  const totalReads = stories.reduce((acc, s) => acc + s.readCount, 0)
  const totalBookmarks = stories.reduce((acc, s) => acc + (s._count?.bookmarks || 0), 0)
  const totalChapters = stories.reduce((acc, s) => acc + (s._count?.chapters || 0), 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-bengali">
            লেখক ড্যাশবোর্ড
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 font-bengali mt-1">
            স্বাগতম, {session.user.name || 'লেখক'}! আপনার গল্প ও পরিসংখ্যান
          </p>
        </div>
        <Link href="/dashboard/stories/new">
          <Button variant="primary">+ নতুন গল্প</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        <AnalyticsCard title="মোট পাঠক" value={totalReads} icon="👁️" trend="up" />
        <AnalyticsCard title="মোট বুকমার্ক" value={totalBookmarks} icon="🔖" trend="up" />
        <AnalyticsCard title="গল্প" value={stories.length} icon="📚" />
        <AnalyticsCard title="অধ্যায়" value={totalChapters} icon="📄" />
      </div>

      {/* Stories table */}
      <div className="rounded-xl border border-stone-100 dark:border-stone-800 overflow-hidden">
        <div className="border-b border-stone-100 dark:border-stone-800 px-5 py-4 bg-stone-50 dark:bg-stone-900 flex items-center justify-between">
          <h2 className="font-semibold text-stone-800 dark:text-stone-200 font-bengali">আমার গল্প</h2>
          <Link href="/dashboard/stories" className="text-sm text-amber-600 font-bengali">সব দেখুন</Link>
        </div>

        {stories.length > 0 ? (
          <div className="divide-y divide-stone-50 dark:divide-stone-800/50">
            {stories.map((story) => (
              <div key={story.id} className="flex items-center gap-4 px-5 py-4 hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-900 dark:text-stone-100 font-bengali truncate">
                    {story.title}
                  </p>
                  <p className="text-xs text-stone-400 font-bengali mt-0.5">
                    শেষ আপডেট: {formatDate(story.updatedAt)}
                  </p>
                </div>
                <Badge variant={statusVariant[story.status as keyof typeof statusVariant]}>
                  {STORY_STATUSES[story.status as keyof typeof STORY_STATUSES]}
                </Badge>
                <div className="text-sm text-stone-500 font-bengali hidden sm:block">
                  👁️ {story.readCount.toLocaleString('bn-BD')}
                </div>
                <div className="text-sm text-stone-500 font-bengali hidden sm:block">
                  📄 {story._count.chapters} অধ্যায়
                </div>
                <Link href={`/dashboard/stories/${story.id}/edit`}>
                  <Button variant="ghost" size="sm">সম্পাদনা</Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-stone-500 font-bengali">
            আপনার কোনো গল্প পাওয়া যায়নি।{' '}
            <Link href="/dashboard/stories/new" className="text-amber-600 font-medium">
              নতুন গল্প তৈরি করুন
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
