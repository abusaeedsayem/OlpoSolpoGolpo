'use client'

import { useReadingProgress } from '@/hooks/useReadingProgress'

export function ReadingProgress() {
  const progress = useReadingProgress()

  return (
    <div
      className="fixed top-0 left-0 z-50 h-[3px] bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-150 ease-out"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="পঠন অগ্রগতি"
    />
  )
}
