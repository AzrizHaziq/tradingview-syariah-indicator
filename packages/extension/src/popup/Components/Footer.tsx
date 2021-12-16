import { getMessage } from '@src/helper'
import type { Component } from 'solid-js'
import { _popupGa } from '@popup/popup-helpers'

const popup_tg_group = getMessage('popup_tg_group')
const popup_github_repo = getMessage('popup_github_repo')
const popup_bug_or_suggestion = getMessage('popup_bug_or_suggestion')
const popup_interested_to_contribute = getMessage('popup_interested_to_contribute')

export const Footer: Component = () => (
  <>
    <a
      onClick={_popupGa('click', 'tg')}
      class='flex text-gray-300 hover:underline'
      target='_blank'
      rel='noopener noreferrer'
      href='https://t.me/tv_shariah'>
      <img
        class='mr-1'
        src='/assets/icons/telegram.svg'
        alt='Tradingview shariah icon'
        width='20px'
        height='20px'
        title={popup_tg_group}
      />
      {popup_bug_or_suggestion}
    </a>
    <a
      onClick={_popupGa('click', 'github')}
      class='flex text-gray-300 hover:underline'
      target='_blank'
      rel='noopener noreferrer'
      href='https://github.com/AzrizHaziq/tradingview-syariah-indicator'>
      <img
        title={popup_github_repo}
        class='mr-2'
        src='/assets/icons/github.svg'
        alt='Tradingview shariah icon'
        width='17px'
        height='20px'
      />
      {popup_interested_to_contribute}
    </a>
  </>
)
