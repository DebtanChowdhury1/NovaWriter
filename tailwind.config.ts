import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        "nova-light": {
          primary: "#4c53ff",
          "primary-content": "#f5f7ff",
          secondary: "#22c55e",
          "secondary-content": "#022c22",
          accent: "#f97316",
          neutral: "#1f2937",
          "base-100": "#ffffff",
          "base-200": "#f3f4f6",
          "base-300": "#e5e7eb",
          info: "#0ea5e9",
          success: "#10b981",
          warning: "#facc15",
          error: "#ef4444",
        },
      },
      {
        "nova-dark": {
          primary: "#6366f1",
          "primary-content": "#f5f7ff",
          secondary: "#34d399",
          "secondary-content": "#022c22",
          accent: "#fb923c",
          neutral: "#111827",
          "base-100": "#0f172a",
          "base-200": "#111c32",
          "base-300": "#1f2937",
          info: "#38bdf8",
          success: "#22c55e",
          warning: "#facc15",
          error: "#f87171",
        },
      },
      "business",
    ],
  },
};

export default config;
