import type { Flag } from '@app/type'
import { getStorage } from '@src/helper'
import { createStore } from 'solid-js/store'

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

// Data Store
export const [tsiStore, setStore] = createStore<{ flags: Flag[]; dataSource: DataSource }>({
  flags: [],
  dataSource: 'own',
})
export const updateFlags = (flags: Flag[]) => setStore('flags', flags)

type DataSource = 'default' | 'merge' | 'own'
export const updateDataSource = (data: DataSource) => setStore('dataSource', data)
