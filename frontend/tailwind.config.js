/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        trading: {
          bg: '#0a0e17',
          card: '#111827',
          border: '#1f2937',
          text: '#e5e7eb',
          textMuted: '#9ca3af',
          green: '#10b981',
          greenBg: 'rgba(16, 185, 129, 0.1)',
          red: '#ef4444',
          redBg: 'rgba(239, 68, 68, 0.1)',
          accent: '#3b82f6',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
