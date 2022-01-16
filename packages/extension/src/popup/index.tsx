import 'windi.css'
import '../_global.scss'
import './_index.scss'

import { initGa } from '@src/helper'
import { Popup } from '@popup/Components'
import { render } from 'solid-js/web'
import browser from 'webextension-polyfill'
import { CurrentDataProvider } from '@popup/popup-helpers'

const App = () => (
  <CurrentDataProvider value={[]}>
    <Popup />
  </CurrentDataProvider>
)

render(App, document.body)
initGa()
ga('send', 'pageview', 'popup')

browser.runtime.onMessage.addListener((req: TSI.EVENT_MSG) => {
  console.log(req, 'in popup')
  if (req.type === 'ga-popup') {
    if (req.subType === 'pageview') {
      ga('send', 'pageview', req.payload)
    }

    if (req.subType === 'event') {
      ga('send', {
        hitType: 'event',
        ...(req.payload as { eventCategory: string; eventAction: string; eventLabel?: string }),
      })
    }
  }
})
