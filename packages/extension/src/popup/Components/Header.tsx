import { getMessage } from '@src/helper'
import type { Component } from 'solid-js'
import { _popupGa } from '@popup/popup-helpers'

const name = getMessage('ext_extension_name')
const githubUrl = 'https://azrizhaziq.github.io/tradingview-syariah-indicator'

export const Header: Component = () => (
  <a
    onClick={_popupGa('click', 'homepage')}
    class='text-green-500 text-base'
    target='_blank'
    rel='noopener noreferrer'
    href={githubUrl}>
    {name}
  </a>
)
