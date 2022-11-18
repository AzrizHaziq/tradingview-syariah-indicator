import { onMount } from 'solid-js'
import { setStorage } from '@src/helper'
import { getStorageDetails, updateDataSource, updateFlags } from '@popup/popup-helpers'
import { Footer, Header, DefaultDataSource, MergeDataSource, OwnDataSource } from '@popup/Components'

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
