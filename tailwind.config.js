/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        wine: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0da',
          300: '#f4a8bb',
          400: '#ec7296',
          500: '#e04e77',
          600: '#cc2f5a',
          700: '#ac2249',
          800: '#8e1e40',
          900: '#771c3a',
          950: '#430a1d',
        },
      },
    },
  },
  plugins: [],
}
