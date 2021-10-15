import { PageContext } from './types'
import { PageLayout } from './PageLayout'
import logo from '../../../assets/shariah-icon.svg'
import { generateHydrationScript, renderToString } from 'solid-js/web'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'
import packageJson from '../../../package.json'

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
  const title = (documentProps && documentProps.title) || packageJson.name_display
  const description = (documentProps && documentProps.description) || packageJson.description

  return escapeInject`<!DOCTYPE html>
    <html lang="en" class="dark">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logo}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${description}" />
        <title>${title}</title>
        ${dangerouslySkipEscape(generateHydrationScript())}
      </head>
      <body class="bg-gray-900">
        <div id="tsi-web">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
