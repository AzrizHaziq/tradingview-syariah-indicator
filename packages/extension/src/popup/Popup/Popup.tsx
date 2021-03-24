import React from 'react'
import './_Popup.scss'

import { Flags } from '../Flags/Flags'
import { Header } from '../Header/Header'
import { Footer } from '../Footer/Footer'
import { Version } from '../Version/Version'
import { RefreshData } from '../RefreshData/RefreshData'

const Popup = () => {
  return (
    <div className='grid p-1 w-full from-green-200 to-green-500 bg-gradient-to-tr'>
      <div className='rounded' style={{ backgroundColor: '#1A202C' }}>
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
            <div className='flex items-center justify-between'>
              <p className='text-gray-300 text-xs'>By: Azriz Haziq Jasni</p>
              <div className='flex items-center'>
                <RefreshData />
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
    </div>
  )
}

export default Popup
