'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { ReadingTheme } from '@/lib/constants'

interface ThemeContextValue {
  theme: ReadingTheme
  setTheme: (theme: ReadingTheme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ReadingTheme>('light')

  useEffect(() => {
    const stored = localStorage.getItem('osg-theme') as ReadingTheme | null
    if (stored && ['light', 'dark', 'sepia'].includes(stored)) {
      setThemeState(stored)
      document.documentElement.setAttribute('data-theme', stored)
    }
  }, [])

  const setTheme = (newTheme: ReadingTheme) => {
    setThemeState(newTheme)
    localStorage.setItem('osg-theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
