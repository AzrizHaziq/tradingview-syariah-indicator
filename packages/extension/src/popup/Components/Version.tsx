import { getMessage } from '@src/helper'
import type { Component } from 'solid-js'
import { _popupGa } from '@popup/popup-helpers'
import browser from 'webextension-polyfill'

const { version } = browser.runtime.getManifest()
const popup_version = getMessage('popup_version')
const releaseUrl = 'https://github.com/AzrizHaziq/tradingview-syariah-indicator/releases'

export const Version: Component = () => (
  <a
    onClick={_popupGa('click', 'version')}
    title={popup_version}
    class='text-xs text-gray-300 hover:underline'
    rel='noopener noreferrer'
    target='_blank'
    href={releaseUrl}>
    ({version})
  </a>
)
