/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D9534F',
        secondary: '#F0AD4E',
        background: '#eeeeee',
        text: '#333333',
        accent: '#5CB85C',
      },
    },
  },
  plugins: [],
};
