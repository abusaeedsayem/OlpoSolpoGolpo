'use client'

import { use, useState, useEffect } from 'react'
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
  const [storyTitle, setStoryTitle] = useState('গল্প সম্পাদন')
  const [storySlug, setStorySlug] = useState('')
  const [chapters, setChapters] = useState<any[]>([])

  useEffect(() => {
    // Fetch story chapters
    async function loadChapters() {
      try {
        const res = await fetch(`/api/stories/${id}/chapters`)
        if (res.ok) {
          const data = await res.json()
          if (data.chapters) {
            setChapters(data.chapters)
          }
        }
      } catch {
        // Fallback
      }
    }
    loadChapters()
  }, [id])

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
      return
    }

    // Refresh chapters list
    const updated = await fetch(`/api/stories/${id}/chapters`)
    if (updated.ok) {
      const updatedData = await updated.json()
      if (updatedData.chapters) setChapters(updatedData.chapters)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-bengali">
            {storyTitle}
          </h1>
          <p className="text-xs text-stone-400 font-mono mt-0.5">গল্প আইডি: {id}</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={activeTab === 'editor' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('editor')}
          >
            ✍️ অধ্যায় সম্পাদক
          </Button>
          <Button
            variant={activeTab === 'chapters' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('chapters')}
          >
            📋 সূচিপত্র ({chapters.length})
          </Button>
        </div>
      </div>

      {activeTab === 'editor' ? (
        <ChapterEditor
          storyId={id}
          chapterNumber={selectedChapterNumber}
          onSave={handleSaveChapter}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
            <div>
              <h2 className="font-bold text-stone-800 dark:text-stone-200 font-bengali">
                অধ্যায়ের তালিকা
              </h2>
              <p className="text-xs text-stone-500 font-bengali">
                মোট {chapters.length} টি অধ্যায় রয়েছে
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSelectedChapterNumber(chapters.length + 1)
                setActiveTab('editor')
              }}
            >
              + নতুন অধ্যায় যোগ করুন
            </Button>
          </div>

          <ChapterList
            storySlug={storySlug || id}
            chapters={
              chapters.length > 0
                ? chapters
                : [
                    { id: '1', chapterNumber: 1, title: 'প্রথম অধ্যায়', status: 'PUBLISHED', wordCount: 1240 },
                  ]
            }
          />
        </div>
      )}
    </div>
  )
}
