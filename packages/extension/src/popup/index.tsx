import '../_global.scss'
import './_index.scss'

import { initGa } from '../helper'
import { Popup } from './Components'
import { render } from 'solid-js/web'

initGa()
ga('send', 'pageview', 'popup')

render(Popup, document.body)
