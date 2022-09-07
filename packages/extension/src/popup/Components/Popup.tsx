import { getMessage } from '@src/helper'
import { createSignal, onMount, Show } from 'solid-js'
import { getStorageDetails, tsiStore, updateDataSource, updateFlags } from '@popup/popup-helpers'
import { Footer, Header, Version, Flags, RefreshData, ToggleDateAndCount } from '@popup/Components'

export const Popup = () => {
  const [view, setView] = createSignal<'date' | 'count'>('date')

  onMount(() => {
    document.body.focus()
    getStorageDetails().then(updateFlags)
  })

  const onClickHandle = (e) => {
    if (e.target.checked) {
      updateDataSource(e.target.value)
    }
  }

  return (
    <div class='h-full p-2 text-white space-y-3'>
      <div class='flex align-center justify-center gap-2'>
        <img src='/assets/shariah-icon.svg' alt='Tradingview shariah icon' width='25px' height='25px' />
        <Header />
      </div>

      {/* DEFAULT datasource */}
      <hr class='border-gray-700 opacity-30' />
      <div classList={{ 'opacity-25': tsiStore.dataSource !== 'default' }}>
        <div class='flex items-center ml-auto justify-end'>
          <div class='mr-auto flex items-center space-x-2'>
            <input
              checked={tsiStore.dataSource === 'default'}
              onClick={onClickHandle}
              id='default-radio'
              type='radio'
              value='default'
              class='w-3 h-3 text-blue-600 bg-green-100 rounded border-green-300 focus:ring-blue-500 focus:ring-2'
            />
            <label for='default-radio' class='text-sm text-gray-200 select-none'>
              {getMessage('popup_datasource_default')}
            </label>
          </div>
          <RefreshData />
          <div class='mr-2' />
          <ToggleDateAndCount view={view} setView={setView} />
          <div class='mr-2' />
          <Version />
        </div>
        <div class='mt-1 text-white grid grid-cols-2 gap-x-2'>
          <Flags view={view} />
        </div>
      </div>

      {/* MERGE datasource*/}
      <hr class='border-gray-700 opacity-30' />
      <div classList={{ 'opacity-25': tsiStore.dataSource !== 'merge' }}>
        <div class='mr-auto flex items-center space-x-2'>
          <input
            checked={tsiStore.dataSource === 'merge'}
            onClick={onClickHandle}
            id='merge-radio'
            type='radio'
            value='merge'
            class='w-3 h-3 text-blue-600 bg-green-100 rounded border-green-300 focus:ring-blue-500 focus:ring-2'
          />
          <label for='merge-radio' class='text-sm text-gray-200 select-none'>
            {getMessage('popup_datasource_merge')}
          </label>
        </div>
        <div class='items-center'>
          <Show when={tsiStore.dataSource === 'merge'}>asdasdas</Show>
        </div>
      </div>

      {/* OWN datasource */}
      <hr class='border-gray-700 opacity-30' />
      <div classList={{ 'opacity-25': tsiStore.dataSource !== 'own' }}>
        <div class='mr-auto flex items-center space-x-2'>
          <input
            checked={tsiStore.dataSource === 'own'}
            onClick={onClickHandle}
            id='own-radio'
            type='radio'
            value='own'
            class='w-3 h-3 text-blue-600 bg-green-100 rounded border-green-300 focus:ring-blue-500 focus:ring-2'
          />
          <label for='own-radio' class='text-sm text-gray-200 select-none'>
            {getMessage('popup_datasource_own')}
          </label>
        </div>

        <div class='items-center'>
          <Show when={tsiStore.dataSource === 'own'}>asdasdas</Show>
        </div>
      </div>

      <hr class='my-2 border-gray-400 opacity-30' />
      <div class='flex flex-col justify-start text-xs gap-1'>
        <Footer />
      </div>
    </div>
  )
}
