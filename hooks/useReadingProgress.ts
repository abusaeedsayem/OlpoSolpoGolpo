'use client'

import { useEffect, useState } from 'react'

/**
 * Tracks the scroll-based reading progress (0–100) of the current page.
 * Returns a percentage value for use in a progress bar.
 */
export function useReadingProgress(): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight
      if (docHeight <= 0) {
        setProgress(0)
        return
      }
      setProgress(Math.min(100, Math.round((scrollTop / docHeight) * 100)))
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return progress
}
