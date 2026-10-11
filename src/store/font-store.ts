'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FontSize = 'sm' | 'md' | 'lg' | 'xl';

interface FontState {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  increase: () => void;
  decrease: () => void;
}

const SIZES: FontSize[] = ['sm', 'md', 'lg', 'xl'];

export const FONT_SIZE_MAP: Record<FontSize, string> = {
  sm: '0.9rem',
  md: '1.0625rem',
  lg: '1.1875rem',
  xl: '1.3125rem',
};

export const useFontStore = create<FontState>()(
  persist(
    (set, get) => ({
      fontSize: 'md',
      setFontSize: (size) => set({ fontSize: size }),
      increase: () => {
        const current = SIZES.indexOf(get().fontSize);
        if (current < SIZES.length - 1) set({ fontSize: SIZES[current + 1] });
      },
      decrease: () => {
        const current = SIZES.indexOf(get().fontSize);
        if (current > 0) set({ fontSize: SIZES[current - 1] });
      },
    }),
    { name: 'osg-font-size' }
  )
);
