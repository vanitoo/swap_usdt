import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 60px rgba(57, 255, 164, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
