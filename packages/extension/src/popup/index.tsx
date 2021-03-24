import React from 'react'
import { render } from 'react-dom'

import '../_global.scss'
import './_index.scss'
import Popup from './Popup/Popup'
import { GA } from '../helper'

render(<Popup />, window.document.querySelector('#root'))
;(function (i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r
  ;(i[r] =
    i[r] ||
    function () {
      ;(i[r].q = i[r].q || []).push(arguments)
    }),
    // @ts-ignore
    (i[r].l = 1 * new Date())
  ;(a = s.createElement(o)), (m = s.getElementsByTagName(o)[0])
  a.async = 1
  a.src = g
  m.parentNode.insertBefore(a, m)
})(window, document, 'script', `https://www.google-analytics.com/analytics.js?id=${GA}`, 'ga')
ga('create', GA, 'auto')
ga('set', 'checkProtocolTask', function () {})
ga('send', 'pageview', 'popup')
