import { Component } from 'solid-js'
import type { PageContextBuiltIn } from 'vite-plugin-ssr/types'

export type PageProps = Record<string, unknown>
export type PageContext = PageContextBuiltIn & {
  Page: (pageProps: PageProps) => Component
  pageProps: PageProps
  pageExports: {
    documentProps: {
      title?: string
      description?: string
    }
  }
}
