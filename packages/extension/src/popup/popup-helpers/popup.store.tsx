import type { Flag } from '@app/type'
import { getStorage } from '@src/helper'

import { createSignal, createContext, useContext, Component, Accessor, JSX } from 'solid-js'

type CurrentDataStore = [Accessor<Flag[]>, { setState?: (item: Flag[]) => void }]

const CurrentDataContext = createContext<CurrentDataStore>([() => [], {}])

export const useCurrentData = (): CurrentDataStore => useContext(CurrentDataContext)

export const CurrentDataProvider: Component<{ value: Flag[]; children: JSX.Element }> = (props) => {
  const [state, setState] = createSignal(props.value || [])
  const store: CurrentDataStore = [
    state,
    {
      setState(item) {
        setState(item)
      },
    },
  ]

  return <CurrentDataContext.Provider value={store}>{props.children}</CurrentDataContext.Provider>
}

export async function getStorageDetails(): Promise<Flag[]> {
  try {
    const DETAILS = await getStorage('DETAILS')

    if (process.env.NODE_ENV !== 'production') {
      return DETAILS.map((i) => ({
        ...i,
        updatedAt: `${Math.floor(Math.random() * 12)}/${Math.floor(Math.random() * 25)}/2021`,
      }))
    }

    return DETAILS
  } catch {
    throw new Error('Failed to get data from browser storage in popup')
  }
}
