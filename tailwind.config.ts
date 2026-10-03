import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:             "rgb(var(--c-bg) / <alpha-value>)",
        surface:        "rgb(var(--c-surface) / <alpha-value>)",
        rule:           "rgb(var(--c-rule) / <alpha-value>)",
        "text-primary": "rgb(var(--c-text-primary) / <alpha-value>)",
        "text-muted":   "rgb(var(--c-text-muted) / <alpha-value>)",
        accent:         "rgb(var(--c-accent) / <alpha-value>)",
        "accent-light": "rgb(var(--c-accent-light) / <alpha-value>)",
        "accent-dim":   "rgb(var(--c-accent-dim) / <alpha-value>)",
        "wine-red":     "rgb(var(--c-wine-red) / <alpha-value>)",
        // backward-compat aliases
        panel:          "rgb(var(--c-panel) / <alpha-value>)",
        ink:            "rgb(var(--c-ink) / <alpha-value>)",
        star:           "rgb(var(--c-star) / <alpha-value>)",
        // light "paper" band — used sparingly for CTA sections on an
        // otherwise dark site
        paper:          "rgb(var(--c-paper) / <alpha-value>)",
        "paper-raised": "rgb(var(--c-paper-raised) / <alpha-value>)",
        "paper-ink":    "rgb(var(--c-paper-ink) / <alpha-value>)",
        "paper-muted":  "rgb(var(--c-paper-muted) / <alpha-value>)",
        "paper-rule":   "rgba(34,30,27,0.14)",
      },
      textColor: {
        accent: "rgb(var(--c-accent-fg) / <alpha-value>)",
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%":   { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      fontFamily: {
        sans:    ["var(--font-dm-sans)",  "system-ui", "sans-serif"],
        display: ["var(--font-abril)",    "Georgia",   "serif"],
        serif:   ["var(--font-newsreader)", "Georgia", "serif"],
        mono:    ["var(--font-space-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
