import type { Config } from "tailwindcss";

const config = {
  content: ["./index.html", "./src/renderer/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        "surface-strong": "hsl(var(--surface-strong))",
        muted: "hsl(var(--muted))",
        border: "hsl(var(--border))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        signal: "hsl(var(--signal))",
        "signal-foreground": "hsl(var(--signal-foreground))"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"]
      },
      borderRadius: {
        shell: "var(--radius-shell)",
        panel: "var(--radius-panel)",
        control: "var(--radius-control)"
      },
      boxShadow: {
        panel: "var(--shadow-panel)",
        lift: "var(--shadow-lift)"
      }
    }
  },
  plugins: []
} satisfies Config;

export default config;
