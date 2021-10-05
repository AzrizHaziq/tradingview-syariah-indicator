import { Component } from 'solid-js'
import { Counter } from './Counter'

const Page: Component = () => {
  return (
    <>
      <h1>Welcome</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
      <div class='bg-blue-500 hover:(bg-gray-800 font-medium text-white)'>asdasdasd</div>
    </>
  )
}

export { Page }
