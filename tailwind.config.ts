import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        screens: {
            xs: '480px',
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl:': '1536px',
        },
        extend: {
            colors: {
                ink: {
                    950: '#05060A',
                    900: '#0A0B10',
                    800: '#11121A',
                    700: '#1A1C28',
                },
                gold: {
                    DEFAULT: '#d4af37',
                    muted: 'rgba(212,175,55,0.15)',
                },
                steel: {
                    DEFAULT: '#6b8cba',
                    muted: 'rgba(107,140,186,0.1)',
                },
                success: '#4ade80',
                danger: '#f87171',
                warning: '#fbbf24',
            },
            textColor: {
                primary: '#f0ede8',
                secondary: '#9896a4',
                muted: '#5c5a6e',
            },
            boxShadow: {
                'glow-gold': '0 0 20px rgba(212, 175, 55, 0.3), 0 0 60px rgba(212, 175, 55, 0.1)',
                'glass-inner': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                'card-hover': '0 8px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            },
            fontFamily: {
                display: ['var(--font-playfair)', 'serif'],
                sans: ['var(--font-dm-sans)', 'sans-serif'],
                mono: ['var(--font-jetbrains)', 'monospace'],
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
                scan: {
                    '0%': { top: '0%' },
                    '100%': { top: '100%' },
                },
            },
            animation: {
                'fade-up': 'fadeUp 0.6s ease-out forwards',
                'fade-in': 'fadeIn 0.4s ease-out forwards',
                shimmer: 'shimmer 2s linear infinite',
                float: 'float 6s ease-in-out infinite',
                scan: 'scan 3s ease-in-out infinite',
            },
        },
    },
    plugins: [],
}
export default config
