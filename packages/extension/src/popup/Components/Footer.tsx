import pkg from '../../../package.json'
import { getMessage } from '@src/helper'
import type { Component } from 'solid-js'
import { createSignal } from 'solid-js'
import { _popupGa, popupGa } from '@popup/popup-helpers'

const popup_bug = getMessage('popup_bug')
const popup_bug_alt = getMessage('popup_bug_alt')
const popup_github_repo = getMessage('popup_github_repo')
const popup_wahed_learnmore = getMessage('popup_wahed_learnmore')
const popup_interested_to_contribute = getMessage('popup_interested_to_contribute')

export const Footer: Component = () => {
  const [isCopy, setIsCopy] = createSignal(false)

  return (
    <>
      <a
        onClick={_popupGa('click', 'github_bugs')}
        class='flex text-gray-300 hover:underline'
        target='_blank'
        rel='noopener noreferrer'
        title={popup_bug_alt}
        href={pkg.bugs.url}>
        <img class='mr-2' src='/assets/icons/github.svg' alt='github icon' width='17px' height='20px' />
        {popup_bug}
      </a>
      <a
        onClick={_popupGa('click', 'github')}
        class='flex text-gray-300 hover:underline'
        target='_blank'
        rel='noopener noreferrer'
        title={popup_github_repo}
        href='https://github.com/AzrizHaziq/tradingview-syariah-indicator'>
        <img class='mr-2' src='/assets/icons/github.svg' alt='github icon' width='17px' height='20px' />
        {popup_interested_to_contribute}
      </a>
      <hr class='my-1 border-gray-400 opacity-30' />
      <div class='flex items-center w-full'>
        <a
          href='https://tsi.azrizhaziq.com/wahed'
          onClick={_popupGa('click', 'wahed')}
          target='_blank'
          rel='noopener noreferrer'
          title={popup_wahed_learnmore}>
          <div class='flex items-center gap-1'>
            <div class='px-2 py-1 bg-white rounded'>
              <img
                alt='wahed azrizhaziq referer code'
                src='/assets/wahed.png'
                class='w-full h-[15px] aspect-w-16 aspect-h-9'
              />
            </div>
            <div class='text-white'>
              <svg
                stroke='currentColor'
                fill='currentColor'
                stroke-width='0'
                viewBox='0 0 16 16'
                height='1em'
                width='1em'
                xmlns='http://www.w3.org/2000/svg'>
                <path d='M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z' />
              </svg>
            </div>
          </div>
        </a>
        <div
          class='inline-flex ml-auto rounded-md shadow-sm'
          role='group'
          onClick={() =>
            copy('azrjas3', () => {
              setIsCopy(true)
              setTimeout(() => setIsCopy(false), 1000)
              popupGa({
                hitType: 'event',
                eventAction: 'click',
                eventCategory: 'extension::referrer_code',
                eventLabel: 'popup',
              })
            })
          }>
          <span class='px-2 py-1 text-sm font-medium text-white text-gray-500 bg-gray-200 rounded-l-lg cursor-not-allowed'>
            azrjas3
          </span>
          <button
            type='button'
            class='px-2 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-r-md hover:text-green-900 focus:z-10 focus:ring-2 focus:ring-green-700 focus:text-green-700'>
            {isCopy() ? 'Thank you !!' : 'Copy'}
          </button>
        </div>
      </div>
    </>
  )
}

export const copy = (value, successfully = () => null, failure = () => null): void => {
  const clipboard = navigator.clipboard
  if (clipboard !== undefined) {
    navigator.clipboard.writeText(value).then(successfully, failure)
  } else {
    if (document.execCommand) {
      let el: HTMLInputElement = document.createElement('input')
      el.value = value
      document.body.append(el)

      el.select()
      el.setSelectionRange(0, value.length)

      if (document.execCommand('copy')) {
        successfully()
      }

      el.remove()
      el = null
    } else {
      failure()
    }
  }
}
