/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#6366f1',   // indigo
          dark: '#0f0f1a',
          surface: '#f9f9fb',
          muted: '#64748b',
        }
      }
    }
  },
  plugins: []
}
