import { Component, For, createMemo } from 'solid-js'

type PageProps = {
  data: [exchnage: string, code: string, name: string][]
  metadata: Record<string, Date>
}

const staticExchangeColors = [
  'text-red-500 bg-red-100 border-red-500',
  'text-yellow-500 bg-yellow-200 border-yellow-500',
  'text-blue-500 bg-blue-200 border-blue-500',
  'text-green-700 bg-green-200 border-green-700',
  'text-pink-500 bg-pink-200 border-pink-500',
  'text-indigo-500 bg-indigo-200 border-indigo-500',
  'text-gray-900 bg-gray-100 border-gray-900',
]

export const Page: Component = (pageProps: PageProps) => {
  const { data, metadata } = pageProps

  const exchangeStyle = Object.keys(metadata).reduce((acc, key, i) => {
    return { ...acc, [key]: staticExchangeColors[i % staticExchangeColors.length] }
  }, {})

  return (
    <>
      <ul class='space-y-1'>
        <For each={data}>
          {([exchange, code, name]) => (
            <li>
              <a class='flex group' href={`https://www.tradingview.com/symbols/${exchange}-${code}`} target='_blank'>
                <p class='text-white opacity-80 group-hover:opacity-100'>{name}</p>
                {exchange && (
                  <span
                    class='text-sm py-1 px-2 border rounded ml-auto opacity-80 group-hover:opacity-100'
                    className={`${exchangeStyle[exchange]}`}>
                    {exchange}-{code}
                  </span>
                )}
              </a>
            </li>
          )}
        </For>
      </ul>
    </>
  )
}

// export async function prerender() {
//   return
// }
