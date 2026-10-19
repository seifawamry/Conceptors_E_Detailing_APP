/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#060911',
          900: '#090D16',
          850: '#0D1322',
          800: '#131C31',
          700: '#1D2A47',
        },
        catalysis: '#10B981',
        bard: '#F59E0B',
        vitasignia: '#3B82F6',
        ringbio: '#EC4899',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.4)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.4)',
        'glow-magenta': '0 0 25px -5px rgba(236, 72, 153, 0.4)',
        'glow-gold': '0 0 20px 2px rgba(234, 179, 8, 0.35)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
