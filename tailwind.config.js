module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Poppins"],
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
