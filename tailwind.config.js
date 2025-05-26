/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f1f7fe',
          100: '#e2eefc',
          200: '#bedcf9',
          300: '#85c0f4',
          400: '#45a0eb',
          500: '#F97316',
          600: '#0f67ba',
          700: '#F97316',
          800: '#9A3412',
          900: '#9A3412',
          950: '#050E1A',
        },
        secondary: {
          50: '#f5faf3',
          100: '#e7f5e3',
          200: '#d0e9c9',
          300: '#a8d79e',
          400: '#7abd6b',
          500: '#559c45',
          600: '#458336',
          700: '#38682d',
          800: '#305328',
          900: '#274522',
          950: '#11250e',
        },
        bgligth: '#F3EDE5',
        bgdark: '#2A2826',
        bgbluegray: '#E2E8F0',
        bgArray: '#bedcf9',
        bgsuccess: '#22C55E'
      },
    },
    screens: {
      'sm': '576px',
      'md': '960px',
      'lg': '1440px',
    },
  },
  plugins: [],
  darkMode: ['class'],
};