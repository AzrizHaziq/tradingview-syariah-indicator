import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import WindiCSS from "vite-plugin-windicss";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    solidPlugin({ ssr: true }),
    WindiCSS({
      scan: {
        include: ["index.html"],
        dirs: ["src", "components"],
        exclude: ["node_modules", ".git"],
      },
    }),
  ],
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
  },
});
