'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { CATEGORIES } from '@/lib/constants'

export default function NewPublishStoryPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusAction, setStatusAction] = useState<'DRAFT' | 'PUBLISHED'>('PUBLISHED')
  const [errorMsg, setErrorMsg] = useState('')

  // Form Fields
  const [title, setTitle] = useState('')
  const [chapterTitle, setChapterTitle] = useState('প্রথম অধ্যায়')
  const [content, setContent] = useState('')
  const [description, setDescription] = useState('')
  const [categorySlug, setCategorySlug] = useState(CATEGORIES[0].slug)
  const [tagsInput, setTagsInput] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [isMature, setIsMature] = useState(false)

  // Formatting state
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left')

  // Bengali numerals helper
  const toBengaliNumerals = (num: number): string => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
    return num.toString().replace(/\d/g, (digit) => bengaliDigits[parseInt(digit)])
  }

  // Word count calculation
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  const handleFormat = (command: string) => {
    if (command === 'bold') setIsBold(!isBold)
    if (command === 'italic') setIsItalic(!isItalic)
    if (command === 'underline') setIsUnderline(!isUnderline)
    if (command.startsWith('align-')) {
      setTextAlign(command.replace('align-', '') as 'left' | 'center' | 'right')
    }
  }

  const handlePublishOrSave = async (targetStatus: 'DRAFT' | 'PUBLISHED') => {
    setErrorMsg('')
    if (!title.trim()) {
      setErrorMsg('অনুগ্রহ করে গল্পের প্রধান শিরোনাম দিন।')
      return
    }
    if (!content.trim()) {
      setErrorMsg('অনুগ্রহ করে গল্পের বিষয়বস্তু বা মূল অংশ লিখুন।')
      return
    }

    setIsSubmitting(true)
    setStatusAction(targetStatus)

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          chapterTitle: chapterTitle.trim() || 'প্রথম অধ্যায়',
          content: content.trim(),
          description: description.trim() || title.trim(),
          categorySlug,
          tags: tagsArray,
          coverUrl: coverUrl.trim(),
          isMature,
          status: targetStatus,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        setErrorMsg(errorData.error || 'গল্প তৈরি করতে সমস্যা হয়েছে।')
        setIsSubmitting(false)
        return
      }

      const data = await res.json()
      if (data.slug) {
        if (targetStatus === 'PUBLISHED') {
          // Instant redirect to published live story page
          router.push(`/story/${data.slug}`)
        } else {
          router.push('/dashboard')
        }
      } else {
        router.push('/dashboard')
      }
    } catch {
      setErrorMsg('একটি সমস্যা দেখা দিয়েছে। আবার চেষ্টা করুন।')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-4 sm:p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="text-xs text-stone-400 hover:text-amber-600 font-bengali">
                ← ড্যাশবোর্ডে ফিরুন
              </Link>
              <span>·</span>
              <Badge variant="info">নতুন প্রকাশনা</Badge>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 font-bengali mt-1">
              ✍️ নতুন গল্প প্রকাশ করুন
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button
              variant="secondary"
              size="md"
              onClick={() => handlePublishOrSave('DRAFT')}
              isLoading={isSubmitting && statusAction === 'DRAFT'}
              disabled={isSubmitting}
              className="font-bengali"
            >
              💾 ড্রাফট হিসেবে রাখুন
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={() => handlePublishOrSave('PUBLISHED')}
              isLoading={isSubmitting && statusAction === 'PUBLISHED'}
              disabled={isSubmitting}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bengali shadow-md px-6"
            >
              🔴 প্রকাশ করুন
            </Button>
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-xl bg-red-50 dark:bg-red-950/40 p-4 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 font-bengali text-sm text-center">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left / Primary Writing Column (2 Columns wide) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Story Title & Chapter Title Inputs */}
            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-800 dark:text-stone-200 font-bengali mb-1.5">
                  গল্পের প্রধান শিরোনাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: নীল জলের গান..."
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-lg font-bold text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 font-bengali transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 font-bengali mb-1">
                  অধ্যায়ের নাম (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  placeholder="যেমন: প্রথম অধ্যায় / সূচনা"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 font-bengali transition-colors"
                />
              </div>
            </div>

            {/* Story Body Canvas with Formatting Toolbar */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
              {/* Formatting Toolbar */}
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 px-4 py-2 bg-stone-100/70 dark:bg-stone-800/70 border-b border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300">
                <button
                  type="button"
                  onClick={() => handleFormat('bold')}
                  className={`h-8 w-8 rounded font-bold hover:bg-white dark:hover:bg-stone-700 transition-colors ${
                    isBold ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' : ''
                  }`}
                  title="Bold"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat('italic')}
                  className={`h-8 w-8 rounded italic hover:bg-white dark:hover:bg-stone-700 transition-colors ${
                    isItalic ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' : ''
                  }`}
                  title="Italic"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat('underline')}
                  className={`h-8 w-8 rounded underline hover:bg-white dark:hover:bg-stone-700 transition-colors ${
                    isUnderline ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' : ''
                  }`}
                  title="Underline"
                >
                  U
                </button>

                <span className="h-5 w-px bg-stone-300 dark:bg-stone-700 mx-1" />

                <button
                  type="button"
                  onClick={() => handleFormat('align-left')}
                  className={`h-8 w-8 rounded hover:bg-white dark:hover:bg-stone-700 ${
                    textAlign === 'left' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' : ''
                  }`}
                  title="Align Left"
                >
                  ≡
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat('align-center')}
                  className={`h-8 w-8 rounded hover:bg-white dark:hover:bg-stone-700 ${
                    textAlign === 'center' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' : ''
                  }`}
                  title="Align Center"
                >
                  ≂
                </button>

                <span className="h-5 w-px bg-stone-300 dark:bg-stone-700 mx-1" />

                <button
                  type="button"
                  onClick={() => {
                    const url = prompt('লিংক URL দিন:')
                    if (url) setContent((prev) => prev + ` [${url}](${url}) `)
                  }}
                  className="h-8 px-2.5 rounded text-xs font-bengali hover:bg-white dark:hover:bg-stone-700"
                >
                  🔗 লিংক
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const imgUrl = prompt('ছবির URL দিন:')
                    if (imgUrl) setContent((prev) => prev + `\n![ছবি](${imgUrl})\n`)
                  }}
                  className="h-8 px-2.5 rounded text-xs font-bengali hover:bg-white dark:hover:bg-stone-700"
                >
                  📷 ছবি
                </button>
              </div>

              {/* Text Area Writing Canvas */}
              <div className="p-6">
                <label className="block text-sm font-bold text-stone-800 dark:text-stone-200 font-bengali mb-2">
                  গল্পের মূল বিষয়বস্তু (Body Content) <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="এখানে আপনার সম্পূর্ণ গল্প বা প্রথম অধ্যায়ের বিস্তারিত কাহিনী লিখুন..."
                  rows={16}
                  className={`w-full bg-transparent resize-none border-none outline-none font-reading text-stone-900 dark:text-stone-100 text-lg leading-[1.9] placeholder:text-stone-300 dark:placeholder:text-stone-700 ${
                    isBold ? 'font-bold' : ''
                  } ${isItalic ? 'italic' : ''} ${isUnderline ? 'underline' : ''}`}
                  style={{ textAlign }}
                />
              </div>

              {/* Bengali Live Word Counter Footer */}
              <div className="px-6 py-3 bg-stone-50 dark:bg-stone-950 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center text-xs text-stone-400 font-bengali">
                <span>অল্প স্বল্প গল্প — পাঠ সহায়ক ক্যানভাস</span>
                <span className="font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                  {toBengaliNumerals(wordCount)} শব্দসংখ্যা
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Metadata & Settings (Summary, Category, Tags, Cover, Mature) */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
              <h3 className="font-bold text-base font-bengali text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-800 flex items-center gap-2">
                <span>📌</span> গল্পের বিবরণ ও ক্যাটাগরি
              </h3>

              {/* Summary Textarea */}
              <Textarea
                id="story-description"
                label="গল্পের সংক্ষিপ্ত সারসংক্ষেপ (Summary)"
                placeholder="পাঠকদের আকৃষ্ট করার মতো সংক্ষিপ্ত বিবরণ দিন (২-৩ বাক্য)..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* Category Dropdown */}
              <div>
                <label className="block text-sm font-medium font-bengali text-stone-700 dark:text-stone-300 mb-1.5">
                  গল্পের বিভাগ (Category)
                </label>
                <select
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-3 font-bengali text-stone-900 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 transition-colors"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.emoji} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags Input */}
              <Input
                id="story-tags"
                label="ট্যাগসমূহ (Tags)"
                placeholder="যেমন: প্রেম, রহস্য, শৈশব (কমা দিয়ে আলাদা করুন)"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />

              {/* Cover URL Input */}
              <Input
                id="story-cover-url"
                label="কভার ছবির লিংক (Cover Image URL)"
                placeholder="https://example.com/cover.jpg (ঐচ্ছিক)"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
              />

              {/* Mature Content Checkbox */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="is-mature-content"
                  checked={isMature}
                  onChange={(e) => setIsMature(e.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="is-mature-content" className="text-sm font-bengali text-stone-700 dark:text-stone-300 select-none cursor-pointer">
                  ১৮+ বিষয়বস্তু ধারণ করে
                </label>
              </div>
            </div>

            {/* Bottom Publish Callout Box */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg space-y-4">
              <h4 className="font-bold text-lg font-bengali flex items-center gap-2">
                <span>🚀</span> প্রকাশ করার জন্য প্রস্তুত?
              </h4>
              <p className="text-xs text-amber-100 font-bengali leading-relaxed">
                "প্রকাশ করুন" বাটনে ক্লিক করলে আপনার গল্পটি অবিলম্বে **অল্প স্বল্প গল্প** প্ল্যাটফর্মে লাইভ প্রকাশিত হবে এবং পাঠকগণ তা পড়তে পারবেন।
              </p>

              <Button
                variant="primary"
                size="lg"
                onClick={() => handlePublishOrSave('PUBLISHED')}
                isLoading={isSubmitting && statusAction === 'PUBLISHED'}
                disabled={isSubmitting}
                className="w-full bg-white hover:bg-amber-50 text-amber-800 font-bengali font-bold shadow-md"
              >
                🔴 এখনই প্রকাশ করুন →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
