import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B0E14',
          50: '#1A1F2E',
          100: '#14171F',
          200: '#0B0E14',
          300: '#080A10',
        },
        cream: {
          DEFAULT: '#FAF3E8',
          50: '#FDFAF4',
          100: '#FAF3E8',
          200: '#F5EDD8',
        },
        gold: {
          DEFAULT: '#E8A33D',
          50: '#F5D28A',
          100: '#EFB95E',
          200: '#E8A33D',
          300: '#D4892A',
          dark: '#C67B20',
        },
        dark: {
          card: '#1C2030',
          section: '#111520',
        }
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4rem', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-sm': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'eyebrow': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.08em', fontWeight: '600' }],
      },
      borderRadius: {
        'card': '1rem',
        'card-lg': '1.25rem',
        'pill': '9999px',
      },
      backgroundImage: {
        'dot-pattern': 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
        'gradient-dark': 'linear-gradient(180deg, rgba(11,14,20,0) 0%, rgba(11,14,20,0.85) 60%, rgba(11,14,20,1) 100%)',
        'gradient-card': 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.8) 100%)',
      },
      backgroundSize: {
        'dot': '28px 28px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
