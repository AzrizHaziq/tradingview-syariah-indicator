import { createSignal } from 'solid-js'
import { tsiStore } from '@popup/popup-helpers'
import { getMessage } from '@src/helper'
import { Flags, RefreshData, ToggleDateAndCount, Version } from '@popup/Components'

export const DefaultDataSource = (props) => {
  const [view, setView] = createSignal<'date' | 'count'>('date')

  return (
    <div
      class='border bg-gray-800 border-1 border-green-300 rounded'
      classList={{ 'opacity-25': tsiStore.dataSource !== 'default' }}>
      <div class='flex items-center'>
        <label class='cursor-pointer p-2 w-full flex items-center mr-auto'>
          <input
            value='default'
            checked={tsiStore.dataSource === 'default'}
            onClick={props.onClickHandle}
            type='radio'
            class='w-3 h-3 text-blue-600 bg-green-100 rounded border-green-300 mr-2'
          />
          <span>{getMessage('popup_datasource_default')}</span>
        </label>
        <div class='flex gap-2 items-center pr-2'>
          <RefreshData />
          <ToggleDateAndCount view={view} setView={setView} />
          <Version />
        </div>
      </div>

      <div class='px-2 pb-2 text-white grid grid-cols-2 gap-x-2'>
        <Flags view={view} />
      </div>
    </div>
  )
}
