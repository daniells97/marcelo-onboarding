/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './index-vite.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0A1322',
          900: '#0F1A2E',
          800: '#172540',
          700: '#223255',
          600: '#334672',
          500: '#4B618E',
        },
        gold: {
          50:  '#FBF5E8',
          100: '#F6E9C9',
          200: '#EED69A',
          300: '#E3C06A',
          400: '#D4A14A',
          500: '#B68436',
          600: '#8E6429',
        },
        paper: {
          50:  '#FBFAF7',
          100: '#F5F3EC',
          200: '#EAE6DB',
          300: '#D9D3C2',
        },
        ink: {
          900: '#1A1F2A',
          700: '#3F4756',
          500: '#6B7280',
          400: '#8C93A1',
        },
        ok:     '#1F7A5A',
        okbg:   '#E6F2EC',
        warn:   '#B85C1E',
        warnbg: '#FBEAD9',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card:      '0 1px 0 0 rgba(15,26,46,0.04), 0 1px 2px 0 rgba(15,26,46,0.04), 0 8px 24px -12px rgba(15,26,46,0.08)',
        cardHover: '0 1px 0 0 rgba(15,26,46,0.04), 0 2px 4px 0 rgba(15,26,46,0.04), 0 20px 36px -14px rgba(15,26,46,0.14)',
        inset:     'inset 0 0 0 1px rgba(15,26,46,0.06)',
      },
    },
  },
  plugins: [],
};
