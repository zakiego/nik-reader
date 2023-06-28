const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "hitam-50": "#E8E8E8",
        "hitam-100": "#868C91",
        "hitam-900": "#0E1111",
        garis: "#EEF0F2",
      },
      fontFamily: {
        sans: ["Inter", "system-ui"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
