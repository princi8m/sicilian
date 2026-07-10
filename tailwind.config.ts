import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:             "#211c19",
        surface:        "#2a2420",
        rule:           "#3c352e",
        "text-primary": "#ece5da",
        "text-muted":   "#b0a599",
        accent:         "#e0b75c",
        "accent-light": "#eecb84",
        "accent-dim":   "#a67a28",
        "wine-red":     "#d5555f",
        // backward-compat aliases
        panel:          "#2a2420",
        ink:            "#1a1613",
        star:           "#e0b75c",
        // light "paper" band — used sparingly for CTA sections on an
        // otherwise dark site
        paper:          "#faf9f6",
        "paper-raised": "#f2f0eb",
        "paper-ink":    "#221e1b",
        "paper-muted":  "#6b625a",
        "paper-rule":   "rgba(34,30,27,0.14)",
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
