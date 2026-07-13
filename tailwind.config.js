/** @type {import('tailwindcss').Config} */
module.exports = {
  // Light theme only. `dark:` variants never activate from the OS setting.
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic tokens driven by CSS variables (see styles/globals.css).
        // Channels are stored as OKLCH "L C H" so Tailwind's /opacity modifiers work.
        bg: "oklch(var(--color-bg) / <alpha-value>)",
        surface: "oklch(var(--color-surface) / <alpha-value>)",
        "surface-2": "oklch(var(--color-surface-2) / <alpha-value>)",
        line: "oklch(var(--color-border) / <alpha-value>)",
        content: "oklch(var(--color-text) / <alpha-value>)",
        muted: "oklch(var(--color-muted) / <alpha-value>)",
        faint: "oklch(var(--color-faint) / <alpha-value>)",
        primary: {
          DEFAULT: "oklch(var(--color-primary) / <alpha-value>)",
          hover: "oklch(var(--color-primary-hover) / <alpha-value>)",
          fg: "oklch(var(--color-primary-fg) / <alpha-value>)",
        },
        success: "oklch(var(--color-success) / <alpha-value>)",
        danger: "oklch(var(--color-danger) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        "in-out": "var(--ease-in-out)",
      },
      boxShadow: {
        card: "0 1px 2px 0 oklch(0.208 0.042 265.755 / 0.04), 0 12px 32px -16px oklch(0.208 0.042 265.755 / 0.14)",
        panel:
          "0 1px 0 0 oklch(1 0 0 / 0.04) inset, 0 30px 60px -28px oklch(0.13 0.028 261.7 / 0.65)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.28s var(--ease-out) both",
        "fade-up": "fade-up 0.5s var(--ease-out) both",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
