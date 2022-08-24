// @refresh reload
import { Routes } from '@solidjs/router'
import { Suspense } from 'solid-js'
import { ErrorBoundary } from 'solid-start/error-boundary'
import { Body, FileRoutes, Head, Html, Meta, Scripts, Title } from 'solid-start'
import 'uno.css'
import './root.scss'
import { Footer, Header } from '~/components'

export default function Root() {
  return (
    <Html lang='en'>
      <Head>
        <Meta charset='utf-8' />
        <Meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta name='theme-color' content='#7ee2a8' />
        <link rel='icon' href='/favicon.svg' />
        <Title>Tradingview Shariah Indicator - TSI</Title>
        <Meta
          name='description'
          content='Add a small green indicator in tradingview.com. At the moment, only cover Malaysia, NYSE, Nasdaq, Shenzhen, Shanghai, Indonesia'
        />

        <Meta property='og:title' content='Tradingview Shariah Indicator - TSI' />
        <Meta property='og:type' content='website' />
        <Meta property='og:url' content='https://tsi.azrizhaziq.com' />
        <Meta property='og:image' content='https://tsi.azrizhaziq.com/tradingview-shariah-indicator.jpg' />
        <Meta property='og:image:alt' content='tradingview shariah indicator' />
        <Meta property='og:site_name' content='Tradingview Shariah Indicator - TSI' />
        <Meta
          property='og:description'
          content='Add a small green indicator in tradingview.com. At the moment, only cover Malaysia, NYSE, Nasdaq, Shenzhen, Shanghai, Indonesia'
        />
        <Meta property='og:locale' content='en_us' />

        <Meta name='twitter:title' content='Tradingview Shariah Indicator - TSI' />
        <Meta property='twitter:url' content='https://tsi.azrizhaziq.com' />
        <Meta name='twitter:card' content='@azrizhaziq' />
        <Meta name='twitter:site' content='summary_large_image' />
        <Meta
          name='twitter:description'
          content='Add a small green indicator in tradingview.com. At the moment, only cover Malaysian, NYSE, Nasdaq, Shenzhen, Shanghai, Indonesia'
        />
        <Meta name='twitter:image' content='https://tsi.azrizhaziq.com/tradingview-shariah-indicator.jpg' />
      </Head>
      <Body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <ErrorBoundary>
          <Header />
          <a href='/'>Index</a>
          <Suspense>
            <main>
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
