import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import WindiCSS from 'vite-plugin-windicss'
import ssr from 'vite-plugin-ssr/plugin'

export default defineConfig({
  plugins: [
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
})
