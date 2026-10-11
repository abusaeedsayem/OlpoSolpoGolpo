'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'parchment' | 'sepia' | 'night';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const THEMES: { value: Theme; label: string; bg: string }[] = [
  { value: 'parchment', label: 'পার্চমেন্ট', bg: '#FAF8F5' },
  { value: 'sepia',     label: 'সেপিয়া',     bg: '#F5F0E8' },
  { value: 'night',     label: 'রাত',         bg: '#121212' },
];

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'parchment',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'osg-theme' }
  )
);
