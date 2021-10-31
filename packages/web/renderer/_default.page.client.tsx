import 'virtual:windi.css'
import 'virtual:windi-devtools'
import './PageLayout.scss'

import { trackOnLoad } from '@util'
import { PageContext } from './types'
import { PageLayout } from './PageLayout'
import { hydrate, render } from 'solid-js/web'
import { PageContextProvider } from './usePageContext'
import { useClientRouter } from 'vite-plugin-ssr/client/router'
import { PageContextBuiltInClient } from 'vite-plugin-ssr/dist/cjs/types'

let dispose: () => void

const { hydrationPromise } = useClientRouter({
  render(pageContext: PageContextBuiltInClient & PageContext) {
    trackOnLoad({
      href: location.href,
      path: location.pathname,
      title: `web::${location.pathname.replace(/\//, '')}`,
    })

    const content = document.getElementById('tsi-web')
    const { Page, pageProps } = pageContext

    // Dispose to prevent duplicate pages when navigating.
    if (dispose) dispose()

    // Render the page
    if (pageContext.isHydration) {
      // This is the first page rendering; the page has been rendered to HTML
      // and we now make it interactive.
      dispose = hydrate(
        () => (
          <PageContextProvider pageContext={pageContext}>
            <PageLayout>
              <Page {...pageProps} />
            </PageLayout>
          </PageContextProvider>
        ),
        content!
      )
    } else {
      // Render new page
      render(
        () => (
          <PageContextProvider pageContext={pageContext}>
            <PageLayout>
              <Page {...pageProps} />
            </PageLayout>
          </PageContextProvider>
        ),
        content!
      )
    }
  },
  onTransitionStart,
  onTransitionEnd,
})

hydrationPromise.then((s) => {
  console.log('Hydration finished; page is now interactive.')
})

function onTransitionStart() {
  console.log('Page transition start')
}

function onTransitionEnd() {
  console.log('Page transition end')
}
