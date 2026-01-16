/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customGray: "#262626",
        iconColor: "#FCFCFC",
        customOrange: "#F29145",
        successGreen: "#295B40"
      },
    },
  },
  plugins: [],
};
