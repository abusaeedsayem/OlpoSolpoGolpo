/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="night"]'],
  theme: {
    extend: {
      colors: {
        crimson: {
          DEFAULT: '#D61717',
          dark: '#B01212',
          light: '#E84545',
        },
        ink: {
          DEFAULT: '#333333',
          muted: '#4B4B4B',
          subtle: '#7A7A7A',
        },
        parchment: {
          DEFAULT: '#F1F2F4',
          sepia: '#F5F0E8',
          night: '#121212',
        },
        ochre: {
          DEFAULT: '#B45309',
          light: '#D97706',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F5F5F4',
        },
      },
      fontFamily: {
        prose: ['"Noto Serif Bengali"', 'Georgia', 'serif'],
        ui: ['"Hind Siliguri"', 'system-ui', 'sans-serif'],
      },
      lineHeight: {
        reading: '1.65',
      },
      maxWidth: {
        reader: '680px',
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: '"Noto Serif Bengali", Georgia, serif',
            lineHeight: '1.65',
          },
        },
      },
    },
  },
  plugins: [],
};
