import { getStorage } from '../../helper'
import { createStore } from 'solid-js/store'

const [state, setState] = createStore({
  list: [],
})

export const CurrentDateStore = state

export async function getStorageDetails(): Promise<TSI.Flag[]> {
  try {
    const DETAILS = await getStorage('DETAILS')

    if (process.env.NODE_ENV !== 'production') {
      return DETAILS.map(i => ({
        ...i,
        updatedAt: `${Math.floor(Math.random() * 12)}/${Math.floor(Math.random() * 25)}/2021`,
      }))
    }

    console.log(DETAILS)
    setState('list', DETAILS)
  } catch {
    throw new Error('Failed to get data from browser storage in popup')
  }
}
