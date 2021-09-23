import { For } from 'solid-js'
import { getMessage } from '@src/helper'
import { format, isDate } from 'date-fns'
import type { Component } from 'solid-js'
import { _popupGa, useCurrentData } from '@popup/popup-helpers'

export const Flags: Component = () => {
  const [currentData] = useCurrentData()

  return (
    <For each={currentData()}>
      {flag => {
        const { updatedAt, id } = flag
        const popup_list_at = getMessage('popup_list_at', id)
        const lastDate = isDate(new Date(updatedAt)) ? format(1632381584165, 'dd LLL yy') : '--'
        const href = `https://github.com/AzrizHaziq/tradingview-syariah-indicator/blob/master/packages/extension/assets/exchanges/${id}.txt`

        return (
          <a
            href={href}
            target='_blank'
            title={popup_list_at}
            rel='noopener noreferrer'
            onClick={_popupGa('click', 'shariahAt')}
            class='cursor-pointer gap-x-2 flex justify-between text-gray-300'>
            <div class='flex gap-x-2'>
              <img
                class='rounded-full'
                style={{ width: '15px', height: '15px' }}
                src={`/assets/exchanges/${id}.svg`}
                alt={`Exchange: ${id}`}
              />
              <p>{id}</p>
            </div>
            <p class='text-xs'>{lastDate}</p>
          </a>
        )
      }}
    </For>
  )
}
