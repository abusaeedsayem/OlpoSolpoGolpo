'use client'

import { use, useState, useEffect } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { StoryCard } from '@/components/story/StoryCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

// Preset cover theme backgrounds
const COVER_PRESETS = [
  { name: 'গোধূলি আলো', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
  { name: 'নক্ষত্রময় আকাশ', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80' },
  { name: 'সবুজ বনানী', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80' },
  { name: 'নীল সমুদ্র', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=80' },
]

export default function ProfilePage({ params }: ProfilePageProps) {
  const { username } = use(params)
  const [activeTab, setActiveTab] = useState<'published' | 'library' | 'followers' | 'following'>('published')
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Editable Profile States
  const [bio, setBio] = useState('গল্প লিখতে ভালোবাসি। প্রকৃতির সৌন্দর্য আর মানুষের সম্পর্কের নানা টানাপোড়েন আমার লেখার মূল উৎস।')
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [tempBio, setTempBio] = useState('')

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [avatarInputUrl, setAvatarInputUrl] = useState('')

  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false)
  const [coverInputUrl, setCoverInputUrl] = useState('')

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function loadUserData() {
      try {
        const res = await fetch(`/api/profile/${username}`)
        if (res.ok) {
          const data = await res.json()
          if (data.user) {
            setUser(data.user)
            if (data.user.bio) setBio(data.user.bio)
            if (data.user.avatarUrl) setAvatarUrl(data.user.avatarUrl)
          }
        }
      } catch {
        // Fallback
      } finally {
        setIsLoading(false)
      }
    }
    loadUserData()
  }, [username])

  // Save profile updates to backend API & state
  const handleSaveProfileUpdate = async (updates: { bio?: string; avatarUrl?: string; coverUrl?: string }) => {
    setIsSaving(true)
    try {
      await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updates, username }),
      })
    } catch {
      // Ignore network errors in fallback mode
    } finally {
      setIsSaving(false)
    }
  }

  // Handle Bio Save
  const handleSaveBio = () => {
    setBio(tempBio)
    setIsEditingBio(false)
    handleSaveProfileUpdate({ bio: tempBio })
  }

  // Handle Avatar Save
  const handleSaveAvatar = (newUrl: string) => {
    setAvatarUrl(newUrl)
    setIsAvatarModalOpen(false)
    handleSaveProfileUpdate({ avatarUrl: newUrl })
  }

  // Handle Cover Save
  const handleSaveCover = (newUrl: string) => {
    setCoverUrl(newUrl)
    setIsCoverModalOpen(false)
    handleSaveProfileUpdate({ coverUrl: newUrl })
  }

  // Display user mock object
  const displayUser = user || {
    name: username === 'sumaiya' ? 'সুমাইয়া হক' : username === 'abusaeedsayem' ? 'Abu Saeed Sayem' : username,
    username: username,
    role: 'AUTHOR',
    bio: bio,
    avatarUrl: avatarUrl,
    readCount: 1240,
    followersCount: 125,
    followingCount: 42,
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
      {/* Pratilipi Style Hero Cover Banner */}
      <div
        className="relative h-48 sm:h-64 w-full bg-cover bg-center transition-all duration-300 overflow-hidden"
        style={{
          backgroundImage: coverUrl
            ? `url(${coverUrl})`
            : 'linear-gradient(to right, #374151, #1f2937, #451a03)',
        }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

        {/* Banner Edit Buttons (Top Right) */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            type="button"
            onClick={() => setIsCoverModalOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-stone-900/80 px-3 py-1.5 text-xs text-white hover:bg-stone-900 backdrop-blur border border-white/20 transition-all shadow-md font-bengali"
            title="কভার ছবি সেট বা পরিবর্তন করুন"
          >
            <span>📷</span>
            <span className="hidden sm:inline">কভার ছবি পরিবর্তন</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const url = prompt('কভার ছবির URL প্রবেশ করান:')
              if (url) handleSaveCover(url)
            }}
            className="flex items-center gap-1.5 rounded-full bg-stone-900/80 p-2 text-xs text-white hover:bg-stone-900 backdrop-blur border border-white/20 transition-all shadow-md"
            title="কভার ছবির URL লিংক দিন"
          >
            <span>🔗</span>
          </button>
        </div>
      </div>

      {/* Profile Info Header */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative -mt-16 sm:-mt-20 mb-6 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
          {/* Overlapping Avatar with Edit Camera Button */}
          <div className="relative group">
            <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full ring-4 ring-white dark:ring-stone-950 overflow-hidden shadow-xl bg-amber-600 flex items-center justify-center text-white text-3xl font-bold font-bengali">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayUser.name} className="h-full w-full object-cover" />
              ) : (
                displayUser.name.slice(0, 2).toUpperCase()
              )}
            </div>

            {/* Profile Picture Camera Edit Button */}
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              className="absolute bottom-1 right-1 rounded-full bg-amber-600 hover:bg-amber-700 text-white p-2.5 shadow-lg ring-2 ring-white dark:ring-stone-900 transition-transform transform hover:scale-110"
              title="প্রোফাইল ছবি যুক্ত বা পরিবর্তন করুন"
            >
              📷
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsCoverModalOpen(true)}
              className="font-bengali"
            >
              ⚙️ প্রোফাইল কাস্টমাইজ
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

          {/* Writer Intro / Bio Section (Always Editable) */}
          <div className="pt-2 max-w-2xl bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
            <div className="flex items-center justify-between gap-2 text-sm font-bold text-stone-800 dark:text-stone-200 font-bengali pb-2 border-b border-stone-100 dark:border-stone-800">
              <span className="flex items-center gap-1.5">
                <span>✍️</span> লেখক পরিচিতি (Bio)
              </span>
              {!isEditingBio && (
                <button
                  type="button"
                  onClick={() => {
                    setTempBio(bio)
                    setIsEditingBio(true)
                  }}
                  className="text-amber-600 hover:text-amber-700 text-xs font-semibold flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800"
                >
                  <span>✏️</span> পরিচিতি সম্পাদনা করুন
                </button>
              )}
            </div>

            {isEditingBio ? (
              <div className="mt-3 space-y-3">
                <textarea
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  rows={3}
                  placeholder="আপনার সম্পর্কে লিখুন..."
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 font-bengali text-sm text-stone-900 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingBio(false)}
                    className="font-bengali"
                  >
                    বাতিল
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveBio}
                    isLoading={isSaving}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bengali"
                  >
                    ✓ সংরক্ষণ করুন
                  </Button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-300 font-bengali leading-relaxed">
                {bio || 'এখনও কোনো পরিচিতি লেখা হয়নি। সম্পাদনা বাটনে ক্লিক করে নিজের সম্পর্কে লিখুন।'}
              </p>
            )}
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
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

      {/* Cover Picture Customization Modal */}
      {isCoverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-lg w-full p-6 border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 dark:border-stone-800 pb-3">
              <h3 className="font-bold text-lg font-bengali text-stone-900 dark:text-stone-100">
                📷 প্রোফাইল কভার ছবি পরিবর্তন করুন
              </h3>
              <button
                onClick={() => setIsCoverModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-lg"
              >
                ✕
              </button>
            </div>

            <Input
              id="cover-url-input"
              label="কভার ছবির URL দিন"
              placeholder="https://example.com/banner.jpg"
              value={coverInputUrl}
              onChange={(e) => setCoverInputUrl(e.target.value)}
            />

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 font-bengali mb-2">
                অথবা প্রস্তুতকৃত থিম বেছে নিন:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {COVER_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSaveCover(preset.url)}
                    className="relative h-16 rounded-xl overflow-hidden border border-stone-200 hover:ring-2 hover:ring-amber-500 group transition-all"
                  >
                    <img src={preset.url} alt={preset.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold font-bengali">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
              <Button variant="ghost" onClick={() => setIsCoverModalOpen(false)}>
                বাতিল
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (coverInputUrl.trim()) handleSaveCover(coverInputUrl.trim())
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bengali"
              >
                সংরক্ষণ করুন
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Picture Customization Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-md w-full p-6 border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 dark:border-stone-800 pb-3">
              <h3 className="font-bold text-lg font-bengali text-stone-900 dark:text-stone-100">
                🖼️ প্রোফাইল ছবি (Avatar) পরিবর্তন করুন
              </h3>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-lg"
              >
                ✕
              </button>
            </div>

            <Input
              id="avatar-url-input"
              label="প্রোফাইল ছবির URL দিন"
              placeholder="https://example.com/avatar.jpg"
              value={avatarInputUrl}
              onChange={(e) => setAvatarInputUrl(e.target.value)}
            />

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 font-bengali mb-2">
                অথবা ইলুস্ট্রেশন অ্যাভাটার বেছে নিন:
              </label>
              <div className="flex justify-center gap-3">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
                ].map((sampleUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSaveAvatar(sampleUrl)}
                    className="h-14 w-14 rounded-full overflow-hidden border-2 border-stone-200 hover:border-amber-500 hover:scale-105 transition-all"
                  >
                    <img src={sampleUrl} alt="sample" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
              <Button variant="ghost" onClick={() => setIsAvatarModalOpen(false)}>
                বাতিল
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (avatarInputUrl.trim()) handleSaveAvatar(avatarInputUrl.trim())
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bengali"
              >
                সংরক্ষণ করুন
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
