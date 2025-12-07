import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // aqui tu coloca tuas cores padrão
        primary: "#1D4ED8",
        primaryDark: "#1E40AF",
        secondary: "#F97316",
        background: "#F9FAFB",
        foreground: "#111827",
      },
    },
  },
  plugins: [],
};

export default config;
