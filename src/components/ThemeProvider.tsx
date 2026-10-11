'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/theme-store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);

    const bgMap = {
      parchment: '#F1F2F4',
      sepia: '#F5F0E8',
      night: '#121212',
    };
    const textMap = {
      parchment: '#333333',
      sepia: '#2C2416',
      night: '#E8E0D4',
    };

    root.style.setProperty('--bg-canvas', bgMap[theme]);
    root.style.setProperty('--text-primary', textMap[theme]);
  }, [theme]);

  return <>{children}</>;
}
