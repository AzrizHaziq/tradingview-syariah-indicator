import React from 'react'
import { render } from 'react-dom'

import '../_global.scss'
import Popup from './Popup/Popup'

render(<Popup />, window.document.querySelector('#root'))

// if (module.hot) module.hot.accept()
