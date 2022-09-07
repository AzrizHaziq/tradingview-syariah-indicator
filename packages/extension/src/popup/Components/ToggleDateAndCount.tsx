import { getMessage } from '@src/helper'
import type { Accessor, Component } from 'solid-js'

const popup_change_view_to_date = getMessage('popup_change_view_to_date')
const popup_change_view_to_count = getMessage('popup_change_view_to_count')

export const ToggleDateAndCount: Component<{
  view: Accessor<'date' | 'count'>
  setView: (view: 'date' | 'count') => void
}> = (prop) => {
  return (
    <button
      type='button'
      onClick={() => {
        prop.view() === 'date' ? prop.setView('count') : prop.setView('date')
      }}>
      {prop.view() === 'date' ? (
        <svg
          stroke='currentColor'
          fill='white'
          stroke-width='0'
          viewBox='0 0 16 16'
          height='1em'
          width='1em'
          xmlns='http://www.w3.org/2000/svg'>
          <title>{popup_change_view_to_count}</title>
          <path
            fill-rule='evenodd'
            clip-rule='evenodd'
            d='M14.5 2H13V1h-1v1H4V1H3v1H1.5l-.5.5v12l.5.5h13l.5-.5v-12l-.5-.5zM14 14H2V5h12v9zm0-10H2V3h12v1zM4 8H3v1h1V8zm-1 2h1v1H3v-1zm1 2H3v1h1v-1zm2-4h1v1H6V8zm1 2H6v1h1v-1zm-1 2h1v1H6v-1zm1-6H6v1h1V6zm2 2h1v1H9V8zm1 2H9v1h1v-1zm-1 2h1v1H9v-1zm1-6H9v1h1V6zm2 2h1v1h-1V8zm1 2h-1v1h1v-1zm-1-4h1v1h-1V6z'
          />
        </svg>
      ) : (
        <svg
          stroke='currentColor'
          fill='white'
          stroke-width='0'
          viewBox='0 0 1024 1024'
          height='1em'
          width='1em'
          xmlns='http://www.w3.org/2000/svg'>
          <title>{popup_change_view_to_date}</title>
          <path d='M872 394c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8H708V152c0-4.4-3.6-8-8-8h-64c-4.4 0-8 3.6-8 8v166H400V152c0-4.4-3.6-8-8-8h-64c-4.4 0-8 3.6-8 8v166H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h168v236H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h168v166c0 4.4 3.6 8 8 8h64c4.4 0 8-3.6 8-8V706h228v166c0 4.4 3.6 8 8 8h64c4.4 0 8-3.6 8-8V706h164c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8H708V394h164zM628 630H400V394h228v236z' />
        </svg>
      )}
    </button>
  )
}
