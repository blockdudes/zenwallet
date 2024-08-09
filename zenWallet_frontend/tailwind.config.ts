import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        floatUp: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-40px)' }, // Increased from -20px to -40px
        },
        floatDown: {
          '0%, 100%': { transform: 'translateY(-40px)' }, // Increased from -20px to -40px
          '50%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        floatUp: 'floatUp 5s ease-in-out infinite',
        floatDown: 'floatDown 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;