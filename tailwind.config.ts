import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#000000",
          800: "#07090a",
          700: "#0b0f10",
          600: "#111617",
          500: "#1a2122"
        },
        neon: {
          50: "#e9ffea",
          100: "#b6ffbe",
          200: "#7cff8c",
          300: "#3dff5b",
          400: "#15ff3b",
          500: "#00e635",
          600: "#00b528",
          700: "#008a20",
          800: "#006519"
        }
      },
      fontFamily: {
        display: ["'Orbitron'", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["'Rajdhani'", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        neon: "0 0 8px rgba(0,230,53,.55), 0 0 24px rgba(0,230,53,.35)",
        neonSoft: "0 0 4px rgba(0,230,53,.35), 0 0 14px rgba(0,230,53,.2)",
        neonInset: "inset 0 0 8px rgba(0,230,53,.4)"
      },
      keyframes: {
        flicker: {
          "0%,19%,21%,23%,25%,54%,56%,100%": { opacity: "1", filter: "drop-shadow(0 0 6px #00e635)" },
          "20%,24%,55%": { opacity: "0.6", filter: "drop-shadow(0 0 2px #00e635)" }
        },
        scan: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 8px rgba(0,230,53,.4), 0 0 20px rgba(0,230,53,.25)" },
          "50%": { boxShadow: "0 0 14px rgba(0,230,53,.7), 0 0 32px rgba(0,230,53,.45)" }
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" }
        }
      },
      animation: {
        flicker: "flicker 3s infinite",
        scan: "scan 2.5s linear infinite",
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
        marquee: "marquee 30s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
