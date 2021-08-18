import { createEffect } from 'solid-js'
import { Header, Version, Flags, Footer } from '.'
import { browser } from 'webextension-polyfill-ts'
import { getStorageDetails } from './../Helpers/popup.store'

// import { CurrentDateProvider } from '../../Context'
// import { RefreshData, Flags } from './../index'

const { author } = browser.runtime.getManifest()

export const Popup = () => {
  createEffect(async () => {
    document.body.focus()
    await getStorageDetails()
  })

  return (
    <div>
      <div className='space-x-2 flex p-2 h-full'>
        <img
          className='self-start mt-2'
          src='/assets/shariah-icon.svg'
          alt='Tradingview shariah icon'
          width='25px'
          height='25px'
        />

        <div className='flex flex-col w-full'>
          <Header />
          <div className='flex items-center h-6 justify-between'>
            <p className='text-gray-300 text-xs'>{author}</p>
            <div className='flex items-center'>
              {/*<RefreshData />*/}
              <Version />
            </div>
          </div>
          <div className='flex justify-end'>
            <Flags />
          </div>
          <hr className='my-2 border-gray-400 opacity-30' />
          <div className='flex justify-start flex-col text-xs'>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  )
}
