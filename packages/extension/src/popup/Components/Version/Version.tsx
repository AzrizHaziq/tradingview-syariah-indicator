import React, { FC } from 'react'
import { _popupGa } from '../../Helpers'
import { getMessage } from '../../../helper'
import { browser } from 'webextension-polyfill-ts'

const { version } = browser.runtime.getManifest()
const releaseUrl = 'https://github.com/AzrizHaziq/tradingview-syariah-indicator/releases'
const popup_version = getMessage('popup_version')

export const Version: FC = () => (
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
