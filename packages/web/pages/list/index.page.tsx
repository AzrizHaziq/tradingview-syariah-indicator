import { isServer } from 'solid-js/web'
import { JSX, Show, createSignal, createEffect } from 'solid-js'
import { VirtualContainer } from '@minht11/solid-virtual-container'
import { createMediaQuery } from '../../lib'

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

const ListItem = props => {
  const [exchange, code, name] = props.item
  // if (code === 'MMM') {
  //   console.log(props.item, exchange, props.exchangeColor)
  // }

  return (
    <div style={props.style} class='absolute top-0 left-0 w-full' tabIndex={props.tabIndex} role='listitem'>
      <div class='flex group items-center gap-x-1'>
        <p class='text-white opacity-80 group-hover:opacity-100 overflow-ellipsis overflow-hidden'>
          <span class='inline sm:hidden mr-2'>{exchange} </span>
          {name}
        </p>
        <a target='_blank' href={`https://www.tradingview.com/symbols/${exchange}-${code}`}>
          <svg
            stroke='currentColor'
            stroke-width='0'
            class='fill-current text-gray-300 hover:text-green-200'
            viewBox='0 0 1024 1024'
            height='1em'
            width='1em'
            xmlns='http://www.w3.org/2000/svg'>
            <path d='M574 665.4a8.03 8.03 0 0 0-11.3 0L446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3l-39.8-39.8a8.03 8.03 0 0 0-11.3 0L191.4 526.5c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3L574 665.4zm258.6-474c-84.6-84.6-221.5-84.6-306 0L410.3 307.6a8.03 8.03 0 0 0 0 11.3l39.7 39.7c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204L665.3 562.6a8.03 8.03 0 0 0 0 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c84.5-84.6 84.5-221.5 0-306.1zM610.1 372.3a8.03 8.03 0 0 0-11.3 0L372.3 598.7a8.03 8.03 0 0 0 0 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l226.4-226.4c3.1-3.1 3.1-8.2 0-11.3l-39.5-39.6z' />
          </svg>
        </a>

        {exchange && (
          <Show when={exchange}>
            <span
              class='hidden sm:block text-sm py-1 px-2 border rounded ml-auto opacity-80 group-hover:opacity-100'
              className={`${props.exchangeColor}`}>
              {exchange}-{code}
            </span>
          </Show>
        )}
      </div>
    </div>
  )
}

export const Page = (pageProps: PageProps): JSX.Element => {
  const { data, metadata } = pageProps
  let scrollTargetElement!: HTMLDivElement
  const [pos, setPos] = createSignal('0px')
  const [search, setSearch] = createSignal('')

  const exchangeStyle: Record<string, string> = Object.keys(metadata).reduce((acc, key, i) => {
    return { ...acc, [key]: staticExchangeColors[i % staticExchangeColors.length] }
  }, {})

  const size = createMediaQuery()

  createEffect(() => {
    setPos(scrollTargetElement.getBoundingClientRect().top + 'px')
  })

  return (
    <>
      <input
        type='text'
        placeholder='Tesla'
        value={search()}
        class='w-full rounded h-10 px-2 mb-5 '
        onInput={(e: any) => setSearch(e.target.value)}
      />

      {/*<noscript>*/}
      {/*  <ul class='flex gap-1 flex-col'>*/}
      {/*    <For each={data}>*/}
      {/*      {item => (*/}
      {/*        <li>*/}
      {/*          <ListItem item={item} tabIndex={1} exchangeColor={exchangeStyle[item[0]]} />*/}
      {/*        </li>*/}
      {/*      )}*/}
      {/*    </For>*/}
      {/*  </ul>*/}
      {/*</noscript>*/}

      <div
        ref={scrollTargetElement}
        style={{
          overflow: 'auto',
          position: 'relative',
          height: `calc(100vh - ${pos() === '0px' ? '100vh' : pos()} - ${size() === 'xs' ? '40px' : '0px'})`,
          'will-change': 'transform',
        }}>
        <Show when={!isServer}>
          <VirtualContainer items={data} scrollTarget={scrollTargetElement} itemSize={{ height: 35 }}>
            {props => <ListItem {...props} isVirtualScroll exchangeColor={exchangeStyle[props.item[0]]} />}
          </VirtualContainer>
        </Show>
      </div>
    </>
  )
}
