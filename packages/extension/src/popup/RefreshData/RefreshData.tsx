import React, { useState, FC } from 'react'

export const RefreshData: FC = () => {
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <svg
      className={`${loading ? 'is-loading' : ''} tsi-refresh-icon`}
      enableBackground='new 0 0 76 76'
      viewBox='0 0 76 76'
      height='24'
      width='24'
      xmlns='http://www.w3.org/2000/svg'>
      <path
        d='m38 20.5833c4.9908 0 9.4912 2.0992 12.6667 5.4627v-8.6293l4.7499 4.75.0001 12.6666h-12.6667l-4.75-4.75h8.8512c-2.1744-2.4294-5.3342-3.9583-8.8512-3.9583-6.0215 0-10.9963 4.4818-11.7704 10.2917h-5.5753c.8-8.877 8.2605-15.8334 17.3457-15.8334zm0 29.2917c6.0215 0 10.9963-4.4818 11.7703-10.2917h5.5754c-.8 8.877-8.2605 15.8334-17.3457 15.8334-4.9908 0-9.4912-2.0992-12.6667-5.4627v8.6293l-4.75-4.75v-12.6666h12.6667l4.75 4.75h-8.8513c2.1744 2.4294 5.3343 3.9583 8.8513 3.9583z'
        strokeLinejoin='round'
        strokeWidth='.2'
      />
    </svg>
  )
}
