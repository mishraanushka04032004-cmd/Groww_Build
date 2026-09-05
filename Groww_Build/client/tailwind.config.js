/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        caramel: {
          'base-100': '#FFF7ED',
          'base-200': '#FEECD3',
          'base-300': '#FFD6A7',
          'base-content': '#7C2808',
          primary: '#370A00',
          secondary: '#8C3F27',
          accent: '#C93400',
          neutral: '#370A00',
          info: '#193AB7',
          success: '#006044',
          warning: '#FCB700',
          error: '#FF6266',
        },
        groww: {
          green: '#00D09C',
          'green-dark': '#00B386',
          'green-light': 'rgba(0, 208, 156, 0.12)',
          red: '#EB5757',
          'red-dark': '#D94343',
          'red-light': 'rgba(235, 87, 87, 0.12)',
          blue: '#5367FF',
          'blue-light': 'rgba(83, 103, 255, 0.12)',
          yellow: '#FFB800',
          'yellow-light': 'rgba(255, 184, 0, 0.12)',
          dark: '#121212',
          card: '#1C212D',
          'card-hover': '#232A38',
          surface: '#242B3B',
          border: '#2A3345',
          'border-subtle': '#1F2735',
          text: '#F5F6F8',
          'text-muted': '#8F9CA9',
          'text-dim': '#5B6776',
        },
        background: {
          DEFAULT: '#121212',
          secondary: '#1C212D',
          tertiary: '#242B3B',
          card: '#1C212D',
        },
        surface: {
          border: '#2A3345',
          hover: 'rgba(255, 255, 255, 0.04)',
          active: 'rgba(255, 255, 255, 0.08)',
        },
        brand: {
          50: '#E6FAF5',
          100: '#B3F2E3',
          400: '#33D9AF',
          500: '#00D09C', // Groww signature primary green
          600: '#00B386',
          700: '#009973',
        },
        severity: {
          high: '#EB5757',
          'high-bg': 'rgba(235, 87, 87, 0.12)',
          medium: '#FFB800',
          'medium-bg': 'rgba(255, 184, 0, 0.12)',
          low: '#00D09C',
          'low-bg': 'rgba(0, 208, 156, 0.12)',
          info: '#5367FF',
          'info-bg': 'rgba(83, 103, 255, 0.12)',
        },
        market: {
          up: '#00D09C',
          down: '#EB5757',
          neutral: '#8F9CA9',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Roboto Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
        cursive: ['Kaushan Script', 'Satisfy', 'Dancing Script', 'cursive'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
