import pkg from '../../../package.json'
import { getMessage } from '@src/helper'
import type { Component } from 'solid-js'
import { Accessor, For } from 'solid-js'
import { _popupGa, useCurrentData } from '@popup/popup-helpers'

const popup_bug_in_flag = getMessage('popup_bug_in_flag')
export const Flags: Component<{ view: Accessor<'date' | 'count'> }> = (props) => {
  const [currentData] = useCurrentData()

  return currentData().length ? (
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
            onClick={_popupGa('click', 'shariahAt')}
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
  ) : (
    <div class='px-1 py-2 font-bold text-center text-red-400 border-2 border-red-400 rounded bg-red-50 col-span-2'>
      {popup_bug_in_flag}
    </div>
  )
}
