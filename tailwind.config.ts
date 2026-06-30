import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: { glow: "0 0 60px rgba(57, 255, 164, 0.18)" },
      animation: { float: "float 7s ease-in-out infinite" },
      keyframes: {
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } },
      },
    },
  },
  plugins: [],
};
export default config;
