import { defineConfig } from "vite-plugin-windicss";
import typography from "windicss/plugin/typography";

export default defineConfig({
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: "#2ECC71",
          50: "#E6F9EE",
          100: "#D1F5E0",
          200: "#A8EBC4",
          300: "#7EE2A8",
          400: "#54D98C",
          500: "#2ECC71",
          600: "#25A25A",
          700: "#1B7943",
          800: "#124F2C",
          900: "#082615",
        },
      },
    },
  },
  plugins: [typography({ dark: true })],
});
