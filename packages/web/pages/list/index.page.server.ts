import fetch from 'node-fetch'

export const doNotPrerender = true

export async function onBeforeRender(pageContext) {
  const res = await fetch(import.meta.env.VITE_FETCH_URL)
  const { data, metadata } = await res.json()

  return {
    pageContext: {
      pageProps: { data, metadata },
    },
  }
}
