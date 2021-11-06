import './list.scss'
import { isServer } from 'solid-js/web'
import { createStore } from 'solid-js/store'
import { createMemo, For, JSX, Show } from 'solid-js'
import { debounce, pipe, TArrayConcat, TFilter } from '@util'

type PageProps = {
  data: [exchange: string, code: string, name: string][]
  metadata: Record<string, Date>
  exchangesList: string[]
  queryParams: Partial<{
    q: string
    exchange: string | string[]
  }>
}

const staticExchangeColors = [
  'text-red-600 bg-red-100 border-red-500',
  'text-yellow-800 bg-yellow-100 border-yellow-500',
  'text-blue-700 bg-blue-100 border-blue-500',
  'text-green-700 bg-green-200 border-green-700',
  'text-pink-800 bg-pink-100 border-pink-500',
  'text-indigo-500 bg-indigo-200 border-indigo-500',
  'text-gray-900 bg-gray-100 border-gray-900',
]

export const Page = (pageProps: PageProps): JSX.Element => {
  const { data: originalData, metadata, exchangesList, queryParams } = pageProps

  const [store, setStore] = createStore({
    data: originalData,
    runFilter: () => {
      setStore('data', transducerFilter())
    },
    metadata,
    search: isServer ? queryParams.q ?? '' : new URL(location.href).searchParams.get('q'),
    currentExchange: {
      _data: exchangesList,
      add(exchange: string) {
        const s = new Set<string>(this._data)
        s.add(exchange)
        setStore('currentExchange', '_data', [...s])
      },
      delete(exchange: string) {
        setStore(
          'currentExchange',
          '_data',
          this._data.filter((ex) => ex !== exchange)
        )
      },
      has(exchange: string): boolean {
        return this._data.includes(exchange)
      },
    },
  })

  const exchangeStyle: Record<string, string> = Object.keys(metadata).reduce(
    (acc, key, i) => ({
      ...acc,
      [key]: staticExchangeColors[i % staticExchangeColors.length],
    }),
    {}
  )

  const showSearch = (item: PageProps['data']['0']): boolean => {
    if (!store.search) return true

    const searchRegex = new RegExp(store.search, 'ig')
    return item.some((i) => searchRegex.test(i))
  }

  const showExchange = ([exchange]: PageProps['data']['0']): boolean => store.currentExchange.has(exchange)

  const transducerFilter = createMemo(() =>
    originalData.reduce(pipe(TFilter(showExchange), TFilter(showSearch))(TArrayConcat), [])
  )

  const handleSearchChange = debounce((e) => {
    const keyword = e.target.value
    setStore('search', keyword)

    const url = new URL(location.href)
    url.searchParams.set('q', encodeURIComponent(keyword))
    history.pushState(null, '', url)

    if (keyword) {
      store.runFilter()
    } else {
      setStore('data', originalData)
    }
  })

  const handleExchangeChange = (exchange: string) => {
    return (e) => {
      if (e.target.checked) {
        store.currentExchange.add(exchange)
      } else {
        store.currentExchange.delete(exchange)
      }

      const url = new URL(location.href)
      url.searchParams.delete('exchange')
      store.currentExchange._data.forEach((exchange) => url.searchParams.append('exchange', exchange))
      history.pushState(null, '', url)

      store.runFilter()
    }
  }

  const handleClear = () => {
    setStore('data', originalData)
    setStore('search', '')
    setStore('currentExchange', '_data', Object.keys(metadata))

    const url = new URL(location.href)
    url.searchParams.delete('exchange')
    url.searchParams.delete('q')
    history.pushState(null, '', url)
  }

  return (
    <div class='max-w-full mx-auto md:max-w-3xl'>
      <svg class='hidden'>
        <symbol
          id='link-icon'
          stroke='currentColor'
          stroke-width='0'
          class='text-gray-300 fill-current hover:text-green-200'
          viewBox='0 0 1024 1024'>
          <path d='M574 665.4a8.03 8.03 0 0 0-11.3 0L446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3l-39.8-39.8a8.03 8.03 0 0 0-11.3 0L191.4 526.5c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3L574 665.4zm258.6-474c-84.6-84.6-221.5-84.6-306 0L410.3 307.6a8.03 8.03 0 0 0 0 11.3l39.7 39.7c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204L665.3 562.6a8.03 8.03 0 0 0 0 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c84.5-84.6 84.5-221.5 0-306.1zM610.1 372.3a8.03 8.03 0 0 0-11.3 0L372.3 598.7a8.03 8.03 0 0 0 0 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l226.4-226.4c3.1-3.1 3.1-8.2 0-11.3l-39.5-39.6z' />
        </symbol>
      </svg>
      <input
        type='text'
        placeholder='Tesla, TOPGLOV, MYX, SZSE, NYSE, MYX, intel'
        value={store.search}
        class='w-full h-10 px-2 mb-5 rounded'
        onInput={handleSearchChange}
      />
      <div class='flex mb-4 gap-2'>
        <For each={Object.keys(metadata)}>
          {(exchange) => (
            <label class='exchange'>
              <input
                type='checkbox'
                class='hidden'
                checked={store.currentExchange.has(exchange)}
                onClick={handleExchangeChange(exchange)}
              />
              <span>{exchange}</span>
            </label>
          )}
        </For>

        <Show
          when={store.search || store.currentExchange._data.length < Object.keys(metadata).length}
          fallback={<div class='ml-auto' />}>
          <button class='ml-auto text-green-500' onClick={handleClear}>
            Clear All
          </button>
        </Show>
      </div>

      <Show when={store.data.length} fallback={'Please search or select any filter anything'}>
        <List data={transducerFilter()} exchangeStyle={exchangeStyle} />
      </Show>
    </div>
  )
}

const ListItem = (props: { item: PageProps['data']['0']; exchangeColor: string }) => {
  const [exchange, code, name] = props.item

  return (
    <li class='flex items-center group gap-x-1' role='listitem'>
      <p class='text-white opacity-80 group-hover:opacity-100'>
        <span class='inline mr-2 font-bold sm:hidden'>{exchange} </span>
        {name}
      </p>
      <a target='_blank' href={`https://www.tradingview.com/symbols/${exchange}-${code}`}>
        <svg height='1em' width='1em'>
          <use href='#link-icon' />
        </svg>
      </a>

      {exchange && (
        <Show when={exchange}>
          <span
            class={`hidden sm:block text-sm py-1 px-2 border rounded ml-auto opacity-80 group-hover:opacity-100 ${props.exchangeColor}`}>
            {exchange}-{code}
          </span>
        </Show>
      )}
    </li>
  )
}

const List = (props: { data: PageProps['data']; exchangeStyle: Record<string, string> }) => {
  return (
    <ul class='flex flex-col gap-1'>
      <For each={props.data}>{(item) => <ListItem item={item} exchangeColor={props.exchangeStyle[item[0]]} />}</For>
    </ul>
  )
}
