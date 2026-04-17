import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        // Dark luxury palette
        'cb-black':   '#0a0a0a',
        'cb-card':    '#111111',
        'cb-elevated':'#1a1a1a',
        'cb-border':  '#2a2a2a',

        // Brand accents
        'cb-orange':  '#f97316',
        'cb-orange-hover': '#ea6c0a',
        'cb-gold':    '#d4a017',
        'cb-gold-light': '#f0c040',

        // Text
        'cb-text':    '#f5f5f5',
        'cb-muted':   '#a8a29e',
      },
      backgroundImage: {
        'gold-shimmer':
          'linear-gradient(90deg, #d4a017 0%, #f0c040 40%, #d4a017 60%, #f0c040 100%)',
        'orange-gradient':
          'linear-gradient(135deg, #f97316 0%, #ea6c0a 100%)',
        'hero-glow':
          'radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.08) 0%, transparent 60%)',
        'dark-surface':
          'linear-gradient(180deg, #0a0a0a 0%, #0f0a04 50%, #0a0a0a 100%)',
      },
      boxShadow: {
        'orange-glow': '0 0 30px rgba(249,115,22,0.3)',
        'orange-glow-lg': '0 0 60px rgba(249,115,22,0.5)',
        'gold-glow': '0 0 30px rgba(212,160,23,0.25)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
      },
      animation: {
        'pulse-dot': 'pulse-dot 1.2s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'badge-bounce': 'badge-bounce 2.5s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out both',
        'ticker-blink': 'ticker-blink 1.5s ease-in-out infinite',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(249,115,22,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(249,115,22,0.7)' },
        },
        'badge-bounce': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'ticker-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
