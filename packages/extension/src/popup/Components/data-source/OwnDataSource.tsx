import type { StorageMap } from '@app/type'
import { tsiStore } from '@popup/popup-helpers'
import type { JSX } from 'solid-js/h/jsx-runtime'
import { createSignal, onMount, Show } from 'solid-js'
import { InputState, InputStateTypes } from '@popup/Components'
import { debounce, getMessage, getStorage, isFormatCorrect, isValidJson, required, setStorage } from '@src/helper'

const [value, setValue] = createSignal<string>('')
const [errMsg, setErrMsg] = createSignal<string>('')
const [inputState, setInputState] = createSignal<InputStateTypes>('')

const clickHandler = async (val) => {
  try {
    required(val)
    const json = isValidJson(val)
    isFormatCorrect(json)

    setErrMsg('')
    setInputState('success')
    await setStorage('DATASOURCE_OWN', json as unknown as StorageMap['LIST'])

    return json
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

  return (
    <div
      class='border bg-gray-800 border-1 border-green-300 rounded'
      classList={{ 'opacity-25': tsiStore.dataSource !== 'own' }}>
      <label class='cursor-pointer p-2 w-full flex items-center'>
        <div class='flex items-center mr-auto'>
          <input
            value='own'
            checked={tsiStore.dataSource === 'own'}
            onClick={props.onClickHandle}
            type='radio'
            class='w-3 h-3 text-blue-600 bg-green-100 rounded border-green-300 mr-2'
          />
          <span>{getMessage('popup_datasource_own')}</span>
        </div>

        <div class='items-center flex'>
          <InputState state={inputState()} />
        </div>
      </label>

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
