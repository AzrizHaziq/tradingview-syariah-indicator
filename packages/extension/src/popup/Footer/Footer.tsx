import React, { FC } from 'react'

export const Footer: FC = () => (
  <>
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
      <img className='mr-2' src='/assets/icons/github.svg' alt='Tradingview shariah icon' width='17px' height='20px' />
      Interested to contribute
    </a>
  </>
)
