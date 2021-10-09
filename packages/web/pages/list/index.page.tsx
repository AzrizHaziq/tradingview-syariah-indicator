import './index.css'
import { Component } from 'solid-js'

export const Page: Component = pageProps => {
  console.log(pageProps, 111)

  return (
    <>
      <h1>About</h1>
      <p>A colored page.</p>
    </>
  )
}

export async function prerender() {
  return
}
