import './RefreshData.scss'
import React, { FC, useState } from 'react'
import { setUpdateAt, useCurrentDateDispatch } from '../../Context'

const popup_refresh_icon = browser.i18n.getMessage('popup_refresh_icon')
const popup_loading_icon = browser.i18n.getMessage('popup_loading_icon')

const LoadingIcon = (
  <svg className='tsi-loading-icon mr-1' xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 15 15'>
    <title>{popup_loading_icon}</title>
    <g fillRule='evenodd'>
      <circle cx='7' cy='7' r='6' stroke='#fff' strokeOpacity='.2' strokeWidth='2' />
      <path fill='#2fcc70' fillRule='nonzero' d='M7 0a7 7 0 0 1 7 7h-2a5 5 0 0 0-5-5V0z' />
    </g>
  </svg>
)

const RefreshIcon = (
  <svg
    className='tsi-refresh-icon'
    enableBackground='new 0 0 76 76'
    viewBox='0 0 80 80'
    height='24'
    width='24'
    xmlns='http://www.w3.org/2000/svg'>
    <title>{popup_refresh_icon}</title>
    <path
      d='m38 20.5833c4.9908 0 9.4912 2.0992 12.6667 5.4627v-8.6293l4.7499 4.75.0001 12.6666h-12.6667l-4.75-4.75h8.8512c-2.1744-2.4294-5.3342-3.9583-8.8512-3.9583-6.0215 0-10.9963 4.4818-11.7704 10.2917h-5.5753c.8-8.877 8.2605-15.8334 17.3457-15.8334zm0 29.2917c6.0215 0 10.9963-4.4818 11.7703-10.2917h5.5754c-.8 8.877-8.2605 15.8334-17.3457 15.8334-4.9908 0-9.4912-2.0992-12.6667-5.4627v8.6293l-4.75-4.75v-12.6666h12.6667l4.75 4.75h-8.8513c2.1744 2.4294 5.3343 3.9583 8.8513 3.9583z'
      strokeLinejoin='round'
      strokeWidth='.2'
    />
  </svg>
)

export const RefreshData: FC = () => {
  const dispatch = useCurrentDateDispatch()
  const [loading, setLoading] = useState<boolean>(false)

  async function clickHandler() {
    setLoading(true)

    await browser.runtime.sendMessage({
      type: 'ga',
      subType: 'event',
      payload: {
        eventCategory: 'popup',
        eventAction: 'invalidate-cache',
      },
    })

    await browser.runtime.sendMessage({ type: 'invalidate-cache' }).then(() => {
      const x = setTimeout(() => {
        setLoading(false)

        setUpdateAt().then(flags => {
          Object.entries(flags).forEach(([flag, updatedAt]) => {
            dispatch({
              type: 'set-flag-update-at',
              payload: { flag, updatedAt: new Date(updatedAt).toLocaleDateString() },
            })
          })
        })

        clearTimeout(x)
      }, 2000)
    })
  }

  return loading ? LoadingIcon : <span onClick={clickHandler}>{RefreshIcon}</span>
}
