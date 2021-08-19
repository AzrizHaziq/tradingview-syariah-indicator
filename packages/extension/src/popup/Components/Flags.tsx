import type { Component } from 'solid-js'
// import { createContext, For, JSXElement, useContext } from 'solid-js'
// import { _popupGa } from './../Helpers'
// import { getMessage, isValidDate } from './../../helper'
import { useCounter } from '../Helpers/popup.store'

export const Flags: Component = () => {
  const [count, { increment, decrement }] = useCounter()

  return (
    <>
      <div>{count()}</div>
      <button onClick={increment} class='p-2 bg-red-300'>
        +
      </button>
      <button onClick={decrement} class='p-2 ml-2 bg-green-400'>
        -
      </button>
    </>

    // <For each={state.count}>{e => <div>{e}</div>}</For>
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
    //         class='cursor-pointer flex items-center text-gray-300 hover:underline'>
    //         <img
    //           class='rounded-full'
    //           style={{ width: '18px', height: '18px' }}
    //           src={`/assets/exchanges/${id}.svg`}
    //           alt={`Exchange: ${id}`}
    //         />
    //         <p class='ml-1 text-xs'>{lastDate}</p>
    //       </a>
    //     )
    //   })}
    // </For>
  )
}
