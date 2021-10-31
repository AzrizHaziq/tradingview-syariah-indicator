import { IMGS } from '@util'
import { PageContext } from './types'
import { PageLayout } from './PageLayout'
import { PageContextProvider } from './usePageContext'
import { description, name_display } from '../../../package.json'
import { generateHydrationScript, renderToString } from 'solid-js/web'
import { dangerouslySkipEscape, escapeInject } from 'vite-plugin-ssr'

// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ['pageProps', 'documentProps']

export function render(pageContext: PageContext) {
  const { Page, pageProps } = pageContext

  const pageHtml = renderToString(() => (
    <PageContextProvider pageContext={pageContext}>
      <PageLayout>
        <Page {...pageProps} />
      </PageLayout>
    </PageContextProvider>
  ))

  // See https://vite-plugin-ssr.com/html-head
  const { documentProps } = pageContext
  const title = (documentProps && documentProps.title) || name_display
  const descriptions = (documentProps && documentProps.description) || description

  return escapeInject`<!DOCTYPE html>
    <html lang="en" class="dark">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${IMGS.logo}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${descriptions}" />
        <title>${title}</title>
        ${dangerouslySkipEscape(generateHydrationScript())}
      </head>
      <body class="bg-gray-900">
        <div id="tsi-web">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
