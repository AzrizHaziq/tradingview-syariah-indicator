import solid from 'solid-start/vite'
import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'
import { presetTypography, presetUno } from 'unocss'
import transformerDirective from '@unocss/transformer-directives'

export default defineConfig({
  plugins: [
    Unocss({
      transformers: [transformerDirective({ throwOnMissing: true })],
      presets: [presetTypography(), presetUno({ dark: 'class' })],
    }),
    // @ts-ignore
    {
      ...(await import('@mdx-js/rollup')).default({
        jsx: true,
        jsxImportSource: 'solid-js',
        providerImportSource: 'solid-mdx',
      }),
      enforce: 'pre',
    },
    solid({
      extensions: ['.mdx', '.md'],
    }),
  ],
  build: {
    target: 'esnext',
    // polyfillDynamicImport: false,
  },
})
