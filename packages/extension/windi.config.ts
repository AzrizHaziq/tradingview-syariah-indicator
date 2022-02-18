import { defineConfig } from "windicss/helpers";

export default defineConfig({
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
  extract: {
    // A common use case is scanning files from the root directory
    include: ["**/*.{js,jsx,ts,tsx,html}"],
    // if you are excluding files, make sure you always include node_modules and .git
    exclude: ["node_modules", ".git", "dist", "e2e"],
  },
});
