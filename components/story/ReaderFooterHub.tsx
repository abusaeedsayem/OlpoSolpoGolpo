'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface ReaderFooterHubProps {
  storyId: string
  storySlug: string
  chapterNum: number
  totalChapters: number
}

export function ReaderFooterHub({
  storyId,
  storySlug,
  chapterNum,
  totalChapters,
}: ReaderFooterHubProps) {
  const [rating, setRating] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [reviewBody, setReviewBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedMessage, setSubmittedMessage] = useState('')

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmittedMessage('')

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyId,
          rating,
          body: reviewBody.trim(),
        }),
      })

      if (res.ok) {
        setSubmittedMessage('✓ আপনার মূল্যবান রিভিউটি সফলভাবে প্রকাশিত হয়েছে!')
        setReviewBody('')
      } else {
        setSubmittedMessage('⚠️ রিভিউ জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।')
      }
    } catch {
      setSubmittedMessage('⚠️ রিভিউ জমা দিতে সমস্যা হয়েছে।')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-12 pt-8 border-t border-stone-200 dark:border-stone-800 space-y-8 font-bengali">
      {/* 5-Star Interactive Rating & Feedback Portal */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <span>✨</span> গল্প মূল্যায়ন ও রিভিউ লিখুন (Review Input)
        </h3>

        {/* 5-Star Rating Picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-500">আপনার রেটিং:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="text-2xl transition-transform hover:scale-125 focus:outline-none"
              >
                <span
                  className={
                    star <= (hoverRating || rating)
                      ? 'text-amber-400'
                      : 'text-stone-300 dark:text-stone-700'
                  }
                >
                  ★
                </span>
              </button>
            ))}
          </div>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded">
            {rating}.০ / ৫
          </span>
        </div>

        {/* Operational Review Textarea */}
        <form onSubmit={handleReviewSubmit} className="space-y-3">
          <textarea
            value={reviewBody}
            onChange={(e) => setReviewBody(e.target.value)}
            placeholder="গল্পটি কেমন লাগলো? লেখকের উদ্দেশ্যে আপনার গঠনমূলক মতামত ও রিভিউ লিখুন..."
            rows={3}
            className="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 transition-colors"
          />

          {submittedMessage && (
            <p className="text-xs font-semibold text-green-600 dark:text-green-400">
              {submittedMessage}
            </p>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
            >
              💬 রিভিউ জমা দিন
            </Button>
          </div>
        </form>
      </div>

      {/* Continuous CTA Routing Hub */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-900 p-6 rounded-2xl border border-amber-200 dark:border-stone-800">
        <div>
          <p className="text-xs text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider">
            পরবর্তী অধ্যায়
          </p>
          <p className="text-base font-bold text-stone-900 dark:text-stone-100">
            {chapterNum < totalChapters
              ? `অধ্যায় ${chapterNum + 1} পড়ার জন্য প্রস্তুত?`
              : 'আপনি গল্পটির সর্বশেষ অধ্যায়ে পৌঁছে গেছেন!'}
          </p>
        </div>

        {chapterNum < totalChapters ? (
          <Link href={`/read/${storySlug}/${chapterNum + 1}`}>
            <Button variant="primary" size="lg" className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 shadow-md">
              পরের অধ্যায় পড়ুন →
            </Button>
          </Link>
        ) : (
          <Link href={`/story/${storySlug}`}>
            <Button variant="secondary" size="lg" className="font-bold">
              📚 মূল গল্পে ফিরুন
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
