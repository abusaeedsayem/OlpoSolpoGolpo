import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { StoryCard } from '@/components/story/StoryCard'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params
  return {
    title: `${username} — প্রোফাইল`,
    description: `${username} এর প্রোফাইল ও গল্পসমূহ`,
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params

  let user: any = null
  try {
    user = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email: username }],
      },
      include: {
        stories: {
          where: { status: 'PUBLISHED' },
          include: {
            category: { select: { name: true } },
            _count: { select: { chapters: true } },
          },
        },
      },
    })
  } catch {
    user = null
  }

  // Fallback if user not in DB
  if (!user) {
    if (username === 'sumaiya' || username === 'sumaiya@example.com') {
      user = {
        id: '1',
        name: 'সুমাইয়া হক',
        username: 'sumaiya',
        role: 'AUTHOR',
        bio: 'গল্প লিখতে ভালোবাসি। প্রকৃতির সৌন্দর্য আর মানুষের সম্পর্কের নানা টানাপোড়েন আমার লেখার মূল উৎস।',
        avatarUrl: null,
        createdAt: new Date('2023-05-10'),
        stories: [
          {
            id: '1',
            title: 'নীল জলের গান',
            slug: 'nil-joler-gaan',
            description: 'একটি ছোট মেয়ে এবং তার হারানো স্বপ্নের গল্প।',
            coverUrl: null,
            readCount: 12340,
            tags: ['শৈশব', 'স্বপ্ন'],
            category: { name: 'সামাজিক' },
            _count: { chapters: 4 },
          },
        ],
      }
    } else {
      notFound()
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-stone-100 dark:border-stone-800 pb-8">
        <Avatar src={user.avatarUrl} name={user.name} size="xl" />
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-bengali">
              {user.name}
            </h1>
            <Badge variant={user.role === 'AUTHOR' ? 'default' : 'muted'}>
              {user.role === 'AUTHOR' ? '✍️ লেখক' : '📚 পাঠক'}
            </Badge>
          </div>
          <p className="text-xs text-stone-400 font-mono mt-1">@{user.username}</p>

          {user.bio && (
            <p className="mt-3 text-sm text-stone-600 dark:text-stone-300 font-bengali max-w-xl">
              {user.bio}
            </p>
          )}

          <p className="mt-3 text-xs text-stone-400 font-bengali">
            সদস্যপদ গ্রহণ: {formatDate(user.createdAt)}
          </p>
        </div>
      </div>

      {/* Stories by user */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-bengali mb-6">
          প্রকাশিত গল্পসমূহ ({user.stories?.length || 0})
        </h2>

        {user.stories && user.stories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {user.stories.map((story: any) => (
              <StoryCard
                key={story.id}
                id={story.id}
                title={story.title}
                slug={story.slug}
                description={story.description}
                coverUrl={story.coverUrl}
                authorName={user.name}
                authorUsername={user.username}
                categoryName={story.category.name}
                readCount={story.readCount}
                chapterCount={story._count.chapters}
                tags={story.tags}
              />
            ))}
          </div>
        ) : (
          <p className="text-stone-400 font-bengali text-sm py-8 text-center">
            এখনও কোনো গল্প প্রকাশ করা হয়নি।
          </p>
        )}
      </div>
    </div>
  )
}
