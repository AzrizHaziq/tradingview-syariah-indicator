import React, { FC } from 'react'

interface Flag {
  id: string
  src: string
  alt: string
  width: string
  height: string
}

const flags: Flag[] = [{ id: 'MYX', src: '/assets/flag/MYX.svg', alt: 'Malaysia', width: '20px', height: '10px' }]

export const Flags: FC = () => {
  return (
    <>
      {flags.map((flag: Flag) => (
        <a className='flex items-center text-gray-300 hover:underline'>
          <img {...flag} />
          <p className='ml-1 text-xs'>19/03/2021</p>
        </a>
      ))}
    </>
  )
}
