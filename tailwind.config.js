/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./widget.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: 'Inter',
      },
      colors: {
        ice: '#ffffff',
        purple: '#9146FF',
      },
    },
  },
  plugins: [],
}

