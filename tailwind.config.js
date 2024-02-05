/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      borderColor: {
        'custom-orange': '#FF7200',
      },
      color: {
        'custom-orange': '#FF7200',
      }
    },
  },
  plugins: [],
}

