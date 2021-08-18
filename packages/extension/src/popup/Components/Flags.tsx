import type { Component } from 'solid-js'
import { For } from 'solid-js'
import { _popupGa } from './../Helpers'
import { getMessage, isValidDate } from './../../helper'
import { CurrentDateStore } from '../Helpers/popup.store'

export const Flags: Component = () => {
  // const [dates, dispatch] = useCurrentDate()

  // useEffect(() => {
  //   setUpdateAt().then(exchanges => dispatch({ type: 'init', payload: exchanges }))
  // }, [])

  return (
    <For each={CurrentDateStore.list}>{e => <div>{e}</div>}</For>
    //   {dates.map((flag: TSI.Flag) => {
    //     const { updatedAt, id } = flag
    //     const popup_list_at = getMessage('popup_list_at', id)
    //     const lastDate = isValidDate(new Date(updatedAt)) ? new Date(updatedAt).toLocaleDateString() : '--'
    //     const href = `https://github.com/AzrizHaziq/tradingview-syariah-indicator/blob/master/packages/extension/assets/exchanges/${id}.txt`
    //
    //     return (
    //       <a
    //         key={id}
    //         href={href}
    //         target='_blank'
    //         title={popup_list_at}
    //         rel='noopener noreferrer'
    //         onClick={_popupGa('click', 'shariahAt')}
    //         className='cursor-pointer flex items-center text-gray-300 hover:underline'>
    //         <img
    //           className='rounded-full'
    //           style={{ width: '18px', height: '18px' }}
    //           src={`/assets/exchanges/${id}.svg`}
    //           alt={`Exchange: ${id}`}
    //         />
    //         <p className='ml-1 text-xs'>{lastDate}</p>
    //       </a>
    //     )
    //   })}
    // </For>
  )
}
