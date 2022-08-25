import solid from 'solid-start/vite'
import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'
import { presetTypography, presetUno } from 'unocss'
import transformerDirective from '@unocss/transformer-directives'

export default defineConfig({
  plugins: [
    Unocss({
      transformers: [transformerDirective({ throwOnMissing: true })],
      presets: [
        presetTypography({
          cssExtend: {
            code: {
              color: '#114f2d',
              background: '#7ee2a8 !important',
              'border-radius': '0.25rem',
            },
            'a:hover': {
              color: '#7ee2a8',
            },
            'a:visited': {
              color: '#14b8a6',
            },
          },
        }),
        presetUno({ dark: 'class' }),
      ],
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
