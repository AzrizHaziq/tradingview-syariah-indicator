import { onMount } from 'solid-js'
import { Header, Version, Flags, Footer } from '.'
import { browser } from 'webextension-polyfill-ts'
import { getStorageDetails, useCounter } from './../Helpers/popup.store'

// import { CurrentDateProvider } from '../../Context'
// import { RefreshData, Flags } from './../index'

const { author } = browser.runtime.getManifest()

export const Popup = () => {
  onMount(() => {
    document.body.focus()
    getStorageDetails().then(console.log)
  })

  const [count, { increment, decrement }] = useCounter()

  return (
    <div class='space-x-2 flex p-2 h-full'>
      <img
        class='self-start mt-2'
        src='/assets/shariah-icon.svg'
        alt='Tradingview shariah icon'
        width='25px'
        height='25px'
      />

      <div className='text-white'>
        <p>{count()} 2222</p>
        <button onClick={increment}>+</button>
        <button onClick={decrement}>-</button>
      </div>

      <div class='flex flex-col w-full'>
        <Header />
        <div class='flex items-center h-6 justify-between'>
          <p class='text-gray-300 text-xs'>{author}</p>
          <div class='flex items-center'>
            {/*<RefreshData />*/}
            <Version />
          </div>
        </div>
        <div class='flex justify-end text-white'>{/*<Flags />*/}</div>
        <hr class='my-2 border-gray-400 opacity-30' />
        <div class='flex justify-start flex-col text-xs'>
          <Footer />
        </div>
      </div>
    </div>
  )
}
