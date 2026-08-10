'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { CATEGORIES } from '@/lib/constants'

interface StoryFormData {
  title: string
  description: string
  categoryId: string
  tags: string
  isMature: boolean
}

interface StoryFormProps {
  initialData?: Partial<StoryFormData>
  onSubmit: (data: StoryFormData) => Promise<void>
  submitLabel?: string
}

export function StoryForm({
  initialData,
  onSubmit,
  submitLabel = 'গল্প তৈরি করুন',
}: StoryFormProps) {
  const [form, setForm] = useState<StoryFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    categoryId: initialData?.categoryId || '',
    tags: initialData?.tags || '',
    isMature: initialData?.isMature || false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<StoryFormData>>({})

  const validate = () => {
    const e: Partial<Record<keyof StoryFormData, string>> = {}
    if (!form.title.trim()) e.title = 'শিরোনাম দিন'
    if (!form.description.trim()) e.description = 'সংক্ষিপ্ত বিবরণ দিন'
    if (!form.categoryId) e.categoryId = 'বিভাগ বেছে নিন'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs as Partial<StoryFormData>)
      return
    }
    setIsLoading(true)
    try {
      await onSubmit(form)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        id="title"
        label="গল্পের শিরোনাম *"
        placeholder="আপনার গল্পের নাম লিখুন…"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        error={errors.title}
      />

      <Textarea
        id="description"
        label="সংক্ষিপ্ত বিবরণ *"
        placeholder="পাঠকদের কাছে আপনার গল্পটি কী নিয়ে তা বলুন…"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        error={errors.description}
        showWordCount
        rows={4}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-stone-700 dark:text-stone-300 font-bengali">
          বিভাগ *
        </label>
        <select
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className="rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-stone-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 font-bengali text-base"
        >
          <option value="">বিভাগ বেছে নিন</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.emoji} {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-xs text-red-500 font-bengali">{errors.categoryId}</p>
        )}
      </div>

      <Input
        id="tags"
        label="ট্যাগ (কমা দিয়ে আলাদা করুন)"
        placeholder="প্রেম, ঢাকা, সম্পর্ক…"
        value={form.tags}
        onChange={(e) => setForm({ ...form, tags: e.target.value })}
      />

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isMature}
          onChange={(e) => setForm({ ...form, isMature: e.target.checked })}
          className="h-4 w-4 rounded border-stone-300 accent-amber-500"
        />
        <span className="text-sm text-stone-700 dark:text-stone-300 font-bengali">
          এটি প্রাপ্তবয়স্ক বিষয়বস্তু (১৮+)
        </span>
      </label>

      <Button type="submit" isLoading={isLoading} size="lg">
        {submitLabel}
      </Button>
    </form>
  )
}
