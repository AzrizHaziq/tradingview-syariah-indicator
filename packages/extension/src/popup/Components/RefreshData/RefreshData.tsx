import './RefreshData.scss'
import { getMessage } from '@src/helper'
import browser from 'webextension-polyfill'
import { Component, createSignal } from 'solid-js'
import { getStorageDetails, updateFlags } from '@popup/popup-helpers'

const delay = (ms = 1500): Promise<void> => new Promise((res) => setTimeout(res, ms))

const popup_refresh_icon = getMessage('popup_refresh_icon')
const popup_loading_icon = getMessage('popup_loading_icon')

export const RefreshData: Component = () => {
  const [loading, setLoading] = createSignal(false)

  async function clickHandler() {
    if (loading() === true) return
    setLoading(true)

    await browser.runtime.sendMessage({ type: 'invalidate-cache' })
    const currentDates = await getStorageDetails()
    await delay()

    setLoading(false)
    updateFlags(currentDates)
  }

  return (
    <svg
      onClick={clickHandler}
      stroke='currentColor'
      fill='currentColor'
      tabIndex={0}
      stroke-width='0'
      version='1.1'
      viewBox='0 0 16 16'
      height='1em'
      width='1em'
      xmlns='http://www.w3.org/2000/svg'
      class='transition ease-in-out'
      classList={{ 'animate-spin': loading(), 'cursor-pointer': !loading() }}>
      <title>{loading() ? popup_loading_icon : popup_refresh_icon}</title>
      <path
        fill='#2fcc71'
        d='M8 0c-4.355 0-7.898 3.481-7.998 7.812 0.092-3.779 2.966-6.812 6.498-6.812 3.59 0 6.5 3.134 6.5 7 0 0.828 0.672 1.5 1.5 1.5s1.5-0.672 1.5-1.5c0-4.418-3.582-8-8-8zM8 16c4.355 0 7.898-3.481 7.998-7.812-0.092 3.779-2.966 6.812-6.498 6.812-3.59 0-6.5-3.134-6.5-7 0-0.828-0.672-1.5-1.5-1.5s-1.5 0.672-1.5 1.5c0 4.418 3.582 8 8 8z'
      />
    </svg>
  )
}
