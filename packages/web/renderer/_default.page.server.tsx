import { generateHydrationScript, renderToString } from 'solid-js/web'
import { PageLayout } from './PageLayout'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'
import { PageContext } from './types'
import logoUrl from './logo.svg'

// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ['pageProps', 'documentProps']

export function render(pageContext: PageContext) {
  const { Page, pageProps } = pageContext

  const pageHtml = renderToString(() => (
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>
  ))

  // See https://vite-plugin-ssr.com/html-head
  const { documentProps } = pageContext
  const title = (documentProps && documentProps.title) || 'Vite SSR app'
  const description = (documentProps && documentProps.description) || 'App using Vite + vite-plugin-ssr'

  return escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${description}" />
        <title>${title}</title>
        ${dangerouslySkipEscape(generateHydrationScript())}
      </head>
      <body>
        <div id="tsi-web">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
