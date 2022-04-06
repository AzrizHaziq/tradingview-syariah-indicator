import { getMessage } from '@src/helper'
import type { Component } from 'solid-js'
import pkg from './../../../package.json'

const name = getMessage('ext_extension_name')

export const Header: Component = () => (
  <a class='text-base text-green-500' target='_blank' rel='noopener noreferrer' href={pkg.homepage}>
    {name}
  </a>
)
