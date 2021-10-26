import fetch from 'node-fetch'

export const doNotPrerender = true

export async function onBeforeRender(pageContext) {
  const res = await fetch(import.meta.env.VITE_FETCH_URL)
  const { data, metadata } = await res.json()

  // input: '/list?exchange=MYX&q=TSLA&exchange=NYSE&exchange=NASDAQ'
  // output: { exchange: [ 'MYX', 'NYSE', 'NASDAQ' ], q: 'TSLA' }
  const queryParams = pageContext.url
    .replace(/\/list(\?)?/g, '')
    .split('&')
    .reduce((acc, i) => {
      const [key, value] = i.split('=')
      return acc.hasOwnProperty(key)
        ? Array.isArray(acc[key])
          ? { ...acc, [key]: [...acc[key], value] }
          : { ...acc, [key]: [acc[key], value] }
        : { ...acc, [key]: value }
    }, {})

  return {
    pageContext: {
      pageProps: {
        data,
        metadata,
        queryParams,
        exchangesList: Array.isArray(queryParams.exchange)
          ? queryParams.exchange
          : typeof queryParams.exchange === 'string'
          ? [queryParams.exchange]
          : Object.keys(metadata),
      },
    },
  }
}
