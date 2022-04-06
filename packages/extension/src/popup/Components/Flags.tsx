import pkg from '../../../package.json'
import { getMessage } from '@src/helper'
import type { Component } from 'solid-js'
import { Accessor, For } from 'solid-js'
import { useCurrentData } from '@popup/popup-helpers'

export const Flags: Component<{ view: Accessor<'date' | 'count'> }> = (props) => {
  const [currentData] = useCurrentData()

  return (
    <For each={currentData()}>
      {(flag) => {
        const { updatedAt, id, counts } = flag
        const popup_list_at = getMessage('popup_list_at', id)

        return (
          <a
            href={`${pkg.homepage}/list?exchange=${id}`}
            target='_blank'
            title={popup_list_at}
            rel='noopener noreferrer'
            class='flex justify-between text-gray-300 cursor-pointer gap-x-2'>
            <div class='flex gap-x-2'>
              <img
                class='rounded-full'
                alt={`Exchange: ${id}`}
                src={`/assets/exchanges/${id}.svg`}
                style={{
                  width: '15px',
                  height: '15px',
                }}
              />
              <p>{id}</p>
            </div>
            <p class='text-xs'>{props.view() === 'date' ? updatedAt : counts}</p>
          </a>
        )
      }}
    </For>
  )
}
