import { For } from 'solid-js'
import { getMessage } from '@src/helper'
import type { Component } from 'solid-js'
import { homepage as href } from '../../../package.json'
import { _popupGa, useCurrentData } from '@popup/popup-helpers'

export const Flags: Component = () => {
  const [currentData] = useCurrentData()

  return (
    <For each={currentData()}>
      {(flag) => {
        const { updatedAt, id } = flag
        const popup_list_at = getMessage('popup_list_at', id)

        return (
          <a
            href={href}
            target='_blank'
            title={popup_list_at}
            rel='noopener noreferrer'
            onClick={_popupGa('click', 'shariahAt')}
            class='flex justify-between text-gray-300 cursor-pointer gap-x-2'>
            <div class='flex gap-x-2'>
              <img
                class='rounded-full'
                style={{ width: '15px', height: '15px' }}
                src={`/assets/exchanges/${id}.svg`}
                alt={`Exchange: ${id}`}
              />
              <p>{id}</p>
            </div>
            <p class='text-xs'>{updatedAt}</p>
          </a>
        )
      }}
    </For>
  )
}
