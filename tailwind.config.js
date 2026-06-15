/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,html,js}", "./_site/**/*.html"],
  darkMode: ["class", ".light-theme"],
  safelist: ["animated", "light-theme", "nav-open"],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#2196f3",
          soft: "#64b5f6",
          deep: "#1565c0",
        },
        ink: {
          900: "#0c0e12",
          800: "#111419",
          700: "#171b22",
          600: "#1f242d",
        },
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
        mono: ["'Anonymous Pro'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 18px 50px -24px rgba(33, 150, 243, 0.55)",
        card: "0 24px 60px -32px rgba(0, 0, 0, 0.85)",
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(135deg, #2196f3 0%, #1565c0 100%)",
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
