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
                    950: '#07070b',
                    900: '#0d0d14',
                    800: '#13131e',
                    700: '#1a1a28',
                },
                gold: {
                    DEFAULT: '#c9a84c',
                    muted: 'rgba(201,168,76,0.15)',
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
