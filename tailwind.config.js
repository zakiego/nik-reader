const colors = require("tailwindcss/colors");

module.exports = {
	mode: "jit",
	purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	darkMode: false, // or 'media' or 'class'
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
	plugins: [],
};
