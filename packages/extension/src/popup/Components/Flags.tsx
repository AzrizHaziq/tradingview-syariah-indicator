import { For } from 'solid-js'
import type { Component } from 'solid-js'
import { getMessage, isValidDate } from '@src/helper'
import { _popupGa, useCurrentData } from '@popup/popup-helpers'

export const Flags: Component = () => {
  const [currentData] = useCurrentData()

  return (
    <For each={currentData()}>
      {flag => {
        const { updatedAt, id } = flag
        const popup_list_at = getMessage('popup_list_at', id)
        const lastDate = isValidDate(new Date(updatedAt)) ? new Date(updatedAt).toLocaleDateString() : '--'
        const href = `https://github.com/AzrizHaziq/tradingview-syariah-indicator/blob/master/packages/extension/assets/exchanges/${id}.txt`

        return (
          <a
            href={href}
            target='_blank'
            title={popup_list_at}
            rel='noopener noreferrer'
            onClick={_popupGa('click', 'shariahAt')}
            class='cursor-pointer gap-x-2 flex items-center text-gray-300 hover:underline'>
            <p>{id}</p>
            <p class='text-xs'>{lastDate}</p>
            <img
              class='rounded-full'
              style={{ width: '15px', height: '15px' }}
              src={`/assets/exchanges/${id}.svg`}
              alt={`Exchange: ${id}`}
            />
          </a>
        )
      }}
    </For>
  )
}
