import pkg from '../../../../package.json'
import type { StorageMap } from '@app/shared'
import { tsiStore } from '@popup/popup-helpers'
import type { JSX } from 'solid-js/h/jsx-runtime'
import { createEffect, createSignal, onMount, Show } from 'solid-js'
import { InputState, InputStateTypes } from '@popup/Components'
import { getMessage, getStorage, setStorage } from '@src/helper'
import { debounce, isValidJson, required, isFormatCorrect } from '@app/shared'

const popup_info = getMessage('popup_info')
const [value, setValue] = createSignal<string>('')
const [errMsg, setErrMsg] = createSignal<string>('')
const [inputState, setInputState] = createSignal<InputStateTypes>('')

const clickHandler = async (val) => {
  try {
    required(val)
    const json: StorageMap['LIST'] = isValidJson(val)
    isFormatCorrect(json)

    setErrMsg('')
    setInputState('success')

    await setStorage('DATASOURCE_OWN', json)
  } catch (e) {
    setErrMsg(e.msg)
    console.error(e)
    setInputState('error')
    throw Error(e)
  }
}

const _clickHandler = debounce(clickHandler, 200, false)

type Prop = { onClickHandle: JSX.EventHandlerUnion<HTMLInputElement, MouseEvent> }
export const OwnDataSource = (props: Prop) => {
  onMount(async () => {
    const DATASOURCE_OWN = await getStorage('DATASOURCE_OWN')

    if (DATASOURCE_OWN) {
      setValue(JSON.stringify(DATASOURCE_OWN))
    }
  })

  createEffect(() => {
    // if user change to other source and if currently error
    if (tsiStore.dataSource !== 'own') {
      setValue('')
      setErrMsg('')
      setInputState('')
    }
  })

  return (
    <div
      class='border bg-gray-800 border-1 border-green-300 rounded'
      classList={{ 'opacity-25': tsiStore.dataSource !== 'own' }}>
      <div class='flex items-center p-2 w-full'>
        <label class='cursor-pointer flex items-center mr-auto w-full' for='datasource-own'>
          <div class='flex items-center mr-auto gap-2'>
            <input
              id='datasource-own'
              value='own'
              checked={tsiStore.dataSource === 'own'}
              onClick={props.onClickHandle}
              type='radio'
              class='w-3 h-3 text-blue-600 bg-green-100 rounded border-green-300'
            />
            <span>{getMessage('popup_datasource_own')}</span>
          </div>
        </label>

        <div class='items-center flex gap-2'>
          <InputState state={inputState()} />
          <a
            href={pkg.homepage + '/data-source'}
            target='_blank'
            rel='noopener noreferrer'
            class='cursor-pointer hover:border-red-400'
            title={popup_info}>
            <svg width='15px' height='15px' viewBox='0 0 24 24'>
              <path
                fill='currentColor'
                d='M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z'
              />
            </svg>
          </a>
        </div>
      </div>

      <Show when={tsiStore.dataSource === 'own'}>
        <div class='px-2 pb-2'>
          <textarea
            id='own-text-area'
            rows='2'
            value={value()}
            class='p-2 block w-full text-gray-900 rounded border border-green-100'
            placeholder='[ ["MYX:MAYBANK", {"s": 1}], ["NASDAQ:GOOG", {"s": 1}], ["TSX:RY", {"s": 1}] ]'
            onInput={(e) => {
              const val = (e.target as HTMLTextAreaElement).value
              setInputState('loading')
              setValue(val)
              _clickHandler(val)
            }}
          />
        </div>
        <Show when={errMsg()}>
          <p class='text-red-200 px-2 pb-2'>{errMsg()}</p>
        </Show>
      </Show>
    </div>
  )
}
