import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#030712", // Derin gece mavisi / siyah
        surface: {
          DEFAULT: "#0b1220",
          muted: "#0f172a",
          border: "#1e293b",
          highlight: "#1e2c47",
        },
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          DEFAULT: "#14b8a6", // Turkuaz vurgu
          accent: "#0ea5e9", // Siber gök mavisi
        },
        status: {
          safe: {
            bg: "rgba(16, 185, 129, 0.1)",
            border: "rgba(16, 185, 129, 0.3)",
            text: "#34d399",
            glow: "rgba(16, 185, 129, 0.25)",
          },
          suspicious: {
            bg: "rgba(245, 158, 11, 0.1)",
            border: "rgba(245, 158, 11, 0.35)",
            text: "#fbbf24",
            glow: "rgba(245, 158, 11, 0.25)",
          },
          phishing: {
            bg: "rgba(239, 68, 68, 0.12)",
            border: "rgba(239, 68, 68, 0.4)",
            text: "#f87171",
            glow: "rgba(239, 68, 68, 0.3)",
          },
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        "cyber-sm": "0 0 15px -3px rgba(20, 184, 166, 0.15)",
        "cyber-glow": "0 0 35px -5px rgba(20, 184, 166, 0.3)",
        "cyber-blue": "0 0 35px -5px rgba(14, 165, 233, 0.3)",
        "cyber-danger": "0 0 35px -5px rgba(239, 68, 68, 0.3)",
        "card-glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
