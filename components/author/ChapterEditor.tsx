'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { CATEGORIES } from '@/lib/constants'

interface ChapterEditorProps {
  storyId?: string
  chapterNumber?: number
  initialTitle?: string
  initialContent?: string
  initialStatus?: 'DRAFT' | 'PUBLISHED'
  onSave?: (data: { title: string; content: string; status: 'DRAFT' | 'PUBLISHED' }) => Promise<void>
}

export function ChapterEditor({
  storyId,
  chapterNumber = 1,
  initialTitle = '',
  initialContent = '',
  initialStatus = 'DRAFT',
  onSave,
}: ChapterEditorProps) {
  const [title, setTitle] = useState(initialTitle || `অধ্যায় ${chapterNumber}`)
  const [content, setContent] = useState(initialContent)
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>(initialStatus)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Formatting state
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left')

  // Story details state
  const [storyDetails, setStoryDetails] = useState({
    title: '',
    description: '',
    categoryId: CATEGORIES[0].slug,
    tags: '',
    coverUrl: '',
    isMature: false,
  })

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

  const handleSave = async (targetStatus: 'DRAFT' | 'PUBLISHED') => {
    setIsSaving(true)
    try {
      if (onSave) {
        await onSave({ title, content, status: targetStatus })
      } else if (storyId) {
        await fetch(`/api/stories/${storyId}/chapters`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content, status: targetStatus }),
        })
      }
      setStatus(targetStatus)
      const now = new Date()
      const hours = toBengaliNumerals(now.getHours())
      const minutes = now.getMinutes() < 10 ? `০${toBengaliNumerals(now.getMinutes())}` : toBengaliNumerals(now.getMinutes())
      setLastSavedTime(`${hours}:${minutes}`)
    } catch {
      alert('সংরক্ষণ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col min-h-[85vh] bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
      {/* Pratilipi-style Top Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white font-bold text-sm">
            📖
          </span>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="অধ্যায়ের শিরোনাম..."
                className="font-bengali font-bold text-stone-900 dark:text-stone-100 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-amber-500 focus:outline-none text-base sm:text-lg transition-colors px-1"
              />
              <Badge variant={status === 'PUBLISHED' ? 'success' : 'muted'}>
                {status === 'PUBLISHED' ? 'প্রকাশিত' : 'ড্রাফট'}
              </Badge>
            </div>
            {lastSavedTime && (
              <p className="text-xs text-stone-400 font-bengali px-1 mt-0.5">
                ✓ শেষ সংরক্ষণ: {lastSavedTime}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSettingsOpen(true)}
            className="text-stone-600 dark:text-stone-300"
          >
            ⚙️ গল্প তথ্য
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
          >
            {isPreviewOpen ? '✏️ সম্পাদনা' : '👁️ পূর্বাবলোকন'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSave('DRAFT')}
            isLoading={isSaving && status === 'DRAFT'}
          >
            সংরক্ষণ করুন
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleSave('PUBLISHED')}
            isLoading={isSaving && status === 'PUBLISHED'}
            className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
          >
            🔴 প্রকাশ করুন
          </Button>
        </div>
      </header>

      {/* Formatting Toolbar (Pratilipi Style) */}
      {!isPreviewOpen && (
        <div className="sticky top-[61px] z-20 flex flex-wrap items-center justify-center gap-1 sm:gap-2 px-4 py-2 bg-white/90 dark:bg-stone-900/90 backdrop-blur border-b border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300">
          <button
            type="button"
            onClick={() => handleFormat('bold')}
            className={`h-8 w-8 rounded font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ${
              isBold ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' : ''
            }`}
            title="Bold"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => handleFormat('italic')}
            className={`h-8 w-8 rounded italic hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ${
              isItalic ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' : ''
            }`}
            title="Italic"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => handleFormat('underline')}
            className={`h-8 w-8 rounded underline hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ${
              isUnderline ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' : ''
            }`}
            title="Underline"
          >
            U
          </button>

          <span className="h-5 w-px bg-stone-200 dark:bg-stone-800 mx-1" />

          <button
            type="button"
            onClick={() => handleFormat('align-left')}
            className={`h-8 w-8 rounded hover:bg-stone-100 dark:hover:bg-stone-800 ${
              textAlign === 'left' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' : ''
            }`}
            title="Align Left"
          >
            ≡
          </button>
          <button
            type="button"
            onClick={() => handleFormat('align-center')}
            className={`h-8 w-8 rounded hover:bg-stone-100 dark:hover:bg-stone-800 ${
              textAlign === 'center' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' : ''
            }`}
            title="Align Center"
          >
            ≂
          </button>
          <button
            type="button"
            onClick={() => handleFormat('align-right')}
            className={`h-8 w-8 rounded hover:bg-stone-100 dark:hover:bg-stone-800 ${
              textAlign === 'right' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' : ''
            }`}
            title="Align Right"
          >
            ≣
          </button>

          <span className="h-5 w-px bg-stone-200 dark:bg-stone-800 mx-1" />

          <button
            type="button"
            onClick={() => {
              const url = prompt('লিংক URL দিন:')
              if (url) {
                setContent((prev) => prev + ` [${url}](${url}) `)
              }
            }}
            className="h-8 px-2 rounded text-xs font-bengali hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            🔗 লিংক
          </button>

          <button
            type="button"
            onClick={() => {
              const imgUrl = prompt('ছবির URL দিন:')
              if (imgUrl) {
                setContent((prev) => prev + `\n![ছবি](${imgUrl})\n`)
              }
            }}
            className="h-8 px-2 rounded text-xs font-bengali hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            📷 ছবি
          </button>
        </div>
      )}

      {/* Main Writing Canvas */}
      <main className="flex-1 flex justify-center p-4 sm:p-8 overflow-y-auto">
        <div className="w-full max-w-3xl bg-white dark:bg-stone-900 min-h-[60vh] rounded-xl shadow-lg border border-stone-100 dark:border-stone-800 p-6 sm:p-10 flex flex-col relative">
          {isPreviewOpen ? (
            <div className="prose-reading font-reading text-lg leading-relaxed text-stone-900 dark:text-stone-100">
              <h1 className="text-2xl font-bold font-bengali mb-6 pb-2 border-b border-stone-200 dark:border-stone-800">
                {title}
              </h1>
              {content ? (
                content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 font-bengali leading-relaxed text-justify">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-stone-400 font-bengali italic">কোনো বিষয়বস্তু লেখা হয়নি।</p>
              )}
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="এখানে আপনার গল্প বা অধ্যায়ের বিষয়বস্তু লিখুন..."
              className={`flex-1 w-full bg-transparent resize-none border-none outline-none font-reading text-stone-900 dark:text-stone-100 text-lg leading-[1.9] placeholder:text-stone-300 dark:placeholder:text-stone-700 ${
                isBold ? 'font-bold' : ''
              } ${isItalic ? 'italic' : ''} ${isUnderline ? 'underline' : ''}`}
              style={{ textAlign }}
            />
          )}

          {/* Live Bengali Word Count Footer (Pratilipi Style) */}
          <div className="mt-8 pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center text-xs text-stone-400 font-bengali">
            <span>অল্প স্বল্প গল্প সম্পাদক</span>
            <span className="font-semibold text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full">
              {toBengaliNumerals(wordCount)} শব্দসংখ্যা
            </span>
          </div>
        </div>
      </main>

      {/* Story Info Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-lg w-full p-6 border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 dark:border-stone-800 pb-3">
              <h3 className="font-bold text-lg font-bengali text-stone-900 dark:text-stone-100">
                ⚙️ গল্পের তথ্য ও সেটিং
              </h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-lg"
              >
                ✕
              </button>
            </div>

            <Input
              id="story-title"
              label="গল্পের প্রধান শিরোনাম"
              placeholder="যেমন: নীল জলের গান"
              value={storyDetails.title}
              onChange={(e) => setStoryDetails({ ...storyDetails, title: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium font-bengali text-stone-700 dark:text-stone-300 mb-1">
                গল্পের বিভাগ
              </label>
              <select
                value={storyDetails.categoryId}
                onChange={(e) => setStoryDetails({ ...storyDetails, categoryId: e.target.value })}
                className="w-full rounded-xl border border-stone-200 bg-white p-3 font-bengali text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <Textarea
              id="story-desc"
              label="সংক্ষিপ্ত সারসংক্ষেপ"
              placeholder="গল্পটি কী নিয়ে লেখা? পাঠকদের আকৃষ্ট করার মতো সংক্ষিপ্ত বিবরণ দিন..."
              value={storyDetails.description}
              onChange={(e) => setStoryDetails({ ...storyDetails, description: e.target.value })}
            />

            <Input
              id="story-cover"
              label="কভার ছবির URL (ঐচ্ছিক)"
              placeholder="https://example.com/cover.jpg"
              value={storyDetails.coverUrl}
              onChange={(e) => setStoryDetails({ ...storyDetails, coverUrl: e.target.value })}
            />

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="is-mature"
                checked={storyDetails.isMature}
                onChange={(e) => setStoryDetails({ ...storyDetails, isMature: e.target.checked })}
                className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              />
              <label htmlFor="is-mature" className="text-sm font-bengali text-stone-700 dark:text-stone-300">
                ১৮+ বিষয়বস্তু ধারণ করে
              </label>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsSettingsOpen(false)}>
                বাতিল
              </Button>
              <Button variant="primary" onClick={() => setIsSettingsOpen(false)}>
                সংরক্ষণ করুন
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
