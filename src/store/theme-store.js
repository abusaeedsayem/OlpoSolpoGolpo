'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const THEMES = [
    { value: 'parchment', label: 'পার্চমেন্ট', bg: '#FAF8F5' },
    { value: 'sepia', label: 'সেপিয়া', bg: '#F5F0E8' },
    { value: 'night', label: 'রাত', bg: '#121212' },
];
export const useThemeStore = create()(persist((set) => ({
    theme: 'parchment',
    setTheme: (theme) => set({ theme }),
}), { name: 'osg-theme' }));
