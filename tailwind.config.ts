import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF9F6",
        pearl: "#F4F2EE",
        mint: {
          50: "#F1FBF6",
          100: "#DFF6EA",
          300: "#A9E6C6",
          500: "#5FCB93",
          600: "#3FAE79"
        },
        indigo: {
          50: "#F0F1FE",
          100: "#E1E3FD",
          300: "#B4B8F8",
          500: "#6C71E8",
          600: "#5457C9"
        },
        sky: {
          50: "#F0FAFE",
          100: "#DFF3FC"
        }
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(84, 87, 201, 0.15)",
        card: "0 8px 30px -10px rgba(30, 30, 60, 0.08)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        shimmer: "shimmer 1.6s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
