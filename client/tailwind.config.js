/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#050A18',
        foreground: '#E2E8F0',
        card: '#0A1428',
        "card-foreground": '#E2E8F0',
        primary: '#3B82F6',
        "primary-foreground": '#FFFFFF',
        secondary: '#6366F1',
        "secondary-foreground": '#FFFFFF',
        accent: '#8B5CF6',
        "accent-foreground": '#FFFFFF',
        muted: '#1E293B',
        "muted-foreground": '#94A3B8',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        border: '#1E293B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px theme(colors.primary), 0 0 10px theme(colors.primary)' },
          '50%': { boxShadow: '0 0 20px theme(colors.primary), 0 0 30px theme(colors.secondary)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        glow: 'glow 3s ease-in-out infinite',
        pulse: 'pulse 2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      },
    },
  },
  plugins: [],
};