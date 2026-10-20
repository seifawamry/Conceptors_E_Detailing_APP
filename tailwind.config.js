/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#0B431E',
          'green-dark': '#072C14',
          'green-light': '#14632E',
          'green-soft': '#E8F4EC',
          'green-50': '#F0FDF4',
          gold: '#96916E',
          'gold-light': '#B3AD85',
          'gold-soft': '#F7F5EE',
          'gold-50': '#FCFBF8',
          offwhite: '#F5F4F0',
          cream: '#FAF9F5',
          surface: '#FFFFFF',
        },
        catalysis: '#0B431E',
        bard: '#B45309',
        vitasignia: '#1D4ED8',
        ringbio: '#BE185D',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'brand': '0 4px 20px -2px rgba(11, 67, 30, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'brand-hover': '0 12px 30px -4px rgba(11, 67, 30, 0.16), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'brand-gold': '0 4px 20px -2px rgba(150, 145, 110, 0.25)',
        'card-elevated': '0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
      },
    },
  },
  plugins: [],
}
