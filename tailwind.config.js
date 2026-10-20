/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // High-trust clinical stage & surfaces
        alabaster: '#F8FAFC',
        surface: '#FFFFFF',
        
        // Conceptors Brand Identity (vetsconcept.com standard)
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
        },

        // Deep Clinical Navy (Structural navigation & headers)
        'clinical-navy': {
          DEFAULT: '#0F172A',
          50: '#F8FAFC',
          100: '#F1F5F9',
          800: '#1E293B',
          900: '#0F172A',
          950: '#0A0F1D',
        },

        // Veterinary Medical Teal (Efficacy badges, endpoints, active states)
        'medical-teal': {
          DEFAULT: '#0D9488',
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
        },

        // Therapeutic Category Clinical Color Coding
        category: {
          dermatology: '#0284C7', // Sky / Cerulean
          immunology: '#7C3AED',  // Violet / Purple
          hepatic: '#059669',     // Emerald Green
          renal: '#0D9488',       // Medical Teal
          respiratory: '#2563EB', // Royal Blue
          otic: '#D97706',        // Amber Gold
          diagnostics: '#DB2777', // Magenta / Pink
        },

        // Partner Principals
        catalysis: '#0B431E',
        bard: '#B45309',
        vitasignia: '#1D4ED8',
        ringbio: '#BE185D',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'brand': '0 4px 20px -2px rgba(11, 67, 30, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'brand-hover': '0 12px 30px -4px rgba(11, 67, 30, 0.16), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'brand-gold': '0 4px 20px -2px rgba(150, 145, 110, 0.25)',
        'card-elevated': '0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        'hud': '0 20px 40px -15px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.6)',
        'hud-dark': '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.15)',
        'drawer': '-10px 0 40px -10px rgba(15, 23, 42, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)',
      },
      dropShadow: {
        'studio': '0 20px 25px rgba(15, 23, 42, 0.15)',
        'glow-teal': '0 0 15px rgba(13, 148, 136, 0.4)',
        'glow-gold': '0 0 15px rgba(150, 145, 110, 0.4)',
      },
    },
  },
  plugins: [],
}
