/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        NotoSansKhmer: ['Noto Sans Khmer', 'sans-serif'], // Add this custom font
      },
    },

  },
  plugins: [],
}