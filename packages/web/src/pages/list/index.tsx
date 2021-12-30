import './list.scss'
import type { PageProps } from 'type'
import { ShariahFetcher } from './fetcher'
import { createStore } from 'solid-js/store'
import { debounce, pipe, TArrayConcat, TFilter, IMGS, useTrackOnLoad } from '@util'
import { createEffect, createMemo, createResource, For, JSX, Show } from 'solid-js'

const staticExchangeColors = [
  'text-red-600 bg-red-100 border-red-500',
  'text-yellow-800 bg-yellow-100 border-yellow-500',
  'text-blue-700 bg-blue-100 border-blue-500',
  'text-green-700 bg-green-200 border-green-700',
  'text-pink-800 bg-pink-100 border-pink-500',
  'text-indigo-500 bg-indigo-200 border-indigo-500',
  'text-gray-900 bg-gray-100 border-gray-900',
]

export default function List(): JSX.Element {
  useTrackOnLoad()

  const [data] = createResource<PageProps | undefined>(ShariahFetcher, { initialValue: undefined })

  const [store, setStore] = createStore({
    data: [],
    originalData: [],
    exchangeStyle: {},
    runFilter: () => {
      setStore('data', transducerFilter())
    },
    metadata: {},
    search: '',
    currentExchange: {
      _data: [], // exchangesList,
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

  createEffect(() => {
    if (!data.loading) {
      const { data: originalData, metadata, exchangesList, queryParams } = data()
      setStore('data', originalData)
      setStore('originalData', originalData)
      setStore('metadata', metadata)
      setStore('search', queryParams.q || '')
      setStore('currentExchange', '_data', exchangesList)

      setStore(
        'exchangeStyle',
        Object.keys(store.metadata).reduce(
          (acc, key, i) => ({
            ...acc,
            [key]: staticExchangeColors[i % staticExchangeColors.length],
          }),
          {}
        )
      )
    }
  })

  const showSearch = (item: PageProps['data']['0']): boolean => {
    if (!store.search) {
      return true
    }

    const searchRegex = new RegExp(store.search, 'ig')
    return item.some((i) => searchRegex.test(i))
  }

  const showExchange = ([exchange]: PageProps['data']['0']): boolean => store.currentExchange.has(exchange)

  const transducerFilter = createMemo(() =>
    store.originalData.reduce(pipe(TFilter(showExchange), TFilter(showSearch))(TArrayConcat), [])
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
      setStore('data', store.originalData)
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
    setStore('data', store.originalData)
    setStore('search', '')
    setStore('currentExchange', '_data', Object.keys(store.metadata))

    const url = new URL(location.href)
    url.searchParams.delete('exchange')
    url.searchParams.delete('q')
    history.pushState(null, '', url)
  }

  return (
    <Show
      when={store.originalData.length}
      fallback={
        <div class='flex flex-col items-center justify-center h-full text-gray-500 gap-2'>
          <img src={IMGS.logo} alt='logo' class='animate-bounce' width='25px' height='25px' />
          Loading
        </div>
      }>
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
          <For each={Object.entries(store.metadata)}>
            {([exchange]) => (
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
            when={store.search || store.currentExchange._data.length < Object.keys(store.metadata).length}
            fallback={<div class='ml-auto' />}>
            <button class='ml-auto text-green-500' onClick={handleClear}>
              Clear All
            </button>
          </Show>
        </div>

        <Show
          when={store.data.length}
          fallback={<div class='flex justify-center text-xl'>Please search or select new filter</div>}>
          <ShariahList data={transducerFilter()} exchangeStyle={store.exchangeStyle} />
        </Show>
      </div>
      <div class='flex flex-wrap justify-center pt-5 gap-4'>
        <For each={Object.entries(store.metadata)}>
          {([exchange, date]) => (
            <div class='px-2 py-1 bg-green-100 rounded'>
              <span class='mr-1 text-xs text-green-800'>{exchange}</span>
              <span class='font-bold text-green-900'>{date as unknown as string}</span>
            </div>
          )}
        </For>
      </div>
    </Show>
  )
}

const ShariahList = (props: { data: PageProps['data']; exchangeStyle: Record<string, string> }) => {
  return (
    <ul class='flex flex-col overflow-auto gap-1 overscroll-contain' style={{ height: 'calc(100vh - 280px)' }}>
      <For each={props.data}>
        {(item) => <ShariahListItem item={item} exchangeColor={props.exchangeStyle[item[0]]} />}
      </For>
    </ul>
  )
}

const ShariahListItem = (props: { item: PageProps['data']['0']; exchangeColor: string }) => {
  const [exchange, code, name] = props.item

  return (
    <li class='flex items-center group gap-x-1' role='listitem'>
      <p class='text-white opacity-80 group-hover:opacity-100'>
        <span class='inline mr-2 font-bold sm:hidden'>{exchange}</span>
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

// export const documentProps = {
//   title: 'TSI: Shariah List',
//   description: 'List of Shariah in Tradingview Shariah Indicator(TSI)',
// }
