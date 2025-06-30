/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Spiritual color palette inspired by Hindu traditions
        saffron: {
          50: '#fef7ed',
          100: '#fdecd4',
          200: '#fad5a8',
          300: '#f6b871',
          400: '#f19338',
          500: '#ed7611',
          600: '#de5d07',
          700: '#b84608',
          800: '#93380e',
          900: '#762f0f',
        },
        lotus: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        sacred: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        karma: {
          light: '#fbbf24',
          neutral: '#6b7280',
          dark: '#374151',
        }
      },
      fontFamily: {
        'sanskrit': ['Noto Sans Devanagari', 'serif'],
        'spiritual': ['Crimson Text', 'serif'],
      },
      animation: {
        'chakra-spin': 'spin 8s linear infinite',
        'karma-pulse': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(237, 118, 17, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(237, 118, 17, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}