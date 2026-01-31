/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'farm-green': '#22c55e',
        'farm-dark-green': '#16a34a',
        'farm-light-green': '#86efac',
      }
    },
  },
  plugins: [],
}
