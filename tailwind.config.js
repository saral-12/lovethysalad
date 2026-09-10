/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        salad: {
          dark: '#0F291E',
          primary: '#1E5631',
          leaf: '#2E7D32',
          fresh: '#22C55E',
          light: '#86EFAC',
          bg: '#FDFBF7',
          surface: '#F8FAF6',
          beige: '#F4EFE6',
          accent: '#F59E0B',
          orange: '#F97316',
          charcoal: '#1F2937',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft-sm': '0 2px 10px rgba(15, 41, 30, 0.03)',
        'soft-md': '0 8px 30px rgba(15, 41, 30, 0.06)',
        'soft-lg': '0 20px 40px rgba(15, 41, 30, 0.08)',
        'glow': '0 0 25px rgba(34, 197, 94, 0.25)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(3deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
}
