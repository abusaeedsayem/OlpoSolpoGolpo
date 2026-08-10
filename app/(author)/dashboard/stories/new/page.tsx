'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StoryForm } from '@/components/author/StoryForm'
import { ChapterEditor } from '@/components/author/ChapterEditor'
import { Button } from '@/components/ui/Button'

export default function NewStoryPage() {
  const router = useRouter()
  const [createdStory, setCreatedStory] = useState<{ id: string; title: string } | null>(null)

  const handleCreateStory = async (formData: {
    title: string
    description: string
    categoryId: string
    tags: string
    isMature: boolean
  }) => {
    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        alert(errorData.error || 'গল্প তৈরি করতে সমস্যা হয়েছে।')
        return
      }

      const data = await res.json()
      if (data.story) {
        setCreatedStory({ id: data.story.id, title: data.story.title })
      }
    } catch {
      alert('গল্প তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।')
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {!createdStory ? (
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-bengali">
                নতুন গল্প শুরু করুন
              </h1>
              <p className="text-sm text-stone-500 font-bengali mt-1">
                আপনার নতুন গল্পের প্রাথমিক তথ্য দিন। এরপর আপনি প্রথম অধ্যায় লেখা শুরু করবেন।
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-100 bg-white p-6 sm:p-8 shadow-sm dark:border-stone-800 dark:bg-stone-900">
            <StoryForm onSubmit={handleCreateStory} submitLabel="গল্প তৈরি করুন ও লিখতে শুরু করুন →" />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
            <div>
              <p className="text-xs text-amber-700 dark:text-amber-300 font-bengali font-semibold">
                ✓ গল্প সফলভাবে তৈরি করা হয়েছে!
              </p>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-bengali">
                {createdStory.title}
              </h2>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push('/dashboard')}
            >
              ড্যাশবোর্ডে ফিরুন
            </Button>
          </div>

          <ChapterEditor storyId={createdStory.id} chapterNumber={1} />
        </div>
      )}
    </div>
  )
}
