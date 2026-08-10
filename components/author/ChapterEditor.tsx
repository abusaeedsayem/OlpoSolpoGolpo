'use client'

import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/Textarea'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { readingTime } from '@/lib/utils'

interface ChapterEditorProps {
  storyId: string
  chapterNumber: number
  initialTitle?: string
  initialContent?: string
  onSave: (data: { title: string; content: string; status: 'DRAFT' | 'PUBLISHED' }) => Promise<void>
}

export function ChapterEditor({
  storyId,
  chapterNumber,
  initialTitle = '',
  initialContent = '',
  onSave,
}: ChapterEditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const estReadTime = readingTime(wordCount)

  // Auto-save every 30 seconds
  useEffect(() => {
    const timer = setInterval(async () => {
      if (content || title) {
        await handleSave('DRAFT')
      }
    }, 30000)
    return () => clearInterval(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, title])

  const handleSave = async (status: 'DRAFT' | 'PUBLISHED') => {
    setIsSaving(true)
    try {
      await onSave({ title, content, status })
      setLastSaved(new Date())
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Chapter header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-stone-700 dark:text-stone-300 font-bengali">
          অধ্যায় {chapterNumber}
        </h2>
        <div className="flex items-center gap-3 text-xs text-stone-400">
          {lastSaved && (
            <span className="font-bengali">
              শেষ সংরক্ষণ:{' '}
              {lastSaved.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <span className="font-bengali">{wordCount} শব্দ · ~{estReadTime} মিনিট</span>
        </div>
      </div>

      <Input
        id="chapter-title"
        label="অধ্যায়ের শিরোনাম"
        placeholder="এই অধ্যায়ের নাম…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Textarea
        id="chapter-content"
        label="বিষয়বস্তু"
        placeholder="এখানে লিখুন…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={25}
        className="min-h-[500px] font-reading text-lg leading-[1.9]"
      />

      <div className="flex gap-3 justify-end">
        <Button
          variant="secondary"
          onClick={() => handleSave('DRAFT')}
          isLoading={isSaving}
        >
          খসড়া সংরক্ষণ
        </Button>
        <Button
          variant="primary"
          onClick={() => handleSave('PUBLISHED')}
          isLoading={isSaving}
        >
          প্রকাশ করুন
        </Button>
      </div>
    </div>
  )
}
