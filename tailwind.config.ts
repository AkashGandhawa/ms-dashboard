import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1a1a1a', // Dark background
        'secondary': '#2d2d2d', // Slightly lighter dark
        'accent-red': 'var(--accent-red)',
        'accent-yellow': 'var(--accent-yellow)',
      },
      backgroundColor: {
        'accent-red/10': 'rgb(240 68 56 / 0.1)', // matches your --accent-red
      }
    },
  },
  plugins: [],
}
export default config
