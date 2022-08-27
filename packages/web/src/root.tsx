// @refresh reload
import { Routes } from '@solidjs/router'
import { Suspense } from 'solid-js'
import { ErrorBoundary } from 'solid-start/error-boundary'
import { Body, FileRoutes, Head, Html, Scripts, Title } from 'solid-start'

import '@unocss/reset/tailwind.css'
import 'uno.css'
import './root.scss'
import { Footer, Header, MetaSeo } from '~/components'

export default function Root() {
  return (
    <Html lang='en' class='dark'>
      <Head>
        <Title></Title>
        <MetaSeo />
      </Head>
      <Body class='bg-gray-900 dark:prose-invert prose-zinc flex flex-col'>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <ErrorBoundary>
          <Header />
          <Suspense>
            <main class='flex-grow'>
              <Routes>
                <FileRoutes />
              </Routes>
            </main>
          </Suspense>
        </ErrorBoundary>
        <Footer />
        <Scripts />
      </Body>
    </Html>
  )
}
