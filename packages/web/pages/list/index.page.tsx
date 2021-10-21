import './list.scss'
import { For, JSX, Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import { debounce, TFilter, TArrayConcat, pipe } from '../../../util'

type PageProps = {
  data: [exchange: string, code: string, name: string][]
  metadata: Record<string, Date>
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
  const { data: originalData, metadata } = pageProps
  const [store, setStore] = createStore({
    data: originalData,
    metadata,
    search: '',
    currentExchange: new Set(Object.keys(metadata)),
  })

  const exchangeStyle: Record<string, string> = Object.keys(metadata).reduce(
    (acc, key, i) => ({
      ...acc,
      [key]: staticExchangeColors[i % staticExchangeColors.length],
    }),
    {}
  )

  const showSearch = (item: PageProps['data']['0']): boolean => {
    const searchRegex = new RegExp(store.search, 'ig')
    return item.some((i) => searchRegex.test(i))
  }

  const showExchange = ([exchange]: PageProps['data']['0']): boolean => store.currentExchange.has(exchange)
  const transducerFilter = () => originalData.reduce(pipe(TFilter(showExchange), TFilter(showSearch))(TArrayConcat), [])

  const handleSearchChange = debounce((e: any) => {
    const keyword = e.target.value
    setStore('search', keyword)

    if (keyword) {
      const result = transducerFilter()
      setStore('data', result)
    } else {
      setStore('data', originalData)
    }
  })

  const handleExchangeChange = (exchange: string) => (e: any) => {
    if (e.target.checked) {
      store.currentExchange.add(exchange)
    } else {
      store.currentExchange.delete(exchange)
    }

    const result = transducerFilter()
    setStore('data', result)
  }

  return (
    <>
      <svg class='hidden'>
        {/*<symbol*/}
        {/*  xmlns='http://www.w3.org/2000/svg'*/}
        {/*  preserveAspectRatio='xMidYMid'*/}
        {/*  viewBox='0 0 54 54'*/}
        {/*  id='icon-activate'>*/}
        {/*  <path d='M27 54C12.088 54 0 41.912 0 27S12.088 0 27 0s27 12.088 27 27-12.088 27-27 27zm0-51C13.766 3 3 13.766 3 27s10.766 24 24 24 24-10.766 24-24S40.234 3 27 3zm10.293 24.549c-.027.068-.032.14-.069.206-.019.031-.05.049-.07.079-.043.063-.098.114-.151.171a1.456 1.456 0 0 1-.284.25c-.017.011-.026.029-.044.039l-13.857 8c-.066.039-.139.043-.208.07-.03.014-.061.02-.092.031-.132.043-.26.076-.395.08-.043.004-.079.025-.123.025-.09 0-.167-.036-.252-.051-.034-.007-.066-.01-.099-.02-.654-.162-1.149-.725-1.149-1.429V19c0-.704.495-1.267 1.149-1.429.033-.01.065-.013.099-.02.085-.015.162-.051.252-.051.044 0 .08.021.123.025.135.004.263.037.395.08.031.011.062.017.092.031.069.027.142.031.208.07l13.857 8c.018.01.027.028.044.039.107.067.195.155.284.25.053.057.108.108.151.171.02.03.051.048.07.079.037.066.042.138.069.206.035.086.069.168.087.26a1.4 1.4 0 0 1 .02.289 1.4 1.4 0 0 1-.02.289c-.018.092-.052.174-.087.26zM23.5 21.563v10.874L32.917 27 23.5 21.563z'></path>*/}
        {/*</symbol>*/}
        <symbol
          id='link-icon'
          stroke='currentColor'
          stroke-width='0'
          class='fill-current text-gray-300 hover:text-green-200'
          viewBox='0 0 1024 1024'
          xmlns='http://www.w3.org/2000/svg'>
          <path d='M574 665.4a8.03 8.03 0 0 0-11.3 0L446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3l-39.8-39.8a8.03 8.03 0 0 0-11.3 0L191.4 526.5c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3L574 665.4zm258.6-474c-84.6-84.6-221.5-84.6-306 0L410.3 307.6a8.03 8.03 0 0 0 0 11.3l39.7 39.7c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204L665.3 562.6a8.03 8.03 0 0 0 0 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c84.5-84.6 84.5-221.5 0-306.1zM610.1 372.3a8.03 8.03 0 0 0-11.3 0L372.3 598.7a8.03 8.03 0 0 0 0 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l226.4-226.4c3.1-3.1 3.1-8.2 0-11.3l-39.5-39.6z' />
        </symbol>
      </svg>
      <input
        type='text'
        placeholder='Tesla, TOPGLOV, MYX, SZSE, NYSE, MYX, intel'
        value={store.search}
        class='w-full rounded h-10 px-2 mb-5 '
        onInput={handleSearchChange}
      />
      <div class='flex gap-2 mb-4 justify-end'>
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
      </div>

      <List data={store.data} exchangeStyle={exchangeStyle} />
    </>
  )
}

const ListItem = (props: { item: PageProps['data']['0']; exchangeColor: string }) => {
  const [exchange, code, name] = props.item

  return (
    <li class='flex group items-center gap-x-1' role='listitem'>
      <p class='text-white opacity-80 group-hover:opacity-100'>
        <span class='inline sm:hidden mr-2 font-bold'>{exchange} </span>
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
    <ul class='flex gap-1 flex-col'>
      <For each={props.data}>{(item) => <ListItem item={item} exchangeColor={props.exchangeStyle[item[0]]} />}</For>
    </ul>
  )
}
