import { getMessage } from '@src/helper'
import type { Component } from 'solid-js'
import pkg from './../../../package.json'
import { _popupGa } from '@popup/popup-helpers'

const name = getMessage('ext_extension_name')

export const Header: Component = () => (
  <a
    onClick={_popupGa('click', 'homepage')}
    class='text-base text-green-500'
    target='_blank'
    rel='noopener noreferrer'
    href={pkg.homepage}>
    {name}
  </a>
)
