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
        primary: {
          DEFAULT: '#FF6A1F',
          light: '#FFF1E8',
          dark: '#E85A0F',
        },
        dark: {
          900: '#0D1B2E',
          800: '#152238',
          700: '#1E2F4A',
        },
        text: {
          light: '#E6EAF2',
          muted: '#9CA3AF',
        }
      },
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      }
    },
  },
  plugins: [],
}