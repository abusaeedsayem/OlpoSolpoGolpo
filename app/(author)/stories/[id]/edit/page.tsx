'use client'

import { use, useState } from 'react'
import { ChapterEditor } from '@/components/author/ChapterEditor'
import { ChapterList } from '@/components/story/ChapterList'
import { Button } from '@/components/ui/Button'

interface EditStoryPageProps {
  params: Promise<{ id: string }>
}

export default function EditStoryPage({ params }: EditStoryPageProps) {
  const { id } = use(params)
  const [activeTab, setActiveTab] = useState<'editor' | 'chapters'>('editor')
  const [selectedChapterNumber, setSelectedChapterNumber] = useState<number>(1)

  const handleSaveChapter = async (data: {
    title: string
    content: string
    status: 'DRAFT' | 'PUBLISHED'
  }) => {
    const res = await fetch(`/api/stories/${id}/chapters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      alert('অধ্যায় সংরক্ষণ করতে সমস্যা হয়েছে।')
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between mb-6 border-b border-stone-100 dark:border-stone-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-bengali">
            গল্প সম্পাদনা ও অধ্যায় লিখন
          </h1>
          <p className="text-xs text-stone-400 font-mono mt-0.5">গল্প আইডি: {id}</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={activeTab === 'editor' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('editor')}
          >
            ✍️ সম্পাদক
          </Button>
          <Button
            variant={activeTab === 'chapters' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('chapters')}
          >
            📋 সূচিপত্র
          </Button>
        </div>
      </div>

      {activeTab === 'editor' ? (
        <div className="rounded-xl border border-stone-100 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <ChapterEditor
            storyId={id}
            chapterNumber={selectedChapterNumber}
            onSave={handleSaveChapter}
          />
        </div>
      ) : (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="font-semibold text-stone-800 dark:text-stone-200 font-bengali">
              অধ্যায়ের তালিকা
            </h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSelectedChapterNumber((prev) => prev + 1)
                setActiveTab('editor')
              }}
            >
              + নতুন অধ্যায় যোগ করুন
            </Button>
          </div>
          <ChapterList
            storySlug="nil-joler-gaan"
            chapters={[
              { id: '1', chapterNumber: 1, title: 'প্রথম ঢেউ', status: 'PUBLISHED', wordCount: 1240 },
              { id: '2', chapterNumber: 2, title: 'বালির ঘর', status: 'DRAFT', wordCount: 850 },
            ]}
          />
        </div>
      )}
    </div>
  )
}
