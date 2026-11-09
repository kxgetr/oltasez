import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FAFBFC",
        surface: "#FFFFFF",
        frost: {
          DEFAULT: "#E9EEF5",
          translucent: "rgba(233, 238, 245, 0.72)",
        },
        ink: {
          DEFAULT: "#111827",
          secondary: "#475569",
          muted: "#64748B",
          faint: "#94A3B8",
        },
        border: {
          subtle: "#E2E8F0",
          fine: "#CBD5E1",
        },
        accent: {
          DEFAULT: "#315FF4",
          light: "#EEF2FF",
          muted: "#4338CA",
          hover: "#254EDB",
        },
        alert: {
          DEFAULT: "#E46655",
          light: "#FEF2F2",
          border: "#FCA5A5",
        },
        safe: {
          DEFAULT: "#10B981",
          light: "#ECFDF5",
          border: "#A7F3D0",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FFFBEB",
          border: "#FDE68A",
        },
      },
      fontFamily: {
        sans: [
          "Geist",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(17, 24, 39, 0.04), 0 1px 2px rgba(17, 24, 39, 0.02)",
        elevated: "0 4px 16px rgba(17, 24, 39, 0.04), 0 1px 2px rgba(17, 24, 39, 0.02)",
        dropdown: "0 10px 25px -5px rgba(17, 24, 39, 0.08), 0 8px 10px -6px rgba(17, 24, 39, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
