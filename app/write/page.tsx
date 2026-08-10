import type { Metadata } from 'next'
import { ChapterEditor } from '@/components/author/ChapterEditor'

export const metadata: Metadata = {
  title: 'নতুন লেখা — অল্প স্বল্প গল্প',
  description: 'নতুন গল্প বা অধ্যায় লিখুন',
}

export default function WritePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <ChapterEditor />
    </div>
  )
}
