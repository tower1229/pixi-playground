/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  theme: {
    fontFamily: {
      rubik: ["Rubik", "sans-serif"],
    },
  },
  // daisyUI config (optional - here are the default values)
  daisyui: {
    themes: [],
  },
};
