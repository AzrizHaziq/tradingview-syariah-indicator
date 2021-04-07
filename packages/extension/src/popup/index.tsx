import React from 'react'
import { render } from 'react-dom'

import '../_global.scss'
import './_index.scss'
import { Popup } from './Components'
import { initGa } from '../helper'

initGa()
ga('send', 'pageview', 'popup')
render(<Popup />, window.document.querySelector('#root'))
