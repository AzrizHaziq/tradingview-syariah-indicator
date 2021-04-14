import { _popupGa } from '../../Helpers'
import React, { FC, useEffect } from 'react'
import { getMessage } from '../../../helper'
import { setUpdateAt, useCurrentDate } from '../../Context'

export const Flags: FC = () => {
  const [dates, dispatch] = useCurrentDate()

  useEffect(() => {
    setUpdateAt().then(flags => {
      Object.entries(flags).forEach(([flag, updatedAt]) => {
        dispatch({
          type: 'set-flag-update-at',
          payload: { flag, updatedAt: new Date(updatedAt).toLocaleDateString() },
        })
      })
    })
  }, [])

  return (
    <>
      {dates.map((flag: TSI.Flag, i: number) => {
        const { updatedAt, displayUrl, ...res } = flag
        const popup_list_at = getMessage('popup_list_at', flag.alt)

        return (
          <a
            key={i}
            target='_blank'
            rel='noopener noreferrer'
            href={displayUrl}
            title={popup_list_at}
            onClick={_popupGa('click', 'shariahAt')}
            className='cursor-pointer flex items-center text-gray-300 hover:underline'>
            <img {...res} />
            <p className='ml-1 text-xs'>{updatedAt}</p>
          </a>
        )
      })}
    </>
  )
}
