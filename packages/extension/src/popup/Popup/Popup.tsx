import React from 'react'
import './_Popup.scss'

const Popup = () => {
  return (
    <div className='grid p-1 w-full from-green-200 to-green-500 bg-gradient-to-tr'>
      <div className='rounded' style={{ backgroundColor: '#1A202C' }}>
        <div className='space-x-4 flex p-2 h-full'>
          <img
            className='self-start mt-2'
            src='/assets/shariah-icon.svg'
            alt='Tradingview shariah icon'
            width='25px'
            height='25px'
          />

          <div className='flex flex-col w-full'>
            <a
              className='text-green-500 text-base'
              target='_blank'
              rel='noopener noreferrer'
              href='https://azrizhaziq.github.io/tradingview-syariah-indicator'>
              Tradingview Shariah Indicator
            </a>
            <div className='flex items-center justify-between'>
              <p className='text-gray-300 text-xs'>By: Azriz Haziq Jasni</p>
              <div className='flex items-center'>
                <svg
                  className='tsi-refresh-icon'
                  enableBackground='new 0 0 76 76'
                  viewBox='0 0 76 76'
                  height='24'
                  width='24'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='m38 20.5833c4.9908 0 9.4912 2.0992 12.6667 5.4627v-8.6293l4.7499 4.75.0001 12.6666h-12.6667l-4.75-4.75h8.8512c-2.1744-2.4294-5.3342-3.9583-8.8512-3.9583-6.0215 0-10.9963 4.4818-11.7704 10.2917h-5.5753c.8-8.877 8.2605-15.8334 17.3457-15.8334zm0 29.2917c6.0215 0 10.9963-4.4818 11.7703-10.2917h5.5754c-.8 8.877-8.2605 15.8334-17.3457 15.8334-4.9908 0-9.4912-2.0992-12.6667-5.4627v8.6293l-4.75-4.75v-12.6666h12.6667l4.75 4.75h-8.8513c2.1744 2.4294 5.3343 3.9583 8.8513 3.9583z'
                    strokeLinejoin='round'
                    strokeWidth='.2'
                  />
                </svg>
                <a
                  className='text-gray-300 text-xs hover:underline'
                  rel='noopener noreferrer'
                  target='_blank'
                  href='https://github.com/AzrizHaziq/tradingview-syariah-indicator/releases'>
                  (1.7.5)
                </a>
              </div>
            </div>
            <div className='flex justify-end'>
              <a className='flex items-center text-gray-300 hover:underline'>
                <img src='/assets/flag/MYX.svg' alt='Tradingview shariah icon' width='20px' height='10px' />
                <p className='ml-1 text-xs'>19/03/2021</p>
              </a>
            </div>
            <hr className='my-2 border-gray-400 opacity-30' />
            <div className='flex justify-start flex-col text-xs'>
              <a
                className='text-gray-300 flex hover:underline'
                target='_blank'
                rel='noopener noreferrer'
                href='https://t.me/tv_shariah'>
                <img
                  className='mr-1'
                  src='/assets/icons/telegram.svg'
                  alt='Tradingview shariah icon'
                  width='20px'
                  height='20px'
                />
                Bug/suggestion
              </a>
              <a
                className='text-gray-300 flex hover:underline'
                target='_blank'
                rel='noopener noreferrer'
                href='https://github.com/AzrizHaziq/tradingview-syariah-indicator'>
                <img
                  className='mr-2'
                  src='/assets/icons/github.svg'
                  alt='Tradingview shariah icon'
                  width='17px'
                  height='20px'
                />
                Interested to contribute
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Popup
