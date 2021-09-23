import { onMount } from 'solid-js'
import { browser } from 'webextension-polyfill-ts'
import { getStorageDetails, useCurrentData } from '@popup/popup-helpers'
import { Footer, Header, Version, Flags, RefreshData } from '@popup/Components'

const { author } = browser.runtime.getManifest()

export const Popup = () => {
  const [, { setState }] = useCurrentData()

  onMount(() => {
    document.body.focus()
    getStorageDetails().then(setState)
  })

  return (
    <div class='space-x-2 flex p-2 h-full'>
      <img
        class='self-start mt-2'
        src='/assets/shariah-icon.svg'
        alt='Tradingview shariah icon'
        width='25px'
        height='25px'
      />

      <div class='flex flex-col w-full'>
        <Header />
        <div class='flex items-center h-6 justify-between'>
          <p class='text-gray-300 text-xs'>{author}</p>
          <div class='flex items-center'>
            <RefreshData />
            <Version />
          </div>
        </div>
        <div class='grid grid-cols-2 gap-x-2 text-white mt-2'>
          <Flags />
        </div>
        <hr class='my-2 border-gray-400 opacity-30' />
        <div class='flex justify-start flex-col text-xs'>
          <Footer />
        </div>
      </div>
    </div>
  )
}
