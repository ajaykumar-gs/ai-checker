import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        paper: "var(--paper)",
        surface: "var(--surface)",
        border: "var(--border)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        muted: "var(--muted)",
        primary: {
          DEFAULT: "var(--primary)",
          deep: "var(--primary-deep)",
          400: "var(--primary-400)",
          200: "var(--primary-200)",
          50: "var(--primary-50)",
        },
        accent: "var(--accent)",
        score: {
          human: "var(--score-human)",
          mixed: "var(--score-mixed)",
          ai: "var(--score-ai)",
          "ai-soft": "var(--score-ai-soft)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
