import { PageContext } from './types'
import { IMGS } from '@util'
import { PageLayout } from './PageLayout'
import { PageContextProvider } from './usePageContext'
import { generateHydrationScript, renderToString } from 'solid-js/web'
import { dangerouslySkipEscape, escapeInject } from 'vite-plugin-ssr'
import { description, name_display as title, homepage as domain } from '../../../package.json'

// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ['pageProps', 'documentProps']

const SEO = {
  title,
  description,
  domain,
  type: 'website',
  locale: 'en_us',
  site_name: 'Azriz Haziq',
  image: {
    url: `${domain}/tradingview-shariah-indicator.jpg`,
    alt: 'About Azriz haziq',
  },
  twitter: {
    handle: '@azrizhaziq',
    cardType: 'summary_large_image',
  },
} as const

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
  const { documentProps } = pageContext.pageExports
  const title = documentProps?.title ?? SEO.title
  const description = documentProps?.description ?? SEO.description
  const fullUrl = `${domain}${pageContext.urlParsed.pathname}`

  return escapeInject`<!DOCTYPE html>
    <html lang="en" class="dark">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${IMGS.logo}" />

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${description}" />
    
        <meta property='og:title' content=${title} />
        <meta property='og:type' content="website"/>
        <meta property='og:url' content="${fullUrl}" />
        <meta property='og:image' content="${SEO.image.url}" />
        <meta property='og:image:alt' content="tradingview shariah indicator" />

        <meta property='og:site_name' content="${SEO.site_name}" />
        <meta property='og:description' content="${description}" />
        <meta property='og:locale' content="${SEO.locale}" />

        <meta name='twitter:title' content="${title}" />
        <meta property='twitter:url' content="${fullUrl}" />
        <meta name='twitter:card' content="${SEO.twitter.cardType}" />
        <meta name='twitter:site' content="${SEO.twitter.handle}" />
        <meta name='twitter:description' content="${description}" />
        <meta name='twitter:image' content="${SEO.image.url} " />
        <title>${title}</title>
        ${dangerouslySkipEscape(generateHydrationScript())}
      </head>
      <body class="bg-gray-900">
        <div id="tsi-web">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
