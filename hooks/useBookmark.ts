'use client'

import { useCallback, useState } from 'react'

/**
 * Optimistic bookmark toggle hook.
 * Pass the initial bookmarked state and storyId.
 */
export function useBookmark(storyId: string, initialState: boolean) {
  const [isBookmarked, setIsBookmarked] = useState(initialState)
  const [isPending, setIsPending] = useState(false)

  const toggle = useCallback(async () => {
    setIsBookmarked((prev) => !prev) // optimistic update
    setIsPending(true)
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId }),
      })
      if (!res.ok) throw new Error('Failed to toggle bookmark')
    } catch {
      setIsBookmarked((prev) => !prev) // revert on error
    } finally {
      setIsPending(false)
    }
  }, [storyId])

  return { isBookmarked, isPending, toggle }
}
