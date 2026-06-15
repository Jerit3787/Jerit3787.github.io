/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,html,js}", "./_site/**/*.html"],
  darkMode: "class",
  safelist: ["animated", "light-theme", "nav-open", "is-visible", "js"],
  theme: {
    extend: {
      // Greyscale palette driven by CSS variables (see src/styles/main.css).
      // The variables flip between the dark and light themes, so every
      // token below automatically switches with the theme toggle.
      colors: {
        surface: "rgb(var(--surface) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        elevated: "rgb(var(--elevated) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        accent: "rgb(var(--fg) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
        mono: ["'Anonymous Pro'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 14px 44px -20px rgba(0, 0, 0, 0.55)",
        card: "0 18px 50px -28px rgba(0, 0, 0, 0.6)",
      },
      keyframes: {
        fadeRise: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeRise: "fadeRise 0.6s ease forwards",
      },
    },
  },
  plugins: [],
};
