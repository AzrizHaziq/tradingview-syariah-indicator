import '../_global.scss'
import './_index.scss'

import { initGa } from '../helper'
import { Popup } from './Components'

initGa()
ga('send', 'pageview', 'popup')

import { render } from 'solid-js/web'
import { CounterProvider, useCounter } from './Helpers/popup.store'

const NestedComponent = () => {
  const [count, { increment, decrement }] = useCounter()
  return (
    <>
      <p>{count()} asdasd</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </>
  )
}

const App = () => (
  <CounterProvider count={7}>
    <NestedComponent />
    <Popup />
  </CounterProvider>
)

render(App, document.body)
