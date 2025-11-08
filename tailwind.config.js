/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DC2626', // Red for primary actions
          light: '#EF4444',
          dark: '#B91C1C',
        },
      },
    },
  },
  plugins: [],
}

