'use client'

import { use, useState, useEffect } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { StoryCard } from '@/components/story/StoryCard'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { username } = use(params)
  const [activeTab, setActiveTab] = useState<'published' | 'library' | 'followers' | 'following'>('published')
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadUserData() {
      try {
        const res = await fetch(`/api/profile/${username}`)
        if (res.ok) {
          const data = await res.json()
          if (data.user) setUser(data.user)
        }
      } catch {
        // Fallback mock
      } finally {
        setIsLoading(false)
      }
    }
    loadUserData()
  }, [username])

  // Mock display user if loading or not in DB
  const displayUser = user || {
    name: username === 'sumaiya' ? 'সুমাইয়া হক' : username === 'abusaeedsayem' ? 'Abu Saeed Sayem' : username,
    username: username,
    role: 'AUTHOR',
    bio: 'গল্প লিখতে ভালোবাসি। প্রকৃতির সৌন্দর্য আর মানুষের সম্পর্কের নানা টানাপোড়েন আমার লেখার মূল উৎস।',
    avatarUrl: null,
    readCount: 1240,
    followersCount: 125,
    followingCount: 42,
    createdAt: new Date('2023-05-10'),
    stories: [
      {
        id: '1',
        title: 'নীল জলের গান',
        slug: 'nil-joler-gaan',
        description: 'একটি ছোট মেয়ে এবং তার হারানো স্বপ্নের গল্প। সমুদ্রের নীল জলে খুঁজে পায় সে তার হারানো শৈশব।',
        coverUrl: null,
        readCount: 12340,
        tags: ['শৈশব', 'স্বপ্ন'],
        categoryName: 'সামাজিক',
        chapterCount: 4,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pb-16">
      {/* Pratilipi Style Hero Cover Banner (input_file_2.png) */}
      <div className="relative h-48 sm:h-64 w-full bg-gradient-to-r from-stone-700 via-stone-800 to-amber-950 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            type="button"
            className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 backdrop-blur transition-colors"
            title="কভার কাস্টমাইজ করুন"
          >
            📷
          </button>
          <button
            type="button"
            className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 backdrop-blur transition-colors"
            title="শেয়ার করুন"
          >
            🔗
          </button>
        </div>
      </div>

      {/* Profile Info Header */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative -mt-16 sm:-mt-20 mb-6 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
          {/* Overlapping Avatar */}
          <div className="relative group">
            <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full ring-4 ring-white dark:ring-stone-950 overflow-hidden shadow-xl bg-amber-600 flex items-center justify-center text-white text-3xl font-bold font-bengali">
              {displayUser.avatarUrl ? (
                <img src={displayUser.avatarUrl} alt={displayUser.name} className="h-full w-full object-cover" />
              ) : (
                displayUser.name.slice(0, 2).toUpperCase()
              )}
            </div>
            <button
              type="button"
              className="absolute bottom-1 right-1 rounded-full bg-stone-900/80 p-2 text-white text-xs hover:bg-stone-900 transition-colors shadow"
              title="ছবি পরিবর্তন"
            >
              📷
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm">
              ⚙️ প্রোফাইল সেটিংস
            </Button>
            <Button variant="primary" size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-bengali">
              + অনুসরণ করুন
            </Button>
          </div>
        </div>

        {/* User Identity & Stats */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 font-bengali">
              {displayUser.name}
            </h1>
            <Badge variant={displayUser.role === 'AUTHOR' ? 'default' : 'muted'}>
              {displayUser.role === 'AUTHOR' ? '✍️ লেখক' : '📚 পাঠক'}
            </Badge>
          </div>

          <p className="text-xs text-stone-400 font-mono">@{displayUser.username}</p>

          <p className="text-xs text-stone-500 font-bengali">
            {displayUser.followersCount || 0} জন পঠিত / অনুসরণকারী
          </p>

          {/* Author Bio Section (input_file_2.png) */}
          <div className="pt-2">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-bold text-stone-800 dark:text-stone-200 font-bengali">
              <span>লেখক পরিচিতি</span>
              <button type="button" className="text-amber-600 hover:text-amber-700 text-xs">
                ✏️
              </button>
            </div>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300 font-bengali max-w-2xl leading-relaxed">
              {displayUser.bio || 'এখনও কোনো পরিচিতি লেখা হয়নি।'}
            </p>
          </div>
        </div>

        {/* Pratilipi Style Sub-Navigation Tabs (input_file_2.png) */}
        <div className="mt-8 border-b border-stone-200 dark:border-stone-800 flex gap-6 overflow-x-auto scrollbar-none font-bengali text-sm">
          <button
            type="button"
            onClick={() => setActiveTab('published')}
            className={`pb-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'published'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            প্রকাশিত ({displayUser.stories?.length || 0})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`pb-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'library'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            লাইব্রেরী (০)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('followers')}
            className={`pb-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'followers'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            অনুসরণকারী ({displayUser.followersCount || 0})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('following')}
            className={`pb-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'following'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            অনুসরণ করছে ({displayUser.followingCount || 0})
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="mt-8">
          {activeTab === 'published' && (
            <div>
              {displayUser.stories && displayUser.stories.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {displayUser.stories.map((story: any) => (
                    <StoryCard
                      key={story.id}
                      id={story.id}
                      title={story.title}
                      slug={story.slug}
                      description={story.description}
                      coverUrl={story.coverUrl}
                      authorName={displayUser.name}
                      authorUsername={displayUser.username}
                      categoryName={story.categoryName || 'সামাজিক'}
                      readCount={story.readCount}
                      chapterCount={story.chapterCount || 1}
                      tags={story.tags}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-stone-400 font-bengali bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                  এখনও কোনো গল্প প্রকাশ করা হয়নি।
                </div>
              )}
            </div>
          )}

          {activeTab === 'library' && (
            <div className="py-12 text-center text-stone-400 font-bengali bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
              খালি লাইব্রেরী (কোনো সংরক্ষিত গল্প নেই)
            </div>
          )}

          {activeTab === 'followers' && (
            <div className="py-12 text-center text-stone-400 font-bengali bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
              {displayUser.followersCount || 0} জন সদস্য আপনাকে অনুসরণ করছেন।
            </div>
          )}

          {activeTab === 'following' && (
            <div className="py-12 text-center text-stone-400 font-bengali bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
              {displayUser.followingCount || 0} জন লেখককে আপনি অনুসরণ করছেন।
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
