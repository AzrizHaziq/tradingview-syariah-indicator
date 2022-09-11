import { getMessage, setStorage } from '@src/helper'
import { createSignal, onMount, Show } from 'solid-js'
import { getStorageDetails, tsiStore, updateDataSource, updateFlags } from '@popup/popup-helpers'
import { Footer, Header, Version, Flags, RefreshData, ToggleDateAndCount, InputState } from '@popup/Components'

export const Popup = () => {
  onMount(() => {
    document.body.focus()
    getStorageDetails().then(updateFlags)
  })

  const onClickHandle = (e) => {
    if (e.target.checked) {
      updateDataSource(e.target.value)
      setStorage('DATASOURCE', e.target.value)
    }
  }

  return (
    <div class='h-full p-2 text-white space-y-3'>
      <div class='flex align-center justify-center gap-2'>
        <img src='/assets/shariah-icon.svg' alt='Tradingview shariah icon' width='25px' height='25px' />
        <Header />
      </div>

      <DefaultDataSource onClickHandle={onClickHandle} />
      <MergeDataSource onClickHandle={onClickHandle} />
      <OwnDataSource onClickHandle={onClickHandle} />

      <div class='flex flex-col justify-start text-xs gap-1'>
        <Footer />
      </div>
    </div>
  )
}

const DefaultDataSource = (props) => {
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

const MergeDataSource = (props) => {
  return (
    <div
      class='border bg-gray-800 border-1 border-green-300 rounded'
      classList={{ 'opacity-25': tsiStore.dataSource !== 'merge' }}>
      <label class='cursor-pointer p-2 w-full flex items-center'>
        <div class='flex items-center mr-auto'>
          <input
            value='merge'
            checked={tsiStore.dataSource === 'merge'}
            onClick={props.onClickHandle}
            type='radio'
            class='w-3 h-3 text-blue-600 bg-green-100 rounded border-green-300 mr-2'
          />
          <span>{getMessage('popup_datasource_merge')}</span>
        </div>
        <div class='items-center flex'>
          <InputState state={''} />
        </div>
      </label>
      <Show when={tsiStore.dataSource === 'merge'}>
        <div class='px-2 pb-2'>
          <textarea
            id='message'
            rows='2'
            class='p-2 block w-full text-gray-900 rounded border border-green-100'
            placeholder=''
          />
        </div>
      </Show>
    </div>
  )
}

const OwnDataSource = (props) => {
  return (
    <div
      class='border bg-gray-800 border-1 border-green-300 rounded'
      classList={{ 'opacity-25': tsiStore.dataSource !== 'own' }}>
      <label class='cursor-pointer p-2 w-full flex items-center'>
        <span class='flex items-center'>
          <input
            value='own'
            checked={tsiStore.dataSource === 'own'}
            onClick={props.onClickHandle}
            type='radio'
            class='w-3 h-3 text-blue-600 bg-green-100 rounded border-green-300 mr-2'
          />
          <span>{getMessage('popup_datasource_own')}</span>
        </span>

        <div class='items-center flex'>
          <InputState state={''} />
        </div>
      </label>

      <Show when={tsiStore.dataSource === 'own'}>
        <div class='px-2 pb-2'>
          <textarea
            id='message'
            rows='2'
            class='p-2 block w-full text-gray-900 rounded border border-green-100'
            placeholder=''
          />
        </div>
      </Show>
    </div>
  )
}
