import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        space: {
          deep:    '#080e1a',
          mid:     '#0e1e38',
          surface: '#0a1428',
          card:    '#0f1e38',
        },
        ocean: {
          dark:  '#1a3a6a',
          mid:   '#2a5a8a',
          light: '#6aaac8',
          muted: '#5a8aaa',
          faint: '#4a7a9a',
          dim:   '#2a4a6a',
        },
        star: {
          gold:  '#f0c060',
          pale:  '#f8e4a0',
          faint: 'rgba(240,192,96,0.15)',
        },
        ink: {
          primary:   '#e8eef8',
          secondary: '#8aaac8',
          muted:     '#5a8aaa',
          faint:     '#3a5a7a',
          dim:       '#2a4a6a',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      maxWidth: {
        content: 'min(92%, 800px)',
      },
    },
  },
  plugins: [],
}

export default config
