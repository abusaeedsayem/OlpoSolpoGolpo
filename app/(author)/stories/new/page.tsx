'use client'

import { useRouter } from 'next/navigation'
import { StoryForm } from '@/components/author/StoryForm'

export default function NewStoryPage() {
  const router = useRouter()

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
      alert(errorData.error || 'গল্প তৈরি করতে সমস্যা হয়েছে')
      return
    }

    const data = await res.json()
    router.push(`/dashboard/stories/${data.story.id}/edit`)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-bengali mb-2">
        নতুন গল্প শুরু করুন
      </h1>
      <p className="text-sm text-stone-500 font-bengali mb-6">
        আপনার নতুন গল্পের প্রাথমিক তথ্য দিন। পরবর্তীতে আপনি অধ্যায় যোগ করতে পারবেন।
      </p>

      <div className="rounded-xl border border-stone-100 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <StoryForm onSubmit={handleCreateStory} submitLabel="গল্প তৈরি করুন ও অধ্যায় লিখুন →" />
      </div>
    </div>
  )
}
