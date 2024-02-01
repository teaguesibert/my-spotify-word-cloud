/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        mintgreen: {
          50: '#f2fcf7',
          100: '#e6f9f0',
          200: '#c0efdb',
          300: '#99e6c7',
          400: '#4dd3a1',
          500: '#00bf7b',
          600: '#00ac70',
          700: '#008d5c',
          800: '#006f48',
          900: '#005a3b',
        },
        spotify:{
          100: '#FFFFFF',
          200: '#191414'
        }
      },
    },
  },
  plugins: [],
}
