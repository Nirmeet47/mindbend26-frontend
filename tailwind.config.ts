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
        mindbend: {
          black: "#050505", // Deep dark background
          darkBlue: "#0a0f1c", // Secondary dark
          neon: "#00f3ff", // Radium Cyan/Blue
          accent: "#2D5BFF", // Deep Navy Blue
        },
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      },
      animation: {
        scanline: 'scanline 2.5s linear infinite',
      },
      fontFamily: {
        orbitron: ['var(--font-orbitron)'], // You should load this font in layout.tsx
      },
    },
  },
  
  plugins: [],
};
export default config;