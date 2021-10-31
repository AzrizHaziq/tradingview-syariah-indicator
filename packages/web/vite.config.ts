import { defineConfig } from 'vite'
import ssr from 'vite-plugin-ssr/plugin'
import solidPlugin from 'vite-plugin-solid'
import WindiCSS from 'vite-plugin-windicss'
import tsconfigPaths from 'vite-tsconfig-paths'

// const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    solidPlugin({ ssr: true }),
    ssr(),
    WindiCSS({
      scan: {
        dirs: ['pages', 'renderer', 'server'],
        exclude: ['node_modules', '.git'],
      },
    }),
  ],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
  // envDir: isProd ? '.env.production' : '.env',
})
