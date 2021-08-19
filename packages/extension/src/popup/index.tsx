import '../_global.scss'
import './_index.scss'

import { initGa } from '../helper'
import { Popup } from './Components'
import { render } from 'solid-js/web'
import { CurrentDataProvider } from './Helpers'

const App = () => (
  <CurrentDataProvider value={[]}>
    <Popup />
  </CurrentDataProvider>
)

render(App, document.body)
initGa()
ga('send', 'pageview', 'popup')
