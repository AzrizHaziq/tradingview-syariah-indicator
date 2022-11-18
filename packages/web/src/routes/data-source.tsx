import { MetaSeo } from '~/components'
import { Type } from '@sinclair/typebox'
import { createStore } from 'solid-js/store'
import { copy, trackEvent, useTrackOnLoad } from '~/util'
import { createResource, createSignal, JSX, onMount, Show } from 'solid-js'
import { debounce, isFormatCorrect, isValidJson, required, StorageMap, transformStockListResponse } from '@app/shared'

const CopySourceExample = () => {
  const [isCopy, setIsCopy] = createSignal(false)

  return (
    <div
      class='flex mx-auto rounded-md shadow-sm'
      role='group'
      onClick={() =>
        copy(JSON.stringify([['MYX:MAYBANK', { s: 1 }]]), () => {
          setIsCopy(true)
          setTimeout(() => setIsCopy(false), 1000)
          trackEvent('data_source_code', {
            category: 'web::data_source_code',
            label: 'data source',
          })
        })
      }>
      <div class='py-2 px-4 font-medium text-black text-gray-500 bg-gray-200 rounded-l-lg cursor-not-allowed'>
        {`[ ["MYX:MAYBANK", {"s": 1}]`}
      </div>
      <button
        type='button'
        class='focus:z-10 py-2 px-4 font-medium text-green-700 hover:text-green-900 focus:text-green-700 bg-green-100 rounded-r-md focus:ring-2 focus:ring-green-700'>
        <div class='flex gap-1 items-center'>
          <svg
            stroke='currentColor'
            fill='currentColor'
            stroke-width='0'
            viewBox='0 0 448 512'
            height='1em'
            width='1em'
            xmlns='http://www.w3.org/2000/svg'>
            <path d='M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z' />
          </svg>
          <p class='!my-0'>{isCopy() ? 'Copied!' : 'Copy'}</p>
        </div>
      </button>
    </div>
  )
}

export type InputStateTypes = Parameters<typeof InputState>[0]['state']
export const InputState = (prop: { state: 'loading' | 'error' | 'success' | '' }) => {
  return (
    <>
      <Show when={prop.state === ''}>{null}</Show>

      <Show when={prop.state === 'loading'}>
        {/* loading */}
        <svg
          stroke='currentColor'
          fill='currentColor'
          stroke-width='0'
          version='1.1'
          viewBox='0 0 16 16'
          height='1em'
          width='1em'
          xmlns='http://www.w3.org/2000/svg'
          class='transition ease-in-out animate-spin'>
          <path
            fill='#2fcc71'
            d='M8 0c-4.355 0-7.898 3.481-7.998 7.812 0.092-3.779 2.966-6.812 6.498-6.812 3.59 0 6.5 3.134 6.5 7 0 0.828 0.672 1.5 1.5 1.5s1.5-0.672 1.5-1.5c0-4.418-3.582-8-8-8zM8 16c4.355 0 7.898-3.481 7.998-7.812-0.092 3.779-2.966 6.812-6.498 6.812-3.59 0-6.5-3.134-6.5-7 0-0.828-0.672-1.5-1.5-1.5s-1.5 0.672-1.5 1.5c0 4.418 3.582 8 8 8z'
          />
        </svg>
      </Show>

      <Show when={prop.state === 'error'}>
        <svg class='text-red-500' height='20' width='20' viewBox='0 0 24 24'>
          <path
            fill='currentColor'
            d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'
          />
        </svg>
      </Show>

      <Show when={prop.state === 'success'}>
        <svg height='20' width='20' viewBox='0 0 24 24' class='text-green-500'>
          <path fill='currentColor' d='M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z' />
        </svg>
      </Show>
    </>
  )
}

const fetcher = async () => {
  const res = await fetch(import.meta.env.VITE_FETCH_URL + '/stock-list.json')
  const json = await res.json()
  return transformStockListResponse(json)
}

const [response, setResponse] = createSignal<StorageMap['LIST']>([])

const [store, setStore] = createStore<{
  select: 'merge' | 'own'
  merge: {
    value: string
    state: InputStateTypes
    errMsg: string
    result: Map<`${string}:${string}`, Record<string, number>>
  }
  own: {
    value: string
    state: InputStateTypes
    errMsg: string
    result: Map<`${string}:${string}`, Record<string, number>>
  }
}>({
  select: 'merge',
  merge: { value: '', state: '', errMsg: '', result: new Map() },
  own: { value: '', state: '', errMsg: '', result: new Map() },
})

type Prop = { as: 'merge' | 'own' }
export const DataSourceSelection = (props: Prop) => {
  const clickHandler = async (value) => {
    try {
      required(value)
      const json: StorageMap['LIST'] = isValidJson(value)
      isFormatCorrect(json)

      localStorage.setItem(`tsi:datasource:${props.as}`, value)
      setStore(props.as, {
        value,
        state: 'success',
        errMsg: '',
        result: props.as === 'merge' ? new Map([].concat(response() ?? [], json)) : new Map([].concat(json)),
      })
    } catch (e) {
      setStore(`${props.as}`, { state: 'error', errMsg: e.msg })
      console.error(e)
      throw Error(e)
    }
  }

  onMount(() => {
    if (localStorage.getItem(`tsi:datasource:${props.as}`)) {
      clickHandler(localStorage.getItem(`tsi:datasource:${props.as}`))
    }
  })

  const _clickHandler = debounce(clickHandler, 200, false)
  return (
    <div
      class='border bg-gray-800 border-1 border-green-300 rounded'
      classList={{ 'opacity-25': store.select !== props.as }}>
      <label class='cursor-pointer p-2 w-full flex items-center'>
        <div class='flex items-center mr-auto'>
          <input
            value={props.as}
            checked={store.select === props.as}
            onClick={() => setStore('select', props.as)}
            type='radio'
            class='w-3 h-3 text-blue-600 bg-green-100 rounded border-green-300 mr-2'
          />
          <span class='text-white'>{`${props.as[0].toUpperCase()}${props.as.slice(1)}`}</span>
        </div>

        <div class='items-center flex'>
          <InputState state={store[props.as].state} />
        </div>
      </label>

      <Show when={store.select === props.as}>
        <div class='px-2 pb-2'>
          <textarea
            id='merge-text-area'
            rows='2'
            value={store[props.as].value}
            class='p-2 block w-full text-gray-900 rounded border border-green-100'
            placeholder='[ ["MYX:MAYBANK", {"s": 1}], ["NASDAQ:GOOG", {"s": 1}], ["TSX:RY", {"s": 1}] ]'
            onInput={(e) => {
              const value = (e.target as HTMLTextAreaElement).value
              setStore(props.as, { value, state: 'loading' })
              _clickHandler(value)
            }}
          />
        </div>
        <Show when={store[props.as].errMsg}>
          <p class='text-red-200 px-2 pb-2'>{store[props.as].errMsg}</p>
        </Show>
      </Show>
    </div>
  )
}

export default function DataSource(): JSX.Element {
  useTrackOnLoad()

  const [res] = createResource(fetcher)
  setResponse(res())

  const props = {
    pageTittle: 'Custom Data Source',
    description: 'Customise TSI data with your data',
    path: 'custom-data-source',
  }

  return (
    <>
      <MetaSeo {...props} />
      <div class='p-5 mx-auto prose'>
        <div class='mx-auto max-w-md flex gap-2 flex-col'>
          <div class='text-white'>
            <h2 id='data-source'>
              Datasource
              <a class='!ml-2' href='#data-source'>
                #
              </a>
            </h2>
            <ul class='list-disc'>
              <li>
                New feature that you can customise your data and our data. There is 2 options which is{' '}
                <code>merge</code> and <code>own</code>
              </li>
              <li>Output data also print in devtool {`>`} console. Please reload TSI after make changes</li>
            </ul>
            Use below data as your starting point.
            <CopySourceExample />
            <h2 id='validate'>
              Ways to Validate your data
              <a class='!ml-2' href='#validate'>
                #
              </a>
            </h2>
            <ul class='list-disc'>
              <li>
                <h3>
                  Use typescript playground
                  <a
                    target='_blank'
                    href='https://www.typescriptlang.org/play?#code/C4TwDgpgBAhgbjAlgGxgI2RAKgZQJICiAHgMYAWMAdgOYQDOUAvFAOQCyAmgBotQA+rAHIBBHABFhARV4CWgjjgIzWORcpY4AWmv6s8YnlAD0RqAHtKyEFGBl60RAzoBXMGDMAnYBAAmUCKQUNBAAdFAcZs6wyHRmUCRUUGDOwLCU1gHkVLQMMAwA7hDIyGEAShAAZhAeUGhFZvmsuFwAXKUcLABQoJBQdMBmJADWAMJmPtDMAAYAJADe8EioGNj4xFnBdHz9Hog0AL4t8zt71PtTxqYgkfGJyanIiEPQto6smUG0Lf2DQyTjEBYABpuuBoLg8EwoABtH7DMYTIFQOZ9FpQAAMugAjPsALrQ3GXPp9YBUPwVTx9Ci7GBkNJ+RDABgIR5+FnOaAWayYylYzqdf6UfpQAC2IB8MFJaIhUM6JnlCsVSuVKsVctMYEweWgG1oUD2dEQE1q9Uaj0o9HMlhAIXV+oqNjsHmglDiJGcHisUGdfnNECRtklLAYIogiUKsGdUGoZnGds1Ybo0GcSagLKNUAAUjgAPKCPogSikohWqzq1UVysqzrQqCdKAwgBEnFabGEHAAQsJBABpRtIuaNuiNtE43FI+tNkTiKQtADiOZzc-7yKHI4xeInDehjeabQ4K8Hw7R6LxnVxQA'>
                    link
                  </a>
                  (recommended)
                </h3>
                <details>
                  <summary>In case website doesnt work you can play around with this TS code to validate it</summary>
                  <pre>{validateWithTS}</pre>
                </details>
              </li>
              <li>
                <h3>Use JSON schema</h3>
                <details>
                  <summary>Use this json schema and validate this in any json schema validator</summary>
                  <pre>{validateWithJSonSchema}</pre>
                </details>
              </li>
              <li>
                <h3>Use our custom validate</h3>
                <DataSourceSelection as={'merge'} />
                <DataSourceSelection as={'own'} />
                <Show
                  when={store[store.select].value && store[store.select].state === 'success' && res.state === 'ready'}>
                  <div>
                    <div class='bg-white rounded-t p-2 text-center text-black'>Output</div>
                    <pre class='mt-0! text-white h-[400px] border rounded-b rounded-t-none! border-white p-2 overflow-auto'>
                      {
                        (console.log(store[store.select].result),
                        JSON.stringify(Object.fromEntries(store[store.select].result), null, 2))
                      }
                    </pre>
                  </div>
                </Show>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

// [
//   ["MYX:MAYBANK", { s: 1 }],
//   ["NASDAQ:GOOG", { s: 1 }],
//   ["TSX:RY", { s: 1 }],
// ]
enum ShariahEnum {
  nonShariah,
  Shariah,
}

const T = Type.Array(
  Type.Tuple([
    Type.RegEx(/(MYX|NASDAQ|IDX|NYSE|SZSE|SSE|[A-Z]+):\w+([&-]?\w+)+/), // re stock name is same in chart.ts
    Type.Object({ s: Type.Enum(ShariahEnum) }),
  ])
)

const validateWithJSonSchema = JSON.stringify(T, null, 2)

const validateWithTS = `
type availableTSIExchanges = 'MYX' | 'NASDAQ' | 'NYSE' | 'SSE' | 'SZSE' | 'IDX' // only these is supported exchange. You also can put any exchanges as well. Refer below 'TSX:RY'
type stockCode = \`\${availableTSIExchanges | string}:\${string}\` // you can put like this 'exchange:stockcode',
type TSI = [stockCode, { s: 0 | 1}][] // s stand for shariah and its valid value ony 0 or 1

const mydata: TSI = 
////////////////////////////////////////
// please change inside below lines only.
////////////////////////////////////////
[ 
  ["MYX:MAYBANK", {"s": 1}], 
  ["NASDAQ:GOOG", {"s": 0}], 
  ["TSX:RY", {"s": 0}]
]
`
