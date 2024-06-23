/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      '2xl': ['1.6rem', {
        lineHeight: '1',
      }],
      '6xl': ['3.3rem', {
        lineHeight: '1',
      }],
      '9xl': ['6.9rem', {
        lineHeight: '1',
      }],
    },
    extend: {
      colors: {
        notWhite: {
          DEFAULT: '#F5F5F5',
          dark: '#F5F5F5AA',
        },
        notBlack: {
          DEFAULT: '#333333',
        }
      }
    }
  },
  plugins: [],
}

