import './RefreshData.scss'
import { getMessage } from '@src/helper'
import { Component, createSignal } from 'solid-js'
import browser from 'webextension-polyfill'

import { setUpdateAt, useCurrentData } from '@popup/popup-helpers'

const delay = (ms = 1500): Promise<void> => new Promise((res) => setTimeout(res, ms))

export const RefreshData: Component = () => {
  const [, { setState }] = useCurrentData()
  const [loading, setLoading] = createSignal(false)

  async function clickHandler() {
    setLoading(true)

    await browser.runtime.sendMessage({
      type: 'ga',
      subType: 'event',
      payload: {
        eventCategory: 'popup',
        eventAction: 'invalidate-cache',
      },
    })

    await browser.runtime.sendMessage({ type: 'invalidate-cache' })
    const currentDates = await setUpdateAt()
    await delay()
    setLoading(false)
    setState(currentDates)
  }

  return (
    <>
      {loading() ? (
        <div className='mr-2'>
          <LoadingIcon />
        </div>
      ) : (
        <RefreshIcon onClick={clickHandler} />
      )}
    </>
  )
}

const popup_refresh_icon = getMessage('popup_refresh_icon')
const popup_loading_icon = getMessage('popup_loading_icon')

const LoadingIcon: Component = () => (
  <svg
    stroke='currentColor'
    fill='currentColor'
    stroke-width='0'
    version='1.1'
    viewBox='0 0 16 16'
    height='1em'
    width='1em'
    xmlns='http://www.w3.org/2000/svg'
    class='transition animate-spin ease-in-out'>
    <title>{popup_loading_icon}</title>
    <path
      fill='#2fcc71'
      d='M8 0c-4.355 0-7.898 3.481-7.998 7.812 0.092-3.779 2.966-6.812 6.498-6.812 3.59 0 6.5 3.134 6.5 7 0 0.828 0.672 1.5 1.5 1.5s1.5-0.672 1.5-1.5c0-4.418-3.582-8-8-8zM8 16c4.355 0 7.898-3.481 7.998-7.812-0.092 3.779-2.966 6.812-6.498 6.812-3.59 0-6.5-3.134-6.5-7 0-0.828-0.672-1.5-1.5-1.5s-1.5 0.672-1.5 1.5c0 4.418 3.582 8 8 8z'
    />
  </svg>
)

const RefreshIcon: Component<{ onClick: () => Promise<void> }> = ({ onClick }) => (
  <svg
    onClick={onClick}
    class='tsi-refresh-icon'
    enable-background='new 0 0 76 76'
    viewBox='0 0 80 80'
    height='24'
    width='24'
    xmlns='http://www.w3.org/2000/svg'>
    <title>{popup_refresh_icon}</title>
    <path
      d='m38 20.5833c4.9908 0 9.4912 2.0992 12.6667 5.4627v-8.6293l4.7499 4.75.0001 12.6666h-12.6667l-4.75-4.75h8.8512c-2.1744-2.4294-5.3342-3.9583-8.8512-3.9583-6.0215 0-10.9963 4.4818-11.7704 10.2917h-5.5753c.8-8.877 8.2605-15.8334 17.3457-15.8334zm0 29.2917c6.0215 0 10.9963-4.4818 11.7703-10.2917h5.5754c-.8 8.877-8.2605 15.8334-17.3457 15.8334-4.9908 0-9.4912-2.0992-12.6667-5.4627v8.6293l-4.75-4.75v-12.6666h12.6667l4.75 4.75h-8.8513c2.1744 2.4294 5.3343 3.9583 8.8513 3.9583z'
      stroke-linejoin='round'
      stroke-width='.2'
    />
  </svg>
)
