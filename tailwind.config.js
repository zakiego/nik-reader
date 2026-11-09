/** @type {import('tailwindcss').Config} */

/** A color role stored as OKLCH channels in styles/globals.css. */
const role = (name) => `oklch(var(--${name}) / <alpha-value>)`;

module.exports = {
  // Dark follows the system setting; the tokens swap in styles/globals.css.
  darkMode: "media",
  // `hover:` only applies where the pointer can hover, so a tap on a phone
  // doesn't leave a button stuck in its hover state.
  future: { hoverOnlyWhenSupported: true },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: role("background"),
        foreground: role("foreground"),
        card: {
          DEFAULT: role("card"),
          foreground: role("card-foreground"),
        },
        popover: {
          DEFAULT: role("popover"),
          foreground: role("popover-foreground"),
        },
        primary: {
          DEFAULT: role("primary"),
          foreground: role("primary-foreground"),
        },
        secondary: {
          DEFAULT: role("secondary"),
          foreground: role("secondary-foreground"),
        },
        muted: {
          DEFAULT: role("muted"),
          foreground: role("muted-foreground"),
        },
        accent: {
          DEFAULT: role("accent"),
          foreground: role("accent-foreground"),
        },
        destructive: {
          DEFAULT: role("destructive"),
          foreground: role("destructive-foreground"),
        },
        border: role("border"),
        input: role("input"),
        ring: role("ring"),
      },
      // One radius scale: 6px chips and slots, 12px controls, 16px panels.
      borderRadius: {
        sm: "0.375rem",
        md: "0.375rem",
        lg: "0.75rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        "in-out": "var(--ease-in-out)",
      },
      keyframes: {
        // A result row or panel arriving.
        "rise-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fade: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        // A button label swapping state (Salin -> Tersalin).
        "swap-in": {
          from: { opacity: "0", transform: "scale(0.9)", filter: "blur(2px)" },
          to: { opacity: "1", transform: "scale(1)", filter: "blur(0)" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "rise-in": "rise-in var(--duration-base) var(--ease-out) both",
        fade: "fade var(--duration-base) var(--ease-out) both",
        "swap-in": "swap-in var(--duration-fast) var(--ease-out) both",
        "caret-blink": "caret-blink 1.1s ease-out infinite",
        "accordion-down": "accordion-down 200ms var(--ease-out)",
        "accordion-up": "accordion-up 160ms var(--ease-out)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
