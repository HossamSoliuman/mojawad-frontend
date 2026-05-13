/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        gold: '#c9a153',
        'gold-dark': '#b8923e',
        dark: {
          DEFAULT: '#07070f',
          card: '#0e0e1c',
          border: '#1e1e35',
        },
      },
      fontFamily: {
        arabic: ['Noto Naskh Arabic', 'serif'],
      },
    },
  },
  plugins: [],
};
