import { _popupGa } from './../Helpers'
import { getMessage } from './../../helper'
import type { Component } from 'solid-js'
import { browser } from 'webextension-polyfill-ts'

const { version } = browser.runtime.getManifest()
const popup_version = getMessage('popup_version')
const releaseUrl = 'https://github.com/AzrizHaziq/tradingview-syariah-indicator/releases'

export const Version: Component = () => (
  <a
    onClick={_popupGa('click', 'version')}
    title={popup_version}
    className='text-gray-300 text-xs hover:underline'
    rel='noopener noreferrer'
    target='_blank'
    href={releaseUrl}>
    ({version})
  </a>
)
